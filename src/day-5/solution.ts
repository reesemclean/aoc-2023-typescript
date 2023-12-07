export const expectedPartOneSampleOutput = '35';

interface Mapping {
  name: string;
  maps: {
    sourceRange: ValueRange;
    destinationStart: number;
  }[];
}

interface ValueRange {
  start: number;
  length: number;
}

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  const seedsLine = lines.shift()!;
  const seeds = seedsLine
    .split(': ')[1]
    .split(' ')
    .map((n) => parseInt(n, 10));

  const mappings = parseMapping(lines);

  let currentValues = seeds.slice();

  for (const mapping of mappings) {
    currentValues = currentValues.map((value) =>
      mapSourceToDestination({ sourceValue: value, mapping }),
    );
  }

  return currentValues
    .reduce((low, curr) => Math.min(low, curr), Infinity)
    .toString();
}

function parseMapping(lines: string[]): Mapping[] {
  let currentMapping: Partial<Mapping> | undefined;
  const mappings: Mapping[] = [];

  for (const line of lines) {
    if (line.length === 0) {
      if (currentMapping) {
        mappings.push(currentMapping as Mapping);
      }
      currentMapping = {};
      continue;
    }

    if (line[0].match(/[a-z]/)) {
      currentMapping!.name = line.split(' ')[0];
      continue;
    }

    const [destinationStart, sourceStart, length] = line
      .split(' ')
      .map((n) => parseInt(n, 10));

    if (currentMapping!.maps === undefined) {
      currentMapping!.maps = [];
    }

    currentMapping!.maps.push({
      sourceRange: { start: sourceStart, length },
      destinationStart,
    });
  }

  if (currentMapping) {
    mappings.push(currentMapping as Mapping);
  }

  return mappings;
}

function mapSourceToDestination({
  sourceValue,
  mapping,
}: {
  sourceValue: number;
  mapping: Mapping;
}): number {
  let mapIndex = 0;

  while (mapIndex < mapping.maps.length) {
    const map = mapping.maps[mapIndex];

    if (isInRange(map.sourceRange.start, map.sourceRange.length, sourceValue)) {
      return map.destinationStart + (sourceValue - map.sourceRange.start);
    }

    mapIndex++;
  }

  return sourceValue;
}

function isInRange(start: number, length: number, sourceValue: number) {
  return sourceValue >= start && sourceValue < start + length;
}

export const expectedPartTwoSampleOutput = '46';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const seedsLine = lines.shift()!;
  const parsedSeedValues = seedsLine
    .split(': ')[1]
    .split(' ')
    .map((n) => parseInt(n, 10));

  const seedStarts = parsedSeedValues.filter((_, i) => i % 2 === 0);
  const seedRangeLengths = parsedSeedValues.filter((_, i) => i % 2 === 1);

  const seedRanges: ValueRange[] = seedStarts.map((start, i) => {
    return {
      start,
      length: seedRangeLengths[i],
    };
  });

  // const seeds = seedStarts.flatMap((start, i) => {
  //   const rangeLength = seedRangeLengths[i];

  //   return Array.from({ length: rangeLength }, (_, i) => start + i);
  // });

  const mappings = parseMapping(lines);

  let currentValues = seedRanges.slice();

  for (const mapping of mappings) {
    const nextValues: ValueRange[] = [];
    let unmappedRanges: ValueRange[] = currentValues.slice();

    for (const map of mapping.maps) {
      let stillUnmapped: ValueRange[] = [];
      for (const range of unmappedRanges) {
        const { overlappingRanges, nonOverlappingRanges } =
          splitRangeForMapping(range, map.sourceRange);
        stillUnmapped = stillUnmapped.concat(nonOverlappingRanges);
        nextValues.push(...overlappingRanges);
      }
      unmappedRanges = stillUnmapped;
    }

    // while (unmappedRanges.length > 0 && mapIndex < mapping.maps.length) {
    //   const map = mapping.maps[mapIndex];
    //   const range = unmappedRanges.shift()!;
    //   const { overlappingRanges, nonOverlappingRanges } = splitRangeForMapping(
    //     range,
    //     map.sourceRange,
    //   );
    //   unmappedRanges = unmappedRanges.concat(nonOverlappingRanges);
    //   nextValues.push(...overlappingRanges);

    //   mapIndex++;
    // }

    nextValues.push(...unmappedRanges);

    const mappedRanges = nextValues.slice();

    const transformedRanges: ValueRange[] = mappedRanges.map((range) => {
      const mapToUse = mapping.maps.find((map) => {
        return rangesIntersect(range, map.sourceRange);
      });

      if (!mapToUse) {
        return range;
      }

      const diff = mapToUse!.destinationStart - mapToUse!.sourceRange.start;
      return {
        start: range.start + diff,
        length: range.length,
      };
    });

    currentValues = transformedRanges;
  }

  const min = currentValues.reduce((prev, curr) => {
    return Math.min(prev, curr.start);
  }, Infinity);

  return min.toString();
}

