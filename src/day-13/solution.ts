export const expectedPartOneSampleOutput = '405';

type Row = string[];

type Pattern = Row[];

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  let sum = 0;

  const patterns: Pattern[] = [];
  let currentPattern: Pattern = [];

  for (const line of lines) {
    const characters = line.split('');
    if (characters.length === 0) {
      patterns.push(currentPattern);
      currentPattern = [];
    } else {
      currentPattern.push(characters);
    }
  }

  patterns.push(currentPattern);

  for (const pattern of patterns) {
    const rowOne = pattern[0];

    let verticalReflectionIndex: null | number = null;
    let horizontalReflectionIndex: null | number = null;

    vertical_gap_loop: for (
      let gapIndex = 1;
      gapIndex < rowOne.length;
      gapIndex++
    ) {
      for (const row of pattern) {
        for (
          let offset = 0;
          offset < Math.min(gapIndex, row.length - gapIndex);
          offset++
        ) {
          const left = row[gapIndex - offset - 1];
          const right = row[gapIndex + offset];

          if (left === right) {
            continue;
          }

          continue vertical_gap_loop;
        }
      }

      verticalReflectionIndex = gapIndex;
    }

    if (verticalReflectionIndex != null) {
      sum += verticalReflectionIndex;

      continue;
    }

    horizontal_gap_loop: for (
      let gapIndex = 1;
      gapIndex < pattern.length;
      gapIndex++
    ) {
      for (
        let offset = 0;
        offset < Math.min(gapIndex, pattern.length - gapIndex);
        offset++
      ) {
        const top = pattern[gapIndex - offset - 1];
        const bottom = pattern[gapIndex + offset];

        for (let index = 0; index < top.length; index++) {
          const topCharacter = top[index];
          const bottomCharacter = bottom[index];

          if (topCharacter === bottomCharacter) {
            continue;
          }

          continue horizontal_gap_loop;
        }
      }

      horizontalReflectionIndex = gapIndex;
    }

    if (horizontalReflectionIndex == null) {
      console.log('No reflection found for pattern: ');
      pattern.forEach((row) => console.log(row.join('')));
      throw new Error('No reflection found');
    }

    sum += horizontalReflectionIndex * 100;
  }

  return sum.toString();
}

export const expectedPartTwoSampleOutput = '400';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  let sum = 0;

  const patterns: Pattern[] = [];
  let currentPattern: Pattern = [];

  for (const line of lines) {
    const characters = line.split('');
    if (characters.length === 0) {
      patterns.push(currentPattern);
      currentPattern = [];
    } else {
      currentPattern.push(characters);
    }
  }

  patterns.push(currentPattern);

  for (const pattern of patterns) {
    const rowOne = pattern[0];

    let verticalReflectionIndex: null | number = null;
    let horizontalReflectionIndex: null | number = null;
    let errors = 0;

    vertical_gap_loop: for (
      let gapIndex = 1;
      gapIndex < rowOne.length;
      gapIndex++
    ) {
      errors = 0;
      for (const row of pattern) {
        for (
          let offset = 0;
          offset < Math.min(gapIndex, row.length - gapIndex);
          offset++
        ) {
          const left = row[gapIndex - offset - 1];
          const right = row[gapIndex + offset];

          if (left === right) {
            continue;
          }

          errors++;
          if (errors > 1) {
            continue vertical_gap_loop;
          }
        }
      }

      if (errors === 1) {
        verticalReflectionIndex = gapIndex;
        break;
      }
    }

    if (verticalReflectionIndex != null) {
      sum += verticalReflectionIndex;
      continue;
    }

    horizontal_gap_loop: for (
      let gapIndex = 1;
      gapIndex < pattern.length;
      gapIndex++
    ) {
      errors = 0;
      for (
        let offset = 0;
        offset < Math.min(gapIndex, pattern.length - gapIndex);
        offset++
      ) {
        const top = pattern[gapIndex - offset - 1];
        const bottom = pattern[gapIndex + offset];

        for (let index = 0; index < top.length; index++) {
          const topCharacter = top[index];
          const bottomCharacter = bottom[index];

          if (topCharacter === bottomCharacter) {
            continue;
          }

          errors++;
          if (errors > 1) {
            continue horizontal_gap_loop;
          }
        }
      }

      if (errors === 1) {
        horizontalReflectionIndex = gapIndex;
        break;
      }
    }

    if (horizontalReflectionIndex == null) {
      console.log('No reflection found for pattern: ');
      pattern.forEach((row) => console.log(row.join('')));
      throw new Error('No reflection found');
    }

    sum += horizontalReflectionIndex * 100;
  }

  return sum.toString();
}
