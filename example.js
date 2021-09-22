// @ts-check

const {Lens, list} = require('./lib/cjs');
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

const foobarbaz = new Lens();
const foo = new Lens();
const bar = new Lens();
const baz = new Lens();

foo.render`foo`;
bar.render`bar`;
baz.render`baz`;
foobarbaz.render(...list(',', foo, bar, baz));
console.log(foobarbaz.frame);
