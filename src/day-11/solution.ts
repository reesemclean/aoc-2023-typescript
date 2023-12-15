export const expectedPartOneSampleOutput = '374';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');
  const original = lines.map((line) => line.split(''));

  const expanded = expandUniverse(original.slice());

  const galaxyPositions: { columnIndex: number; rowIndex: number }[] = [];

  for (const [lineIndex, line] of expanded.entries()) {
    for (const [charIndex, char] of line.entries()) {
      if (char === '#') {
        galaxyPositions.push({ columnIndex: charIndex, rowIndex: lineIndex });
      }
    }
  }

  let sum = 0;

  for (let i = 0; i < galaxyPositions.length - 1; i++) {
    for (let j = i + 1; j < galaxyPositions.length; j++) {
      const galaxyA = galaxyPositions[i];
      const galaxyB = galaxyPositions[j];

      const deltaX = galaxyB.columnIndex - galaxyA.columnIndex;
      const deltaY = galaxyB.rowIndex - galaxyA.rowIndex;
      sum += Math.abs(deltaX) + Math.abs(deltaY);
    }
  }

  return sum.toString();
}

function expandUniverse(lines: string[][]): string[][] {
  const columnIndexesWithNoGalaxies: number[] = [];
  const rowIndexesWithNoGalaxies: number[] = [];

  for (let column = 0; column < lines[0].length; column++) {
    let columnHasGalaxy = false;
    for (let row = 0; row < lines.length; row++) {
      if (lines[row][column] === '#') {
        columnHasGalaxy = true;
        break;
      }
    }
    if (!columnHasGalaxy) {
      columnIndexesWithNoGalaxies.push(column);
    }
  }

  for (let row = 0; row < lines.length; row++) {
    let rowHasGalaxy = false;
    for (let column = 0; column < lines[0].length; column++) {
      if (lines[row][column] === '#') {
        rowHasGalaxy = true;
        break;
      }
    }
    if (!rowHasGalaxy) {
      rowIndexesWithNoGalaxies.push(row);
    }
  }

  const emptyRow = Array(lines[0].length).fill('M');
  for (const rowIndex of rowIndexesWithNoGalaxies.reverse()) {
    lines.splice(rowIndex, 0, emptyRow.slice());
  }

  for (const columnIndex of columnIndexesWithNoGalaxies.reverse()) {
    for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
      lines[rowIndex].splice(columnIndex, 0, 'M');
    }
  }

  return lines;
}

export const expectedPartTwoSampleOutput = '1030';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');
  const original = lines.map((line) => line.split(''));

  const expanded = expandUniverse(original.slice());

  const galaxyPositions: { columnIndex: number; rowIndex: number }[] = [];

  for (const [lineIndex, line] of expanded.entries()) {
    for (const [charIndex, char] of line.entries()) {
      if (char === '#') {
        galaxyPositions.push({ columnIndex: charIndex, rowIndex: lineIndex });
      }
    }
  }

  let sum = 0;

  let numberOfConnections = 0;

  for (let i = 0; i < galaxyPositions.length - 1; i++) {
    for (let j = i + 1; j < galaxyPositions.length; j++) {
      numberOfConnections++;
      const galaxyA = galaxyPositions[i];
      const galaxyB = galaxyPositions[j];

      let deltaX = 0;

      const greaterX = Math.max(galaxyA.columnIndex, galaxyB.columnIndex);
      const lesserX = Math.min(galaxyA.columnIndex, galaxyB.columnIndex);

      for (let x = greaterX; x > lesserX; x--) {
        if (expanded[galaxyA.rowIndex][x] === 'M') {
          deltaX = deltaX + 1_000_000 - 1;
        } else {
          deltaX++;
        }
      }

      const greaterY = Math.max(galaxyA.rowIndex, galaxyB.rowIndex);
      const lesserY = Math.min(galaxyA.rowIndex, galaxyB.rowIndex);

      let deltaY = 0;

      for (let y = greaterY; y > lesserY; y--) {
        if (expanded[y][galaxyA.columnIndex] === 'M') {
          deltaY = deltaY + 1_000_000 - 1;
        } else {
          deltaY++;
        }
      }

      sum += Math.abs(deltaX) + Math.abs(deltaY);
    }
  }

  return sum.toString();
}
