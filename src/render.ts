import {Host} from 'batis';
import {ComponentInstance} from './component';

type ComponentSlot =
  | {readonly type: 'void'}
  | {readonly type: 'node'; node: ComponentNode}
  | {readonly type: 'list'; nodes: Map<string, ComponentNode>};

interface ComponentNode {
  readonly type: symbol;

  readonly host: Host<
    (instance: ComponentInstance<any>) => [string, Promise<void>]
  >;
}

export async function* render(
  instance: ComponentInstance<any>
): AsyncGenerator<string, never> {
  let prevNode: ComponentNode | undefined;

  try {
    while (true) {
      const [text, node, signal] = _render(instance, prevNode);

      yield text;

      prevNode = node;

      await signal;
    }
  } finally {
    prevNode?.host.reset();
  }
}

function _render(
  instance: ComponentInstance<any>,
  node?: ComponentNode
): [string, ComponentNode, Promise<void>] {
  if (instance.type !== node?.type) {
    node?.host.reset();

    let prevSlotsIterator: IterableIterator<ComponentSlot | undefined> = [][
      Symbol.iterator
    ]();

    node = {
      type: instance.type,
      host: new Host((latestInstance) => {
        const template = latestInstance.render(latestInstance.props);

        let text = template.strings[0];

        const slots: ComponentSlot[] = [];
        const childSignals: Promise<void>[] = [];

        for (let index = 0; index < template.values.length; index += 1) {
          const templateString = template.strings[index + 1]!;
          const templateValue = template.values[index]!;

          const prevSlot = prevSlotsIterator.next().value as
            | ComponentSlot
            | undefined;

          switch (typeof templateValue) {
            case 'bigint':
            case 'boolean':
            case 'number':
            case 'string': {
              slots.push({type: 'void'});

              text += templateValue + templateString;

              break;
            }
            default: {
              if (Array.isArray(templateValue)) {
                const [delimiter, ...childInstances] =
                  templateValue as readonly [
                    string,
                    ...ComponentInstance<any>[]
                  ];

                const childTexts: string[] = [];

                let prevChildNodes: Map<string, ComponentNode> | undefined;

                if (prevSlot?.type === 'list') {
                  prevChildNodes = prevSlot.nodes;
                } else if (prevSlot?.type === 'node') {
                  prevSlot.node.host.reset();
                }

                const childNodes = new Map<string, ComponentNode>();

                for (const childInstance of childInstances) {
                  if (typeof childInstance.key !== 'string') {
                    throw new Error('Missing key.');
                  }

                  const [childText, childNode, childSignal] = _render(
                    childInstance,
                    prevChildNodes?.get(childInstance.key)
                  );

                  prevChildNodes?.delete(childInstance.key);
                  childNodes.set(childInstance.key, childNode);
                  childTexts.push(childText);
                  childSignals.push(childSignal);
                }

                if (prevChildNodes) {
                  for (const prevChildNode of prevChildNodes.values()) {
                    prevChildNode.host.reset();
                  }
                }

                slots.push({type: 'list', nodes: childNodes});

                text += childTexts.join(delimiter) + templateString;
              } else {
                const childInstance = templateValue as ComponentInstance<any>;

                let prevChildNode: ComponentNode | undefined;

                if (prevSlot?.type === 'node') {
                  prevChildNode = prevSlot.node;
                } else if (prevSlot?.type === 'list') {
                  for (const {host} of prevSlot.nodes.values()) {
                    host.reset();
                  }
                }

                const [childText, childNode, childSignal] = _render(
                  childInstance,
                  prevChildNode
                );

                childSignals.push(childSignal);
                slots.push({type: 'node', node: childNode});

                text += childText + templateString;
              }
            }
          }
        }

        while (true) {
          const prevSlot = prevSlotsIterator.next().value as
            | ComponentSlot
            | undefined;

          if (!prevSlot) {
            break;
          }

          if (prevSlot.type === 'list') {
            for (const {host} of prevSlot.nodes.values()) {
              host.reset();
            }
          } else if (prevSlot.type === 'node') {
            prevSlot.node.host.reset();
          }
        }

        prevSlotsIterator = slots[Symbol.iterator]();

        return [text, Promise.race(childSignals)];
      }),
    };
  }

  const [result] = node.host.render(instance);

  return [
    result[0],
    node,
    Promise.race([node.host.nextAsyncStateChange, result[1]]),
  ];
}
