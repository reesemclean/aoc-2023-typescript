export const expectedPartOneSampleOutput = '4361';

const symbolRegex = /[^a-zA-Z0-9.]/; // Not including .

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  const matchedPartNumbers: string[] = [];

  for (const [rowIndex, line] of lines.entries()) {
    const numberMatches = line.matchAll(/\d+/g);

    for (const match of numberMatches) {
      const minColumn = Math.max(match.index! - 1, 0);
      const maxColumn = Math.min(
        match.index! + match[0].length + 1,
        line.length - 1,
      );

      if (rowIndex > 0) {
        const substring = lines[rowIndex - 1].substring(minColumn, maxColumn);
        if (symbolRegex.test(substring)) {
          matchedPartNumbers.push(match[0]);
          continue;
        }

        if (rowIndex > 0) {
          const previousCharacter = line.substring(
            match.index! - 1,
            match.index!,
          );
          if (symbolRegex.test(previousCharacter)) {
            matchedPartNumbers.push(match[0]);
            continue;
          }
        }
      }

      if (rowIndex < lines.length - 1) {
        const substring = lines[rowIndex + 1].substring(minColumn, maxColumn);
        if (symbolRegex.test(substring)) {
          matchedPartNumbers.push(match[0]);
          continue;
        }

        if (rowIndex < lines.length - 1) {
          const nextCharacter = line.substring(
            match.index! + match[0].length,
            match.index! + match[0].length + 1,
          );
          if (symbolRegex.test(nextCharacter)) {
            matchedPartNumbers.push(match[0]);
            continue;
          }
        }
      }
    }
  }

  return matchedPartNumbers
    .map((number) => parseInt(number, 10))
    .reduce((acc, curr) => acc + curr, 0)
    .toString();
}

export const expectedPartTwoSampleOutput = '467835';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const lineLength = lines[0].length;

  const potentialGearIndexes: number[] = [];
  const foundGearRatios: number[] = [];

  for (const match of input.replaceAll('\n', '').matchAll(/\*/g)) {
    potentialGearIndexes.push(match.index!);
  }

  potentialGearLoop: for (const potentialGearIndex of potentialGearIndexes) {
    const row = Math.floor(potentialGearIndex / lineLength);
    const column = potentialGearIndex % lineLength;
    const foundDistinctAdjacentNumbers: number[] = [];

    if (row > 0) {
      const numberMatches = lines[row - 1].matchAll(/\d+/g);

      for (const match of numberMatches) {
        const matchColumnStart = match.index! % lineLength;
        const matchColumnEnd = matchColumnStart + match[0].length - 1;
        if (
          isStrideAdjacentToIndex(
            { min: matchColumnStart, max: matchColumnEnd },
            column,
          )
        ) {
          foundDistinctAdjacentNumbers.push(parseInt(match[0], 10));

          if (foundDistinctAdjacentNumbers.length === 2) {
            foundGearRatios.push(
              foundDistinctAdjacentNumbers[1]! *
                foundDistinctAdjacentNumbers[0]!,
            );
            continue potentialGearLoop;
          }
        }
      }
    }

    if (row < lines.length - 1) {
      const numberMatches = lines[row + 1].matchAll(/\d+/g);

      for (const match of numberMatches) {
        const matchColumnStart = match.index! % lineLength;
        const matchColumnEnd = matchColumnStart + match[0].length - 1;
        if (
          isStrideAdjacentToIndex(
            { min: matchColumnStart, max: matchColumnEnd },
            column,
          )
        ) {
          foundDistinctAdjacentNumbers.push(parseInt(match[0], 10));

          if (foundDistinctAdjacentNumbers.length === 2) {
            foundGearRatios.push(
              foundDistinctAdjacentNumbers[1]! *
                foundDistinctAdjacentNumbers[0]!,
            );
            continue potentialGearLoop;
          }
        }
      }
    }

    const numberMatchesOnOwnRow = lines[row].matchAll(/\d+/g);

    for (const match of numberMatchesOnOwnRow) {
      const matchColumnStart = match.index! % lineLength;
      const matchColumnEnd = matchColumnStart + match[0].length - 1;
      if (matchColumnStart === column + 1 || matchColumnEnd === column - 1) {
        foundDistinctAdjacentNumbers.push(parseInt(match[0], 10));

        if (foundDistinctAdjacentNumbers.length === 2) {
          foundGearRatios.push(
            foundDistinctAdjacentNumbers[1]! * foundDistinctAdjacentNumbers[0]!,
          );
          continue potentialGearLoop;
        }
      }
    }
  }

  return foundGearRatios.reduce((acc, curr) => acc + curr, 0).toString();
}

function isStrideAdjacentToIndex(
  stride: { min: number; max: number },
  index: number,
): boolean {
  return (
    (stride.min >= index - 1 || stride.max >= index - 1) &&
    (stride.min <= index + 1 || stride.max <= index + 1)
  );
}
