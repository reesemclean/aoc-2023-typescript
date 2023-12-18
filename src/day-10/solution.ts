import { solveDay10Part2 } from './solution-part-2';

export const expectedPartOneSampleOutput = '4';

type TileType =
  | 'ground'
  | 'horizontal'
  | 'n-e'
  | 'n-w'
  | 's-e'
  | 's-w'
  | 'vertical'
  | 'start';

type Grid = TileType[][];

type Position = { x: number; y: number };

function parseGrid(input: string): Grid {
  return input.split('\n').map((line, columnIndex) => {
    return line.split('').map((value, rowIndex) => {
      switch (value) {
        case '.':
          return 'ground';
        case 'F':
          return 's-e';
        case '-':
          return 'horizontal';
        case '7':
          return 's-w';
        case '|':
          return 'vertical';
        case 'J':
          return 'n-w';
        case 'L':
          return 'n-e';
        case 'S':
          return 'start';
        default:
          throw new Error(
            `Unknown tile type ${value} at column ${columnIndex}, row ${rowIndex}`,
          );
      }
    });
  });
}

function tileTypeAt(grid: Grid, position: Position): TileType | undefined {
  if (
    position.x < 0 ||
    position.y < 0 ||
    position.y >= grid.length ||
    position.x >= grid[position.y].length
  ) {
    return undefined;
  }

  return grid[position.y][position.x];
}

function nextPosition(
  grid: Grid,
  position: Position,
  previousPosition: Position,
): Position {
  const tileType = tileTypeAt(grid, position);

  if (!tileType) {
    throw new Error(
      `No tile type found at position ${position.x}, ${position.y}`,
    );
  }

  switch (tileType) {
    case 'ground':
      throw new Error('Cannot move to ground tile');
    case 'horizontal': {
      const nextX =
        previousPosition.x < position.x ? position.x + 1 : position.x - 1;
      return { x: nextX, y: position.y };
    }
    case 'n-e': {
      const nextY =
        previousPosition.y < position.y ? position.y : position.y - 1;
      const nextX =
        previousPosition.x > position.x ? position.x : position.x + 1;
      return { x: nextX, y: nextY };
    }
    case 'n-w': {
      const nextY =
        previousPosition.y < position.y ? position.y : position.y - 1;
      const nextX =
        previousPosition.x < position.x ? position.x : position.x - 1;
      return { x: nextX, y: nextY };
    }
    case 's-e': {
      const nextY =
        previousPosition.y > position.y ? position.y : position.y + 1;
      const nextX =
        previousPosition.x > position.x ? position.x : position.x + 1;
      return { x: nextX, y: nextY };
    }
    case 's-w': {
      const nextY =
        previousPosition.y > position.y ? position.y : position.y + 1;
      const nextX =
        previousPosition.x < position.x ? position.x : position.x - 1;
      return { x: nextX, y: nextY };
    }
    case 'vertical': {
      const nextY =
        previousPosition.y < position.y ? position.y + 1 : position.y - 1;
      return { x: position.x, y: nextY };
    }
    case 'start':
      throw new Error('Use nextPositionFromStart to move from start tile');
  }
}

function startingTileType(
  grid: Grid,
): 'n-e' | 'n-w' | 's-e' | 's-w' | 'vertical' | 'horizontal' {
  const [first, second] = nextPositionsFromStart(grid);

  if (first.x === second.x) {
    return 'vertical';
  }

  if (first.y === second.y) {
    return 'horizontal';
  }

  if (first.x > second.x) {
    if (first.y > second.y) {
      return 's-w';
    } else {
      return 'n-w';
    }
  } else {
    if (first.y > second.y) {
      return 's-e';
    } else {
      return 'n-e';
    }
  }
}

