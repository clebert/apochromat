import {ComponentInstance} from './component';
import {ComponentNode, renderToString} from './render-to-string';
import {writeToTTY} from './write-to-tty';

export async function renderToTTY(
  instance: ComponentInstance<any>
): Promise<never> {
  let lines: readonly string[] | undefined;
  let prevNode: ComponentNode | undefined;

  while (true) {
    const [text, node, signal] = renderToString(instance, prevNode);

    lines = writeToTTY(process.stdout, text.split('\n'), lines);
    prevNode = node;

    let rerender: () => void;

    const resizeListener = () => rerender();

    process.stdout.once('resize', resizeListener);

    await Promise.race([
      signal,
      new Promise<void>((resolve) => (rerender = resolve)),
    ]);

    process.stdout.off('resize', resizeListener);
  }
}
