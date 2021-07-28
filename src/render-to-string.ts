import {Host} from 'batis';
import {ComponentInstance} from './component.js';

export interface RenderToStringOptions {
  readonly node?: ComponentNode;

  onAsyncStateChange?(error: unknown): void;
}

export interface ComponentNode {
  readonly uid: symbol;
  readonly host: Host<(instance: ComponentInstance<any>) => string>;
}

const {useRef} = Host.Hooks;

export function renderToString(
  instance: ComponentInstance<any>,
  {node, onAsyncStateChange}: RenderToStringOptions = {}
): [string, ComponentNode] {
  if (instance.uid !== node?.uid) {
    node?.host.reset();

    node = {
      uid: instance.uid,
      host: new Host(
        ({props, render}) => {
          const childNodesRef = useRef<readonly ComponentNode[]>([]);
          const childNodesIterator = childNodesRef.current[Symbol.iterator]();
          const childNodes: ComponentNode[] = [];
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
                const result = renderToString(value, {
                  node: childNodesIterator.next().value,
                  onAsyncStateChange,
                });

                childNodes.push(result[1]);

                text += result[0] + string;
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

          return text;
        },
        {onAsyncStateChange}
      ),
    };
  }

  return [node.host.render(instance)[0], node];
}