function nextPositionsFromStart(grid: Grid): [Position, Position] {
  const start = startingTilePosition(grid);

  const positions: Position[] = [];

  const above = { x: start.x, y: start.y - 1 };
  const below = { x: start.x, y: start.y + 1 };
  const left = { x: start.x - 1, y: start.y };
  const right = { x: start.x + 1, y: start.y };

  const aboveTileType = tileTypeAt(grid, above);

  if (aboveTileType === 'vertical' || aboveTileType?.includes('s-')) {
    positions.push(above);
  }

  const belowTileType = tileTypeAt(grid, below);

  if (belowTileType === 'vertical' || belowTileType?.includes('n-')) {
    positions.push(below);
  }

  const leftTileType = tileTypeAt(grid, left);

  if (leftTileType === 'horizontal' || leftTileType?.includes('-e')) {
    positions.push(left);
  }

  const rightTileType = tileTypeAt(grid, right);

  if (rightTileType === 'horizontal' || rightTileType?.includes('-w')) {
    positions.push(right);
  }

  if (positions.length !== 2) {
    throw new Error(
      `Expected 2 positions from start, got ${positions.length}: ${positions}`,
    );
  }

  return positions as [Position, Position];
}

function startingTilePosition(grid: Grid): Position {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const tile = row[x];
      if (tile === 'start') {
        return { x, y };
      }
    }
  }

  throw new Error('No starting tile found');
}

export function solvePartOne(input: string): string {
  const grid = parseGrid(input);

  const [first, second] = nextPositionsFromStart(grid);
  let position: Position | null = second;
  let previous = startingTilePosition(grid);

  let steps = 1;
  while (position) {
    const next = nextPosition(grid, position, previous);

    if (tileTypeAt(grid, next) === 'start') {
      position = null;
      break;
    }

    previous = position;
    position = next;
    steps++;
  }

  steps++;

  return (steps / 2).toString();
}

export const expectedPartTwoSampleOutput = '4';

type GroundAreaType =
  | 'inside'
  | 'outside'
  | 'unknown'
  | 'part-of-loop-v-h'
  | 'part-of-loop-v'
  | 'part-of-loop-h'
  | 'not-part-of-loop';

function convertBackToOriginal(
  tile: TileType,
): 'J' | 'L' | '7' | 'F' | '.' | '|' | '-' {
  switch (tile) {
    case 'ground':
      return '.';
    case 'horizontal':
      return '-';
    case 'n-e':
      return 'L';
    case 'n-w':
      return 'J';
    case 's-e':
      return 'F';
    case 's-w':
      return '7';
    case 'vertical':
      return '|';
    default:
      throw new Error(`Unknown tile type ${tile}`);
  }
}

