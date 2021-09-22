# apochromat

[![][ci-badge]][ci-link] [![][version-badge]][version-link]
[![][license-badge]][license-link]

[ci-badge]: https://github.com/clebert/apochromat/workflows/CI/badge.svg
[ci-link]: https://github.com/clebert/apochromat
[version-badge]: https://badgen.net/npm/v/apochromat
[version-link]: https://www.npmjs.com/package/apochromat
[license-badge]: https://badgen.net/npm/license/apochromat
[license-link]: https://github.com/clebert/apochromat/blob/master/LICENSE.md

Dynamic text rendering for interactive command line apps.

- [**@apochromat/print**][apochromat-print]: Dynamic text output for interactive
  command line apps.
- [**@apochromat/animation**][apochromat-animation]: Dynamic text animations for
  interactive command line apps.

[apochromat-animation]: https://github.com/clebert/apochromat-animation
[apochromat-print]: https://github.com/clebert/apochromat-print

## Installation

```
npm install apochromat --save
```

## Usage

### Hello World

```js
import {Lens} from 'apochromat';

const greeting = new Lens();
const salutation = new Lens();
const subject = new Lens();

greeting.subscribe((event) => {
  if (event === 'render') {
    console.log(greeting.frame);
  }
});

salutation.render`Hi`;
subject.render`everyone`;
greeting.render`${salutation}, ${subject}!`;
subject.render`world`;
salutation.render`Hello`;
```

```
Hi, everyone!
Hi, world!
Hello, world!
```

### Rendering of dynamic lists

```js
import {Lens, list} from 'apochromat';

const foobarbaz = new Lens();
const foo = new Lens();
const bar = new Lens();
const baz = new Lens();

foo.render`foo`;
bar.render`bar`;
baz.render`baz`;
foobarbaz.render(...list(',', foo, bar, baz));
console.log(foobarbaz.frame);
```

```
foo,bar,baz
```

## Types

```ts
type LensListener = (event: LensEvent) => void;
type LensEvent = 'attach' | 'detach' | 'render';

class Lens {
  get frame(): string;
  render(segments: readonly string[], ...children: readonly unknown[]): boolean;
  subscribe(listener: LensListener): () => void;
}
```

```ts
function list(
  delimiter: string,
  ...elements: readonly unknown[]
): [readonly string[], ...(readonly unknown[])];
```

---

Copyright 2021 Clemens Akens. All rights reserved.
[MIT license](https://github.com/clebert/apochromat/blob/master/LICENSE.md).
