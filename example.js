// @ts-check

const {Lens} = require('./lib/cjs');
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
