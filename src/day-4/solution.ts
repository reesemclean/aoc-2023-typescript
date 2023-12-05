export const expectedPartOneSampleOutput = '13';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  let sum = 0;

  for (const line of lines) {
    let valueOfCard = 0;
    const numbers = line.split(': ')[1];

    const [myNumbers, winningNumbers] = numbers.split(' | ');
    const myNumbersArray = myNumbers
      .trim()
      .split(' ')
      .filter((n) => n !== '');
    const winningNumbersArray = winningNumbers
      .trim()
      .split(' ')
      .filter((n) => n !== '');

    for (const numberToCheck of myNumbersArray) {
      if (winningNumbersArray.includes(numberToCheck)) {
        valueOfCard = valueOfCard === 0 ? 1 : valueOfCard * 2;
      }
    }

    sum += valueOfCard;
  }

  return sum.toString();
}

export const expectedPartTwoSampleOutput = '30';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const numberOfWinsPerCard: number[] = [];

  for (const line of lines) {
    let winsOnCard = 0;
    const numbers = line.split(': ')[1];

    const [myNumbers, winningNumbers] = numbers.split(' | ');
    const myNumbersArray = myNumbers
      .trim()
      .split(' ')
      .filter((n) => n !== '');
    const winningNumbersArray = winningNumbers
      .trim()
      .split(' ')
      .filter((n) => n !== '');

    for (const numberToCheck of myNumbersArray) {
      if (winningNumbersArray.includes(numberToCheck)) {
        winsOnCard++;
      }
    }

    numberOfWinsPerCard.push(winsOnCard);
  }

  const copyStack: number[] = [1];
  let totalScratchCards = 0;

  for (const numberOfWins of numberOfWinsPerCard) {
    const copies = copyStack.shift() ?? 1;
    totalScratchCards += copies;

    for (let offset = 0; offset < numberOfWins; offset++) {
      copyStack[offset] = (copyStack[offset] ?? 1) + copies;
    }
  }

  return totalScratchCards.toString();
}
