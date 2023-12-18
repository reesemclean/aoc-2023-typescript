type Point = { columnGap: number; rowGap: number };

type Item = 'J' | 'L' | 'S' | '7' | 'F' | '.' | '|' | '-' | 'I' | 'O';

export function solveDay10Part2(
  lines: Item[][],
  loopPositions: { x: number; y: number }[],
) {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[0].length; j++) {
      const value = lines[i][j];
      if (
        value === 'J' ||
        value === 'L' ||
        value === '7' ||
        value === 'F' ||
        value === '-' ||
        value === '|'
      ) {
        if (
          loopPositions.some((position) => position.x === j && position.y === i)
        ) {
          continue;
        } else {
          lines[i][j] = '.';
        }
      }
    }
  }

  for (
    let columnGapIndex = 1;
    columnGapIndex < lines[0].length;
    columnGapIndex++
  ) {
    for (let rowGap = 1; rowGap < lines.length; rowGap++) {
      floodFill({ columnGap: columnGapIndex, rowGap }, lines);
    }
  }

  console.log(lines.map((row) => row.join('')).join('\n'));

  let count = 0;

  for (const line of lines) {
    for (const item of line) {
      if (item === 'I') {
        count++;
      }
    }
  }

  return count.toString();
}

function positionEquals(a: Point, b: Point) {
  return a.columnGap === b.columnGap && a.rowGap === b.rowGap;
}

function adjacentItemsForPoint(
  lines: Item[][],
  { columnGap, rowGap }: Point,
): {
  topLeft: Item;
  topRight: Item;
  bottomLeft: Item;
  bottomRight: Item;
} | null {
  if (
    columnGap === 0 ||
    rowGap === 0 ||
    columnGap === lines[0].length ||
    rowGap === lines.length
  ) {
    return null;
  }

  const topLeft = lines[rowGap - 1][columnGap - 1];
  const topRight = lines[rowGap - 1][columnGap];
  const bottomLeft = lines[rowGap][columnGap - 1];
  const bottomRight = lines[rowGap][columnGap];
  return { topLeft, topRight, bottomLeft, bottomRight };
}

