export const expectedPartOneSampleOutput = '8';

const limits = {
  red: 12,
  green: 13,
  blue: 14,
};

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  return lines
    .map((line) => {
      const [game, rest] = line.split(': ');
      const gameSets = rest.split('; ');

      const shouldInclude = gameSets.every((gameSet) => {
        const colorSets = gameSet.split(', ');

        return colorSets.every((colorSet) => {
          const [count, color] = colorSet.split(' ');

          const limit = limits[color as 'red' | 'green' | 'blue'];

          const parsedCount = parseInt(count, 10);
          return parsedCount <= limit;
        });
      });

      if (shouldInclude) {
        const gameId = game.split(' ')[1];
        return parseInt(gameId, 10);
      } else {
        return 0;
      }
    })
    .reduce((acc, curr) => acc + curr, 0)
    .toString();
}

export const expectedPartTwoSampleOutput = '2286';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const powers: number[] = lines.map((line) => {
    const gameData = line.split(': ')[1];
    const gameSets = gameData.split('; ');
    let minRed = 0,
      minGreen = 0,
      minBlue = 0;

    for (const gameSet of gameSets) {
      const colorSets = gameSet.split(', ');
      for (const colorSet of colorSets) {
        const [count, color] = colorSet.split(' ');
        const parsedCount = parseInt(count, 10);
        switch (color) {
          case 'red':
            minRed = Math.max(minRed, parsedCount);
            break;
          case 'green':
            minGreen = Math.max(minGreen, parsedCount);
            break;
          case 'blue':
            minBlue = Math.max(minBlue, parsedCount);
            break;
        }
      }
    }

    return minRed * minGreen * minBlue;
  });

  const sum = powers.reduce((acc, curr) => acc + curr, 0);
  return sum.toString();
}
