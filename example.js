// @ts-check

import {
  component,
  renderToTTY,
  template,
  useEffect,
  useState,
} from './lib/index.js';

/** @type {import('./lib/index.js').Component} */
const App = component(() => template`> ${Greeting({name: 'World'})}`);

/** @type {import('./lib/index.js').Component<{readonly name: string}>} */
const Greeting = component((props) => {
  const [salutation, setSalutation] = useState('Hello');

  useEffect(() => {
    const handle = setTimeout(() => setSalutation('Bye'), 1000);

    return () => clearTimeout(handle);
  }, []);

  return template`${salutation} ${props.name}!`;
});

renderToTTY(App()).catch((error) => {
  console.error('Oops!', error);
});
