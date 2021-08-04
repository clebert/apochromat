# Apochromat

[![][ci-badge]][ci-link] [![][version-badge]][version-link]
[![][license-badge]][license-link] [![][types-badge]][types-link]

[ci-badge]: https://github.com/clebert/apochromat/workflows/CI/badge.svg
[ci-link]: https://github.com/clebert/apochromat
[version-badge]: https://badgen.net/npm/v/apochromat
[version-link]: https://www.npmjs.com/package/apochromat
[license-badge]: https://badgen.net/npm/license/apochromat
[license-link]: https://github.com/clebert/apochromat/blob/master/LICENSE
[types-badge]: https://badgen.net/npm/types/apochromat
[types-link]: https://github.com/clebert/apochromat

Declarative programming of interactive CLI applications.

**This software is still in a very experimental state.**

## Getting started

### Installing Apochromat

```
npm install apochromat --save
```

### Using Apochromat

```js
import {
  component,
  print,
  render,
  template,
  useEffect,
  useState,
} from 'apochromat';
```

```js
const App = component(
  () =>
    template`> ${[
      '\n> ',
      Greeting({key: 'world', props: {name: 'World'}}),
      Greeting({key: 'universe', props: {name: 'Universe'}}),
    ]}`
);
```

```js
const Greeting = component((props) => {
  const [salutation, setSalutation] = useState('Hello');

  useEffect(() => {
    const handle = setTimeout(() => setSalutation('Bye'), 1000);

    return () => clearTimeout(handle);
  }, []);

  return template`${salutation} ${props.name}!`;
});
```

```js
let prevLines;

for await (const text of render(App())) {
  prevLines = print(process.stdout, text.split('\n'), prevLines);
}
```

---

Copyright (c) 2021, Clemens Akens. Released under the terms of the
[MIT License](https://github.com/clebert/apochromat/blob/master/LICENSE).
