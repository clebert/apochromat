import {Host} from 'batis';
import type {ComponentInstance} from './component';

type ComponentSlot = Readonly<
  | {type: 'none'}
  | {type: 'component'; host: Host<typeof useComponent>}
  | {type: 'components'; hosts: Map<string, Host<typeof useComponent>>}
>;

const {useEffect, useRef} = Host.Hooks;

export function useComponent(
  instance: ComponentInstance<any>
): [string, Promise<void>] | undefined {
  const prevTypeRef = useRef(instance.type);
  const prevSlotsRef = useRef<readonly ComponentSlot[]>([]);

  useEffect(
    () => () => {
      for (const prevSlot of prevSlotsRef.current) {
        releaseSlot(prevSlot);
      }
    },
    []
  );

  if (instance.type !== prevTypeRef.current) {
    return undefined;
  }

  const template = instance.render(instance.props);

  let text = template.strings[0];

  if (prevSlotsRef.current.length !== template.values.length) {
    for (const prevSlot of prevSlotsRef.current) {
      releaseSlot(prevSlot);
    }

    prevSlotsRef.current = [];
  }

  const signals: Promise<void>[] = [];
  const slots: ComponentSlot[] = [];

  for (let index = 0; index < template.values.length; index += 1) {
    const templateString = template.strings[index + 1]!;
    const templateValue = template.values[index]!;

    let prevSlot = prevSlotsRef.current[index];

    switch (typeof templateValue) {
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'string': {
        releaseSlot(prevSlotsRef.current[index]);

        slots.push({type: 'none'});

        text += templateValue + templateString;

        break;
      }
      default: {
        if (Array.isArray(templateValue)) {
          if (prevSlot && prevSlot.type !== 'components') {
            releaseSlot(prevSlot);

            prevSlot = undefined;
          }

          const [delimiter, ...childInstances] = templateValue as readonly [
            string,
            ...ComponentInstance<any>[]
          ];

          const childTexts: string[] = [];
          const hosts = new Map<string, Host<typeof useComponent>>();

          for (const childInstance of childInstances) {
            if (typeof childInstance.key !== 'string') {
              throw new Error('Missing key.');
            }

            let host = prevSlot?.hosts.get(childInstance.key);

            prevSlot?.hosts.delete(childInstance.key);

            let [result] = host?.render(childInstance) ?? [];

            if (result === undefined) {
              host?.reset();

              host = new Host(useComponent);
              result = host.render(childInstance)[0];
            }

            const [childText, signal] = result!;

            childTexts.push(childText);
            signals.push(host!.nextAsyncStateChange, signal);
            hosts.set(childInstance.key, host!);
          }

          if (prevSlot?.hosts) {
            for (const host of prevSlot.hosts.values()) {
              host.reset();
            }
          }

          slots.push({type: 'components', hosts});

          text += childTexts.join(delimiter) + templateString;
        } else {
          if (prevSlot && prevSlot.type !== 'component') {
            releaseSlot(prevSlot);

            prevSlot = undefined;
          }

          const childInstance = templateValue as ComponentInstance<any>;

          let host = prevSlot?.host;
          let [result] = host?.render(childInstance) ?? [];

          if (result === undefined) {
            host?.reset();

            host = new Host(useComponent);
            result = host.render(childInstance)[0];
          }

          const [childText, signal] = result!;

          signals.push(host!.nextAsyncStateChange, signal);
          slots.push({type: 'component', host: host!});

          text += childText + templateString;
        }
      }
    }
  }

  prevSlotsRef.current = slots;

  return [text, Promise.race(signals)];
}

function releaseSlot(slot: ComponentSlot | undefined): void {
  if (slot?.type === 'component') {
    slot.host.reset();
  } else if (slot?.type === 'components') {
    for (const host of slot.hosts.values()) {
      host.reset();
    }
  }
}
