export const expectedPartOneSampleOutput = '288';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  const times = lines[0]
    .split(':')[1]
    .trim()
    .split(' ')
    .filter((n) => n.length > 0)
    .flatMap((n) => parseInt(n, 10));

  const distances = lines[1]
    .split(':')[1]
    .trim()
    .split(' ')
    .filter((n) => n.length > 0)
    .flatMap((n) => parseInt(n, 10));

  const numberOfWinningTimesPerRace: number[] = [];

  for (let i = 0; i < times.length; i++) {
    const maxTime = times[i];
    const winningDistance = distances[i];

    let numberOfWinningTimes = 0;

    for (let timeHeld = 0; timeHeld < maxTime; timeHeld++) {
      const speed = timeHeld;
      const time = maxTime - timeHeld;
      const distance = speed * time;

      if (distance > winningDistance) {
        numberOfWinningTimes++;
      }
    }

    numberOfWinningTimesPerRace.push(numberOfWinningTimes);
  }

  return numberOfWinningTimesPerRace
    .reduce((prev, curr) => prev * curr, 1)
    .toString();
}

export const expectedPartTwoSampleOutput = '71503';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const time = parseInt(lines[0].split(':')[1].replaceAll(' ', ''), 10);

  const longestDistance = parseInt(
    lines[1].split(':')[1].replaceAll(' ', ''),
    10,
  );

  let numberOfWinningTimes = 0;

  let lowGuess = 0;
  let highGuess = time;

  while (highGuess - lowGuess > 1) {
    const speed = Math.ceil((highGuess - lowGuess) / 2 + lowGuess);
    const timeMoving = time - speed;
    const distance = speed * timeMoving;

    if (distance > longestDistance) {
      highGuess = Math.floor(speed);
    } else {
      lowGuess = Math.floor(speed);
    }
  }

  const minTimeToWin = highGuess;

  lowGuess = 0;
  highGuess = time;

  while (highGuess - lowGuess > 1) {
    const speed = Math.ceil((highGuess - lowGuess) / 2 + lowGuess);
    const timeMoving = time - speed;
    const distance = speed * timeMoving;

    if (distance < longestDistance) {
      highGuess = Math.floor(speed);
    } else {
      lowGuess = Math.floor(speed);
    }
  }

  const maxTimeToWin = highGuess;

  console.log({ minTimeToWin, maxTimeToWin });

  return (maxTimeToWin - minTimeToWin).toString();
}
