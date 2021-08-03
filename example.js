// @ts-check

const {
  component,
  renderToTTY,
  template,
  useEffect,
  useState,
} = require('./lib/cjs/index.js');

/** @type {import('./lib/cjs/index.js').Component} */
const App = component(() => template`> ${Greeting({name: 'World'})}`);

/** @type {import('./lib/cjs/index.js').Component<{readonly name: string}>} */
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
