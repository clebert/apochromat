// @ts-check

const {
  component,
  print,
  render,
  template,
  useEffect,
  useState,
} = require('./lib/cjs/index.js');

/** @type {import('./lib/cjs/index.js').Component} */
const App = component(
  () =>
    template`> ${[
      '\n> ',
      Greeting({key: 'world', props: {name: 'World'}}),
      Greeting({key: 'universe', props: {name: 'Universe'}}),
    ]}`
);

/** @type {import('./lib/cjs/index.js').Component<{readonly name: string}>} */
const Greeting = component((props) => {
  const [salutation, setSalutation] = useState('Hello');

  useEffect(() => {
    const handle = setTimeout(() => setSalutation('Bye'), 1000);

    return () => clearTimeout(handle);
  }, []);

  return template`${salutation} ${props.name}!`;
});

(async () => {
  let prevLines;

  for await (const text of render(App())) {
    prevLines = print(process.stdout, text.split('\n'), prevLines);
  }
})().catch((error) => console.error(error));
