import {ComponentInstance} from './component.js';
import {Deferred, defer} from './defer.js';
import {ComponentNode, renderToString} from './render-to-string.js';
import {writeToTTY} from './write-to-tty.js';

export async function renderToTTY(
  instance: ComponentInstance<any>
): Promise<never> {
  let deferred: Deferred<void>;
  let lines: readonly string[] | undefined;
  let node: ComponentNode | undefined;

  while (true) {
    deferred = defer();

    const result = renderToString(instance, {
      node,
      onAsyncStateChange: (error) => {
        if (error) {
          deferred.reject(
            error instanceof Error ? error : new Error(String(error))
          );
        } else {
          deferred.resolve();
        }
      },
    });

    lines = writeToTTY(process.stdout, result[0].split('\n'), lines);
    node = result[1];

    const rerender = () => deferred.resolve();

    process.stdout.once('resize', () => rerender);

    await deferred.promise;

    process.stdout.off('resize', rerender);
  }
}
