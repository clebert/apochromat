export type LensListener = (event: LensEvent) => void;
export type LensEvent = 'attach' | 'detach' | 'render';

export class Lens {
  readonly #listeners = new Set<LensListener>();

  #segments: readonly string[] = [''];
  #children: readonly unknown[] = [];
  #parent?: Lens;

  get frame(): string {
    let frame = this.#segments[0]!;

    for (let index = 0; index < this.#children.length; index += 1) {
      const child = this.#children[index]!;

      frame +=
        (child instanceof Lens ? child.frame : String(child)) +
        this.#segments[index + 1];
    }

    return frame;
  }

  render(
    segments: readonly string[],
    ...children: readonly unknown[]
  ): boolean {
    const prevChildren = new Set(this.#children);

    for (const child of children) {
      if (child instanceof Lens && !prevChildren.has(child) && child.#parent) {
        return false;
      }
    }

    for (const child of children) {
      if (prevChildren.has(child)) {
        prevChildren.delete(child);
      } else if (child instanceof Lens) {
        child.#parent = this;
        child.#publish('attach');
      }
    }

    for (const child of prevChildren) {
      if (child instanceof Lens) {
        child.#parent = undefined;
        child.#publish('detach');
      }
    }

    this.#segments = segments;
    this.#children = children;
    this.#publish('render');

    return true;
  }

  subscribe(listener: LensListener): () => void {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);
    };
  }

  #publish(event: LensEvent): void {
    for (const listener of this.#listeners) {
      try {
        listener(event);
      } catch {}
    }

    if (event === 'attach' || event === 'detach') {
      for (const child of this.#children) {
        if (child instanceof Lens) {
          child.#publish(event);
        }
      }
    } else if (event === 'render' && this.#parent) {
      this.#parent.#publish(event);
    }
  }
}