export function solvePartTwo(input: string): string {
  const grid = parseGrid(input);

  const [first, second] = nextPositionsFromStart(grid);
  let position: Position | null = second;
  let previous = startingTilePosition(grid);

  const positionsPartOfLoop: Position[] = [previous, first, second];

  while (position) {
    positionsPartOfLoop.push(position);
    const next = nextPosition(grid, position, previous);

    if (tileTypeAt(grid, next) === 'start') {
      position = null;
      break;
    }

    previous = position;
    position = next;
  }

  const startTileType = startingTileType(grid);

  const convertedGrid = grid.map((row) =>
    row.map((tile) => {
      switch (tile) {
        case 'start':
          return convertBackToOriginal(startTileType);
        default:
          return convertBackToOriginal(tile);
      }
    }),
  );

  return solveDay10Part2(convertedGrid, positionsPartOfLoop);

  let count = 0;
  // const startTileType = startingTileType(grid);

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const tile = row[x];
      if (tile !== 'ground') {
        continue;
      }

      let loopPartsAbove = 0;

      for (let rowIndex = y - 1; rowIndex >= 0; rowIndex--) {
        const aboveTile =
          grid[rowIndex][x] === 'start' ? startTileType : grid[rowIndex][x];
        if (aboveTile === 'horizontal' || aboveTile.includes('s-')) {
          loopPartsAbove++;
        }
      }

      let loopPartsBelow = 0;

      for (let rowIndex = y + 1; rowIndex < grid.length; rowIndex++) {
        const belowTile =
          grid[rowIndex][x] === 'start' ? startTileType : grid[rowIndex][x];
        if (belowTile === 'horizontal' || belowTile.includes('n-')) {
          loopPartsBelow++;
        }
      }

      let loopPartsLeft = 0;
      for (let columnIndex = x - 1; columnIndex >= 0; columnIndex--) {
        const leftTile =
          grid[y][columnIndex] === 'start'
            ? startTileType
            : grid[y][columnIndex];
        if (leftTile === 'vertical' || leftTile.includes('-e')) {
          loopPartsLeft++;
        }
      }

      let loopPartsRight = 0;
      for (
        let columnIndex = x + 1;
        columnIndex < grid[y].length;
        columnIndex++
      ) {
        const rightTile =
          grid[y][columnIndex] === 'start'
            ? startTileType
            : grid[y][columnIndex];
        if (rightTile === 'vertical' || rightTile.includes('-w')) {
          loopPartsRight++;
        }
      }

      if (
        loopPartsAbove > 0 &&
        loopPartsBelow > 0 &&
        loopPartsLeft > 0 &&
        loopPartsRight > 0 &&
        loopPartsAbove % 2 === loopPartsBelow % 2 &&
        loopPartsLeft % 2 === loopPartsRight % 2
      ) {
        count++;
      }
    }
  }

  // const areaTypes: GroundAreaType[][] = grid.map((column, columnIndex) => {
  //   return column.map((row, rowIndex) => {
  //     const isPartOfLoop = positionsPartOfLoop.some(
  //       (test) => test.x === rowIndex && test.y === columnIndex,
  //     );
  //     if (isPartOfLoop) {
  //       const tileType = tileTypeAt(grid, { x: rowIndex, y: columnIndex });
  //       const isVertical =
  //         tileType === 'vertical' ||
  //         tileType?.includes('n-') ||
  //         tileType?.includes('s-');
  //       const isHorizontal =
  //         tileType === 'horizontal' ||
  //         tileType?.includes('-e') ||
  //         tileType?.includes('-w');

  //       if (isVertical && isHorizontal) {
  //         return 'part-of-loop-v-h';
  //       } else if (isVertical) {
  //         return 'part-of-loop-v';
  //       } else if (isHorizontal) {
  //         return 'part-of-loop-h';
  //       }
  //     }

  //     const tileType = tileTypeAt(grid, { x: rowIndex, y: columnIndex });
  //     if (tileType === 'ground') {
  //       return 'unknown';
  //     } else {
  //       return 'not-part-of-loop';
  //     }
  //   });
  // });

  // // floodFill(areaTypes, { x: 3, y: 3 });
  // floodFill(areaTypes, { x: 2, y: 6 });

  // // for (let y = 0; y < areaTypes.length; y++) {
  // //   for (let x = 0; x < areaTypes[y].length; x++) {
  // //     floodFill(areaTypes, { x, y });
  // //   }
  // // }

  // let count = 0;

  // for (let y = 0; y < areaTypes.length; y++) {
  //   for (let x = 0; x < areaTypes[y].length; x++) {
  //     if (areaTypes[y][x] === 'inside') {
  //       count++;
  //     }
  //   }
  // }

  // for (let y = 0; y < areaTypes.length; y++) {
  //   const test = areaTypes[y].map((type) => {
  //     switch (type) {
  //       case 'inside':
  //         return 'I';
  //       case 'outside':
  //         return 'O';
  //       case 'unknown':
  //         return 'U';
  //       case 'part-of-loop-v-h':
  //         return 'P';
  //       case 'part-of-loop-v':
  //         return 'P';
  //       case 'part-of-loop-h':
  //         return 'P';
  //       case 'not-part-of-loop':
  //         return 'N';
  //     }
  //   });

  //   console.log(test.join(''));
  // }

  console.log({ count });

  return count.toString();
}

