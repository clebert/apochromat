import {Template, TemplateValue} from './component';

export function template(
  strings: readonly string[],
  ...values: readonly TemplateValue[]
): Template {
  if (strings.length === 0) {
    throw new Error('Illegal arguments.');
  }

  return {
    strings: strings.map((string, index) => {
      let lines = string.split('\n');

      if (lines.length === 1) {
        return string;
      }

      const lastLine = lines[lines.length - 1];

      if (index === 0) {
        if (!lines[0]!.trim()) {
          lines = lines.slice(1);
        }

        if (strings.length === 1 && !lastLine?.trim()) {
          lines = lines.slice(0, -1);
        }

        return lines.join('\n');
      }

      if (index === strings.length - 1) {
        if (!lastLine!.trim()) {
          lines = lines.slice(0, -1);
        }

        return lines.join('\n');
      }

      return string;
    }) as [string, ...string[]],
    values,
  };
}
