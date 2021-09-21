import {Lens, LensEvent} from './lens';

describe('Lens', () => {
  test('rendering', () => {
    const a = new Lens();
    const b = new Lens();
    const c = new Lens();
    const d = new Lens();
    const listeners = [jest.fn(), jest.fn(), jest.fn(), jest.fn()] as const;
    const eventsA: LensEvent[][] = [];
    const eventsB: LensEvent[][] = [];
    const eventsC: LensEvent[][] = [];
    const eventsD: LensEvent[][] = [];

    a.subscribe(listeners[0]);
    b.subscribe(listeners[1]);
    c.subscribe(listeners[2]);
    d.subscribe(listeners[3]);

    expect(b.render`${'bar'} ${c}`).toBe(true);
    expect(a.frame).toBe('');
    expect(b.frame).toBe('bar ');
    expect(c.frame).toBe('');
    expect(d.frame).toBe('');
    eventsB.push(['render']);
    eventsC.push(['attach']);

    expect(a.render`${'foo'} ${b} ${c} ${d}`).toBe(false);
    expect(a.render`${'foo'} ${b} ${d}`).toBe(true);
    expect(a.frame).toBe('foo bar  ');
    expect(b.frame).toBe('bar ');
    expect(c.frame).toBe('');
    expect(d.frame).toBe('');
    eventsA.push(['render']);
    eventsB.push(['attach']);
    eventsC.push(['attach']);
    eventsD.push(['attach']);

    expect(c.render`${'baz'}`).toBe(true);
    expect(a.frame).toBe('foo bar baz ');
    expect(b.frame).toBe('bar baz');
    expect(c.frame).toBe('baz');
    expect(d.frame).toBe('');
    eventsA.push(['render']);
    eventsB.push(['render']);
    eventsC.push(['render']);

    expect(d.render`${'qux'}`).toBe(true);
    expect(a.frame).toBe('foo bar baz qux');
    expect(b.frame).toBe('bar baz');
    expect(c.frame).toBe('baz');
    expect(d.frame).toBe('qux');
    eventsA.push(['render']);
    eventsD.push(['render']);

    expect(a.render`${'foobar'} ${d}`).toBe(true);
    expect(a.frame).toBe('foobar qux');
    expect(b.frame).toBe('bar baz');
    expect(c.frame).toBe('baz');
    expect(d.frame).toBe('qux');
    eventsA.push(['render']);
    eventsB.push(['detach']);
    eventsC.push(['detach']);

    expect(a.render`${'foobar'} ${b}`).toBe(true);
    expect(a.frame).toBe('foobar bar baz');
    expect(b.frame).toBe('bar baz');
    expect(c.frame).toBe('baz');
    expect(d.frame).toBe('qux');
    eventsA.push(['render']);
    eventsB.push(['attach']);
    eventsC.push(['attach']);
    eventsD.push(['detach']);

    expect(listeners[0].mock.calls).toEqual(eventsA);
    expect(listeners[1].mock.calls).toEqual(eventsB);
    expect(listeners[2].mock.calls).toEqual(eventsC);
    expect(listeners[3].mock.calls).toEqual(eventsD);
  });

  test('subscription', () => {
    const lens = new Lens();

    const listener1 = jest.fn(() => {
      throw new Error();
    });

    const listener2 = jest.fn(() => {
      throw new Error();
    });

    const unsubscribe1 = lens.subscribe(listener1);
    const unsubscribe2 = lens.subscribe(listener2);

    lens.subscribe(listener1);
    lens.subscribe(listener2);

    expect(lens.render`foo`).toBe(true);
    unsubscribe1();
    expect(lens.render`bar`).toBe(true);
    unsubscribe2();
    unsubscribe2();

    expect(listener1.mock.calls).toEqual([['render']]);
    expect(listener2.mock.calls).toEqual([['render'], ['render']]);
  });
});