function floodFill(areaTypes: GroundAreaType[][], startingPoint: Position) {
  const positionsToCheck: Position[] = [startingPoint];
  const checkedPositions: Position[] = [];
  const potentialInsidePositions: Position[] = [];
  let filled = true;

  while_loop: while (positionsToCheck.length > 0) {
    const position = positionsToCheck.pop();
    if (!position) {
      throw new Error('No position found');
    }

    if (
      checkedPositions.some(
        (test) => test.x === position.x && test.y === position.y,
      )
    ) {
      continue;
    }

    checkedPositions.push(position);
    console.log('Checking Position: ', position);

    if (
      position.x < 0 ||
      position.y < 0 ||
      position.y >= areaTypes.length ||
      position.x >= areaTypes[position.y].length
    ) {
      filled = false;
      break while_loop;
    }

    const type = areaTypes[position.y][position.x];

    if (type === 'unknown') {
      const isAlreadyPotential = potentialInsidePositions.some(
        (test) => test.x === position.x && test.y === position.y,
      );
      if (!isAlreadyPotential) {
        potentialInsidePositions.push(position);
      }
    }

    const left = { x: position.x - 1, y: position.y };
    const right = { x: position.x + 1, y: position.y };
    const above = { x: position.x, y: position.y - 1 };
    const below = { x: position.x, y: position.y + 1 };

    if (left.x < 0) {
      filled = false;
      break while_loop;
    }

    if (right.x >= areaTypes[right.y].length) {
      filled = false;
      break while_loop;
    }

    if (above.y < 0) {
      filled = false;
      break while_loop;
    }

    if (below.y >= areaTypes.length) {
      filled = false;
      break while_loop;
    }

    const leftType = areaTypes[left.y][left.x];
    const rightType = areaTypes[right.y][right.x];
    const aboveType = areaTypes[above.y][above.x];
    const belowType = areaTypes[below.y][below.x];

    if (
      leftType === 'outside' ||
      rightType === 'outside' ||
      aboveType === 'outside' ||
      belowType === 'outside'
    ) {
      filled = false;
      break while_loop;
    }

    if (type === 'unknown' || type.includes('-h')) {
      // if (leftType === 'unknown') {
      if (leftType === 'unknown' || leftType.includes('-h')) {
        if (
          !positionsToCheck.some(
            (test) => test.x === left.x && test.y === left.y,
          )
        ) {
          console.log('Adding Left: ', left);
          positionsToCheck.push(left);
        }
      }

      // if (rightType === 'unknown') {
      if (rightType === 'unknown' || rightType.includes('-h')) {
        if (
          !positionsToCheck.some(
            (test) => test.x === right.x && test.y === right.y,
          )
        ) {
          console.log('Adding Right: ', right);
          positionsToCheck.push(right);
        }
      }
    }

    if (type === 'unknown' || type.includes('-v')) {
      // if (aboveType === 'unknown') {
      if (aboveType === 'unknown' || aboveType.includes('-v')) {
        if (
          !positionsToCheck.some(
            (test) => test.x === above.x && test.y === above.y,
          )
        ) {
          console.log('Adding Above: ', above);
          positionsToCheck.push(above);
        }
      }

      // if (belowType === 'unknown') {
      if (belowType === 'unknown' || belowType.includes('-v')) {
        if (
          !positionsToCheck.some(
            (test) => test.x === below.x && test.y === below.y,
          )
        ) {
          console.log('Adding Below: ', below);
          positionsToCheck.push(below);
        }
      }
    }
  }

  if (filled) {
    for (const position of potentialInsidePositions) {
      areaTypes[position.y][position.x] = 'inside';
    }
  } else {
    for (const position of potentialInsidePositions) {
      areaTypes[position.y][position.x] = 'outside';
    }
  }
}
