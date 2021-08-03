import {Host} from 'batis';
import {ComponentInstance} from './component';

export interface ComponentNode {
  readonly uid: symbol;

  readonly host: Host<
    (instance: ComponentInstance<any>) => [string, Promise<void>]
  >;
}

const {useRef} = Host.Hooks;

export function renderToString(
  instance: ComponentInstance<any>,
  node?: ComponentNode
): [string, ComponentNode, Promise<void>] {
  if (instance.uid !== node?.uid) {
    node?.host.reset();

    node = {
      uid: instance.uid,
      host: new Host(({props, render}) => {
        const childNodesRef = useRef<readonly ComponentNode[]>([]);
        const childNodesIterator = childNodesRef.current[Symbol.iterator]();
        const childNodes: ComponentNode[] = [];
        const childSignals: Promise<void>[] = [];
        const {strings, values} = render(props);

        let text = strings[0]!;

        for (let index = 0; index < values.length; index += 1) {
          const string = strings[index + 1]!;
          const value = values[index]!;

          switch (typeof value) {
            case 'bigint':
            case 'boolean':
            case 'number':
            case 'string': {
              text += String(value) + string;

              break;
            }
            default: {
              const [childText, childNode, childSignal] = renderToString(
                value,
                childNodesIterator.next().value
              );

              text += childText + string;

              childNodes.push(childNode);
              childSignals.push(childSignal);
            }
          }
        }

        while (true) {
          const {done, value} = childNodesIterator.next();

          if (done) {
            break;
          }

          (value as ComponentNode).host.reset();
        }

        childNodesRef.current = childNodes;

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
