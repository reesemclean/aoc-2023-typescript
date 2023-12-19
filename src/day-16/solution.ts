export const expectedPartOneSampleOutput = '46';

interface Point {
  x: number;
  y: number;
}

type Direction = 'right' | 'down' | 'left' | 'up';

interface Ray {
  direction: Direction;
  point: Point;
}

type Item = '.' | '/' | '\\' | '-' | '|';

type Grid = Item[][];

export function solvePartOne(input: string): string {
  const grid: Grid = input.split('\n').map((line) => line.split('')) as Grid;

  const initialRay = {
    direction: 'right',
    point: { x: 0, y: 0 },
  } as const;

  return findEnergizedRayCountStartingAt(initialRay, grid).toString();
}

function nextRay(currentRay: Ray, grid: Item[][]): Ray[] {
  const item = grid[currentRay.point.y][currentRay.point.x];

  switch (item) {
    case '.': {
      return continuePath(currentRay, grid);
    }
    case '-': {
      if (currentRay.direction === 'right' || currentRay.direction === 'left') {
        return continuePath(currentRay, grid);
      } else {
        return splitPath(currentRay, grid, 'horizontal');
      }
    }
    case '|': {
      if (currentRay.direction === 'up' || currentRay.direction === 'down') {
        return continuePath(currentRay, grid);
      } else {
        return splitPath(currentRay, grid, 'vertical');
      }
    }
    case '/': {
      switch (currentRay.direction) {
        case 'right':
          return [
            {
              point: { x: currentRay.point.x, y: currentRay.point.y - 1 },
              direction: 'up',
            } as const,
          ].filter((ray) => pointIsOnGrid(ray.point, grid));
        case 'left':
          return [
            {
              point: { x: currentRay.point.x, y: currentRay.point.y + 1 },
              direction: 'down',
            } as const,
          ].filter((ray) => pointIsOnGrid(ray.point, grid));
        case 'up':
          return [
            {
              point: { x: currentRay.point.x + 1, y: currentRay.point.y },
              direction: 'right',
            } as const,
          ].filter((ray) => pointIsOnGrid(ray.point, grid));
        case 'down':
          return [
            {
              point: { x: currentRay.point.x - 1, y: currentRay.point.y },
              direction: 'left',
            } as const,
          ].filter((ray) => pointIsOnGrid(ray.point, grid));
      }
    }
    case '\\': {
      switch (currentRay.direction) {
        case 'right':
          return [
            {
              point: { x: currentRay.point.x, y: currentRay.point.y + 1 },
              direction: 'down',
            } as const,
          ].filter((ray) => pointIsOnGrid(ray.point, grid));
        case 'left':
          return [
            {
              point: { x: currentRay.point.x, y: currentRay.point.y - 1 },
              direction: 'up',
            } as const,
          ].filter((ray) => pointIsOnGrid(ray.point, grid));
        case 'up':
          return [
            {
              point: { x: currentRay.point.x - 1, y: currentRay.point.y },
              direction: 'left',
            } as const,
          ].filter((ray) => pointIsOnGrid(ray.point, grid));
        case 'down':
          return [
            {
              point: { x: currentRay.point.x + 1, y: currentRay.point.y },
              direction: 'right',
            } as const,
          ].filter((ray) => pointIsOnGrid(ray.point, grid));
      }
    }
  }

  return [];
}

function splitPath(
  ray: Ray,
  grid: Grid,
  direction: 'vertical' | 'horizontal',
): Ray[] {
  switch (direction) {
    case 'horizontal': {
      return [
        {
          point: { x: ray.point.x - 1, y: ray.point.y },
          direction: 'left',
        } as const,
        {
          point: { x: ray.point.x + 1, y: ray.point.y },
          direction: 'right',
        } as const,
      ].filter((ray) => pointIsOnGrid(ray.point, grid));
    }
    case 'vertical': {
      return [
        {
          point: { x: ray.point.x, y: ray.point.y - 1 },
          direction: 'up',
        } as const,
        {
          point: { x: ray.point.x, y: ray.point.y + 1 },
          direction: 'down',
        } as const,
      ].filter((ray) => pointIsOnGrid(ray.point, grid));
    }
  }
}

function continuePath(ray: Ray, grid: Grid): Ray[] {
  const direction = ray.direction;

  let nextPoint: Point;
  switch (direction) {
    case 'right':
      nextPoint = { x: ray.point.x + 1, y: ray.point.y };
      break;
    case 'down':
      nextPoint = { x: ray.point.x, y: ray.point.y + 1 };
      break;
    case 'left':
      nextPoint = { x: ray.point.x - 1, y: ray.point.y };
      break;
    case 'up':
      nextPoint = { x: ray.point.x, y: ray.point.y - 1 };
      break;
  }

  return [{ ...ray, point: nextPoint }].filter((ray) =>
    pointIsOnGrid(ray.point, grid),
  );
}

function pointIsOnGrid(point: Point, grid: Grid): boolean {
  return (
    point.x >= 0 &&
    point.y >= 0 &&
    point.y < grid.length &&
    point.x < grid[point.y].length
  );
}

export const expectedPartTwoSampleOutput = '51';

export function solvePartTwo(input: string): string {
  const grid: Grid = input.split('\n').map((line) => line.split('')) as Grid;

  let maxEnergizedPoints = 0;

  const initialRays: Ray[] = [];

  for (let x = 0; x < grid[0].length; x++) {
    const initialRay = {
      direction: 'down',
      point: { x, y: 0 },
    } as const;
    initialRays.push(initialRay);
  }

  const lastRowIndex = grid.length - 1;
  for (let x = 0; x < grid[0].length; x++) {
    const initialRay = {
      direction: 'up',
      point: { x, y: lastRowIndex },
    } as const;
    initialRays.push(initialRay);
  }

  for (let y = 0; y < grid.length; y++) {
    const initialRay = {
      direction: 'right',
      point: { x: 0, y },
    } as const;
    initialRays.push(initialRay);
  }

  const lastColumnIndex = grid[0].length - 1;
  for (let y = 0; y <= lastColumnIndex; y++) {
    const initialRay = {
      direction: 'left',
      point: { x: lastColumnIndex, y },
    } as const;
    initialRays.push(initialRay);
  }

  for (const [rayIndex, ray] of initialRays.entries()) {
    console.log(`Solving ${rayIndex + 1} of ${initialRays.length}`);

    const energizedRayCount = findEnergizedRayCountStartingAt(ray, grid);

    if (energizedRayCount > maxEnergizedPoints) {
      maxEnergizedPoints = energizedRayCount;
    }
  }

  return maxEnergizedPoints.toString();
}

function findEnergizedRayCountStartingAt(initialRay: Ray, grid: Grid): number {
  let currentRays: Ray[] = [initialRay];

  const energizedPoints: Point[] = [];
  const seenRays: Ray[] = [];

  while (currentRays.length > 0) {
    seenRays.push(...currentRays);

    const points = currentRays.map((r) => r.point);
    for (const point of points) {
      if (energizedPoints.every((p) => !(p.x === point.x && p.y === point.y))) {
        energizedPoints.push(point);
      }
    }

    const nextRays = currentRays
      .flatMap((ray) => nextRay(ray, grid))
      .filter((ray) => {
        const isSeen = seenRays.some(
          (r) =>
            r.point.x === ray.point.x &&
            r.point.y === ray.point.y &&
            r.direction === ray.direction,
        );
        return !isSeen;
      });

    currentRays = [...nextRays];
  }

  return energizedPoints.length;
}
