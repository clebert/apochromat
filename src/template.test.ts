import {template} from './template.js';

describe('template()', () => {
  it('removes the first and or last line if they are blank', () => {
    expect(template``).toEqual({strings: [''], values: []});
    expect(template` \t`).toEqual({strings: [' \t'], values: []});
    expect(template` \ta \t`).toEqual({strings: [' \ta \t'], values: []});

    expect(template` \t${1} \t`).toEqual({
      strings: [' \t', ' \t'],
      values: [1],
    });

    expect(template`
    `).toEqual({strings: [''], values: []});

    expect(template` \t
    `).toEqual({strings: [''], values: []});

    expect(template` \t
      a \t
      b \t
    `).toEqual({strings: ['      a \t\n      b \t'], values: []});

    expect(template`  a \t
      b \t
    `).toEqual({strings: ['  a \t\n      b \t'], values: []});

    expect(template`
    a \t`).toEqual({strings: ['    a \t'], values: []});

    expect(template`${1}`).toEqual({strings: ['', ''], values: [1]});

    expect(template` \t
      ${1} \t
    `).toEqual({strings: ['      ', ' \t'], values: [1]});

    expect(template`
      ${1} \t
      ${2} \t
    `).toEqual({strings: ['      ', ' \t\n      ', ' \t'], values: [1, 2]});

    expect(template`  a \t
      ${1} \t
      ${2} \t
    `).toEqual({
      strings: ['  a \t\n      ', ' \t\n      ', ' \t'],
      values: [1, 2],
    });

    expect(template`
      ${1} \t
      ${2} \t
    a \t`).toEqual({
      strings: ['      ', ' \t\n      ', ' \t\n    a \t'],
      values: [1, 2],
    });
  });
});
