import stringWidth from 'string-width';
import {WriteStream} from 'tty';

export function writeToTTY(
  stream: WriteStream,
  lines: readonly string[],
  prevLines: readonly string[] = []
): readonly string[] {
  const {columns} = stream;

  const rows = prevLines.reduce(
    (prevRows, line) =>
      prevRows + Math.max(Math.ceil(stringWidth(line) / columns), 1),
    0
  );

  if (rows > 0) {
    stream.moveCursor(0, -rows);
    stream.clearScreenDown();
  }

  for (const line of lines) {
    stream.write(line);
    stream.write('\n');
  }

  return lines;
}