function splitRangeForMapping(
  range: ValueRange,
  sourceRange: ValueRange,
): { overlappingRanges: ValueRange[]; nonOverlappingRanges: ValueRange[] } {
  // Find the intersection of the two ranges
  // For all the non-intersection parts of range, return them as a range

  if (!rangesIntersect(range, sourceRange)) {
    return {
      overlappingRanges: [],
      nonOverlappingRanges: [range],
    };
  }

  const intersectionStart = Math.max(range.start, sourceRange.start);
  const intersectionEnd = Math.min(
    range.start + range.length,
    sourceRange.start + sourceRange.length,
  );

  const overlappingRanges: ValueRange[] = [];
  const nonOverlappingRanges: ValueRange[] = [];

  if (intersectionStart !== range.start) {
    nonOverlappingRanges.push({
      start: range.start,
      length: intersectionStart - range.start,
    });
  }

  overlappingRanges.push({
    start: intersectionStart,
    length: intersectionEnd - intersectionStart,
  });

  if (intersectionEnd < range.start + range.length) {
    nonOverlappingRanges.push({
      start: intersectionEnd,
      length: range.start + range.length - intersectionEnd,
    });
  }

  return { overlappingRanges, nonOverlappingRanges };
}

// const testRange = { start: 10, length: 10 }; // 10 - 19
// const testRange = { start: 55, length: 13 };
// const testSourceRange = { start: 50, length: 48 };

// const { overlappingRanges, nonOverlappingRanges } = splitRangeForMapping(
//   testRange,
//   testSourceRange,
// );
// console.log({ overlappingRanges, nonOverlappingRanges });

// const testSourceRangeOne = { start: 15, length: 2 }; // 15 - 16
// const testSourceRangeTwo = { start: 5, length: 10 }; // 5 - 14
// const testSourceRangeThree = { start: 15, length: 10 }; // 15 - 24
// const testSourceRangeFour = { start: 5, length: 20 }; // 5 - 24
// const testSourceRangeFive = { start: 5, length: 5 }; // 5 - 9
// const testSourceRangeSix = { start: 20, length: 5 }; // 20 - 24

// const testOneActual = splitRangeForMapping(testRange, testSourceRangeOne);
// const testOneExpected = [
//   { start: 10, length: 5 },
//   { start: 15, length: 2 },
//   { start: 17, length: 3 },
// ];
// assert.deepStrictEqual(testOneActual, testOneExpected);

// const testTwoActual = splitRangeForMapping(testRange, testSourceRangeTwo);
// const testTwoExpected = [
//   { start: 10, length: 5 },
//   { start: 15, length: 5 },
// ];
// assert.deepStrictEqual(testTwoActual, testTwoExpected);

// const testThreeActual = splitRangeForMapping(testRange, testSourceRangeThree);
// const testThreeExpected = [
//   { start: 10, length: 5 },
//   { start: 15, length: 5 },
// ];
// assert.deepStrictEqual(testThreeActual, testThreeExpected);

// const testFourActual = splitRangeForMapping(testRange, testSourceRangeFour);
// const testFourExpected = [{ start: 10, length: 10 }];
// assert.deepStrictEqual(testFourActual, testFourExpected);

// const testFiveActual = splitRangeForMapping(testRange, testSourceRangeFive);
// const testFiveExpected = [{ start: 10, length: 10 }];
// assert.deepStrictEqual(testFiveActual, testFiveExpected);

// const testSixActual = splitRangeForMapping(testRange, testSourceRangeSix);
// const testSixExpected = [{ start: 10, length: 10 }];
// assert.deepStrictEqual(testSixActual, testSixExpected);

function rangesIntersect(a: ValueRange, b: ValueRange): boolean {
  return a.start + a.length > b.start && b.start + b.length > a.start;
}
