import {Lens, list} from '.';

describe('list', () => {
  test('rendering', () => {
    const lens = new Lens();

    lens.render(...list(','));
    expect(lens.frame).toBe('');
    lens.render(...list(',', 'foo'));
    expect(lens.frame).toBe('foo');
    lens.render(...list(',', 'foo', 'bar'));
    expect(lens.frame).toBe('foo,bar');
    lens.render(...list(',', 'foo', 'bar', 'baz'));
    expect(lens.frame).toBe('foo,bar,baz');
  });
});
