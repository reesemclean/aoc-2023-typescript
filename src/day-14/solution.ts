export const expectedPartOneSampleOutput = '136';

export function solvePartOne(input: string): string {
  const lines = input.split('\n').map((line) => line.split(''));

  const result = tiltNorth(lines);

  const sum = countNorthLoads(result);

  return sum.toString();
}

export const expectedPartTwoSampleOutput = '64';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n').map((line) => line.split(''));

  let result = lines;

  let topMatches: { [value: number]: number } = {};

  let previousTime = performance.now();

  for (let i = 0; i < 1_000_000; i++) {
    result = cycle(result);

    const thisSum = countNorthLoads(result);
    console.log(thisSum);

    const previousCount = topMatches[thisSum] ?? 0;
    topMatches[thisSum] = previousCount + 1;

    if (i % 10_000 === 0) {
      console.log(topMatches);
      topMatches = {};
    }
  }

  // This one we are cheating on right now. The pattern cycles between a few values after awhile.
  // There might be some modulo trick to figure out which one it settles on at the last cycle but
  // just guessed a few of the top matches and found the right one.

  // It does seem to be a pattern of 18 values that repeat so something with finding when it gets
  // stuck on the same values and then figuring out the modulo of the remaining cycles might work.
  //

  return 'unanswered';
}

function countNorthLoads(lines: string[][]): number {
  let sum = 0;

  const lineCount = lines.length;

  for (const [lineIndex, line] of lines.entries()) {
    const distanceFromBottom = lineCount - lineIndex;
    for (const char of line) {
      if (char === 'O') {
        sum += 1 * distanceFromBottom;
      }
    }
  }

  return sum;
}

function cycle(lines: string[][]): string[][] {
  return tiltEast(tiltSouth(tiltWest(tiltNorth(lines))));
}

function tiltNorth(lines: string[][]): string[][] {
  for (let columnIndex = 0; columnIndex < lines[0].length; columnIndex++) {
    for (let lineIndex = 0; lineIndex < lines.length - 1; lineIndex++) {
      const currentChar = lines[lineIndex][columnIndex];
      if (currentChar === 'O' || currentChar === '#') {
        continue;
      }

      for (
        let nextLineIndex = lineIndex + 1;
        nextLineIndex < lines.length;
        nextLineIndex++
      ) {
        const nextChar = lines[nextLineIndex][columnIndex];

        if (nextChar === '#') {
          lineIndex = nextLineIndex;
          break;
        } else if (nextChar === 'O') {
          lines[lineIndex][columnIndex] = 'O';
          lines[nextLineIndex][columnIndex] = '.';
          break;
        }
      }
    }
  }

  return lines;
}

function tiltSouth(lines: string[][]): string[][] {
  for (let columnIndex = 0; columnIndex < lines[0].length; columnIndex++) {
    for (let lineIndex = lines.length - 1; lineIndex > 0; lineIndex--) {
      const currentChar = lines[lineIndex][columnIndex];
      if (currentChar === 'O' || currentChar === '#') {
        continue;
      }

      for (
        let nextLineIndex = lineIndex - 1;
        nextLineIndex >= 0;
        nextLineIndex--
      ) {
        const nextChar = lines[nextLineIndex][columnIndex];

        if (nextChar === '#') {
          lineIndex = nextLineIndex;
          break;
        } else if (nextChar === 'O') {
          lines[lineIndex][columnIndex] = 'O';
          lines[nextLineIndex][columnIndex] = '.';
          break;
        }
      }
    }
  }

  return lines;
}

function tiltWest(lines: string[][]): string[][] {
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    for (
      let columnIndex = 0;
      columnIndex < lines[lineIndex].length - 1;
      columnIndex++
    ) {
      const currentChar = lines[lineIndex][columnIndex];
      if (currentChar === 'O' || currentChar === '#') {
        continue;
      }

      for (
        let nextColumnIndex = columnIndex + 1;
        nextColumnIndex < lines[lineIndex].length;
        nextColumnIndex++
      ) {
        const nextChar = lines[lineIndex][nextColumnIndex];

        if (nextChar === '#') {
          columnIndex = nextColumnIndex;
          break;
        } else if (nextChar === 'O') {
          lines[lineIndex][columnIndex] = 'O';
          lines[lineIndex][nextColumnIndex] = '.';
          break;
        }
      }
    }
  }
  return lines;
}

function tiltEast(lines: string[][]): string[][] {
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    for (
      let columnIndex = lines[lineIndex].length - 1;
      columnIndex > 0;
      columnIndex--
    ) {
      const currentChar = lines[lineIndex][columnIndex];
      if (currentChar === 'O' || currentChar === '#') {
        continue;
      }

      for (
        let nextColumnIndex = columnIndex - 1;
        nextColumnIndex >= 0;
        nextColumnIndex--
      ) {
        const nextChar = lines[lineIndex][nextColumnIndex];

        if (nextChar === '#') {
          columnIndex = nextColumnIndex;
          break;
        } else if (nextChar === 'O') {
          lines[lineIndex][columnIndex] = 'O';
          lines[lineIndex][nextColumnIndex] = '.';
          break;
        }
      }
    }
  }

  return lines;
}
