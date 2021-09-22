export function list(
  delimiter: string,
  ...elements: readonly unknown[]
): [readonly string[], ...(readonly unknown[])] {
  const segments = [''];

  for (let index = 0; index < elements.length - 1; index += 1) {
    segments.push(delimiter);
  }

  if (elements.length > 0) {
    segments.push('');
  }

  return [segments, ...elements];
}
