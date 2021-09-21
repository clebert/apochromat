# apochromat

[![][ci-badge]][ci-link] [![][version-badge]][version-link]
[![][license-badge]][license-link]

[ci-badge]: https://github.com/clebert/apochromat/workflows/CI/badge.svg
[ci-link]: https://github.com/clebert/apochromat
[version-badge]: https://badgen.net/npm/v/apochromat
[version-link]: https://www.npmjs.com/package/apochromat
[license-badge]: https://badgen.net/npm/license/apochromat
[license-link]: https://github.com/clebert/apochromat/blob/master/LICENSE.md

Rendering text using objects managed in a tree structure.

## Installation

```
npm install apochromat --save
```

## Usage

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

## Types

```ts
type LensListener = (event: LensEvent) => void;
type LensEvent = 'attach' | 'detach' | 'render';

class Lens {
  get frame(): string;
  render(segments: readonly string[], ...children: readonly Lens[]): boolean;
  subscribe(listener: LensListener): () => void;
}
```

---

Copyright 2021 Clemens Akens. All rights reserved.
[MIT license](https://github.com/clebert/apochromat/blob/master/LICENSE.md).
