import {Host} from 'batis';
import type {ComponentInstance} from './component';
import {useComponent} from './use-component';

export async function* render(
  instance: ComponentInstance<any>
): AsyncGenerator<string, never> {
  const host = new Host(useComponent);

  try {
    while (true) {
      const [text, signal] = host.render(instance)[0]!;

      yield text;

      await Promise.race([host.nextAsyncStateChange, signal]);
    }
  } finally {
    host.reset();
  }
}
