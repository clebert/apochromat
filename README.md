# Apochromat

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
  renderToTTY,
  template,
  useEffect,
  useState,
} from 'apochromat';
```

```js
const App = component(() => template`> ${Greeting({name: 'World'})}`);
```

```js
const Greeting = component((props) => {
  const [salutation, setSalutation] = useState('Hello');

  useEffect(() => {
    const handle = setTimeout(() => setSalutation('Bye'), 500);

    return () => clearTimeout(handle);
  }, []);

  return template`${salutation} ${props.name}!`;
});
```

```js
renderToTTY(App()).catch((error) => {
  console.error('Oops!', error);
});
```

---

Copyright (c) 2021, Clemens Akens. Released under the terms of the
[MIT License](https://github.com/clebert/apochromat/blob/master/LICENSE).