function floodFill(point: Point, lines: Item[][]) {
  const positionsToCheck: Point[] = [point];
  const checkedPositions: Point[] = [];

  let filled = true;

  const adjacentPositions = adjacentItemsForPoint(lines, point);
  if (
    adjacentPositions?.bottomLeft !== '.' &&
    adjacentPositions?.bottomRight !== '.' &&
    adjacentPositions?.topLeft !== '.' &&
    adjacentPositions?.topRight !== '.'
  ) {
    return;
  }

  while (positionsToCheck.length > 0) {
    const position = positionsToCheck.pop();

    if (!position) {
      throw new Error('This should never happen');
    }

    if (checkedPositions.some((test) => positionEquals(test, position))) {
      continue;
    }

    checkedPositions.push(position);

    const adjacentPositions = adjacentItemsForPoint(lines, position);

    if (!adjacentPositions) {
      filled = false;
      break;
    }

    const { topLeft, topRight, bottomLeft, bottomRight } = adjacentPositions;

    if (
      topLeft === 'O' ||
      topRight === 'O' ||
      bottomLeft === 'O' ||
      bottomRight === 'O'
    ) {
      filled = false;
      break;
    }

    // TODO: Which positions should we check next?
    if (shouldCheckAbovePosition(topLeft, topRight)) {
      if (
        checkedPositions.every(
          (test) =>
            !positionEquals(test, {
              columnGap: position.columnGap,
              rowGap: position.rowGap - 1,
            }),
        )
      ) {
        positionsToCheck.push({
          columnGap: position.columnGap,
          rowGap: position.rowGap - 1,
        });
      }
    }

    if (shouldCheckBelowPosition(bottomLeft, bottomRight)) {
      if (
        checkedPositions.every(
          (test) =>
            !positionEquals(test, {
              columnGap: position.columnGap,
              rowGap: position.rowGap + 1,
            }),
        )
      ) {
        positionsToCheck.push({
          columnGap: position.columnGap,
          rowGap: position.rowGap + 1,
        });
      }
    }

    if (shouldCheckLeftPosition(topLeft, bottomLeft)) {
      if (
        checkedPositions.every(
          (test) =>
            !positionEquals(test, {
              columnGap: position.columnGap - 1,
              rowGap: position.rowGap,
            }),
        )
      ) {
        positionsToCheck.push({
          columnGap: position.columnGap - 1,
          rowGap: position.rowGap,
        });
      }
    }

    if (shouldCheckRightPosition(topRight, bottomRight)) {
      if (
        checkedPositions.every(
          (test) =>
            !positionEquals(test, {
              columnGap: position.columnGap + 1,
              rowGap: position.rowGap,
            }),
        )
      ) {
        positionsToCheck.push({
          columnGap: position.columnGap + 1,
          rowGap: position.rowGap,
        });
      }
    }
  }

  const valueToFillWith = filled ? 'I' : 'O';

  for (const position of checkedPositions) {
    if (
      position.rowGap < lines.length - 1 &&
      lines[position.rowGap][position.columnGap] === '.'
    ) {
      lines[position.rowGap][position.columnGap] = valueToFillWith;
    }
    if (
      position.rowGap < lines.length - 1 &&
      position.columnGap > 0 &&
      lines[position.rowGap][position.columnGap - 1] === '.'
    ) {
      lines[position.rowGap][position.columnGap - 1] = valueToFillWith;
    }
    if (
      position.rowGap > 0 &&
      lines[position.rowGap - 1][position.columnGap] === '.'
    ) {
      lines[position.rowGap - 1][position.columnGap] = valueToFillWith;
    }
    if (
      position.rowGap > 0 &&
      position.columnGap &&
      lines[position.rowGap - 1][position.columnGap - 1] === '.'
    ) {
      lines[position.rowGap - 1][position.columnGap - 1] = valueToFillWith;
    }
  }
}

function shouldCheckAbovePosition(
  topLeft: Omit<Item, 'O'>,
  topRight: Omit<Item, 'O'>,
): boolean {
  const topLeftIsClosed = topLeft === 'F' || topLeft === '-' || topLeft === 'L';
  const topRightIsClosed =
    topRight === '7' || topRight === '-' || topRight === 'J';

  if (topLeftIsClosed && topRightIsClosed) {
    return false;
  }

  return true;
}

function shouldCheckBelowPosition(
  bottomLeft: Item,
  bottomRight: Item,
): boolean {
  const bottomLeftIsClosed =
    bottomLeft === 'F' || bottomLeft === '-' || bottomLeft === 'L';
  const bottomRightIsClosed =
    bottomRight === '7' || bottomRight === '-' || bottomRight === 'J';

  if (bottomLeftIsClosed && bottomRightIsClosed) {
    return false;
  }
  return true;
}

function shouldCheckLeftPosition(topLeft: Item, bottomLeft: Item): boolean {
  const topLeftIsClosed = topLeft === 'F' || topLeft === '|' || topLeft === '7';
  const bottomLeftIsClosed =
    bottomLeft === 'L' || bottomLeft === '|' || bottomLeft === 'J';
  if (topLeftIsClosed && bottomLeftIsClosed) {
    return false;
  }
  return true;
}

function shouldCheckRightPosition(topRight: Item, bottomRight: Item): boolean {
  const topRightIsClosed =
    topRight === 'F' || topRight === '|' || topRight === '7';
  const bottomRightIsClosed =
    bottomRight === 'L' || bottomRight === '|' || bottomRight === 'J';
  if (topRightIsClosed && bottomRightIsClosed) {
    return false;
  }
  return true;
}

function shouldContinue(items: {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}) {}
