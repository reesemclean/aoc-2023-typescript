export const expectedPartOneSampleOutput = '142';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  let sum = 0;

  for (const line of lines) {
    const digits = line.replace(/\D/g, '');
    const firstAndLastDigit = `${digits.charAt(0)}${digits.charAt(
      digits.length - 1,
    )}`;

    sum = sum + parseInt(firstAndLastDigit, 10);
  }

  return sum.toString();
}

export const expectedPartTwoSampleOutput = '281';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const numbers = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  const numberKeys = Object.keys(numbers) as (keyof typeof numbers)[];

  return lines
    .map((line) => {
      let firstIndex = 0;
      let firstNumberKey: keyof typeof numbers | null = null;

      while (!firstNumberKey) {
        for (const numberKey of numberKeys) {
          if (line.startsWith(numberKey, firstIndex)) {
            firstNumberKey = numberKey;
            break;
          }
        }

        firstIndex++;
      }

      let lastIndex = line.length - 1;
      let lastNumberKey: keyof typeof numbers | null = null;

      while (!lastNumberKey) {
        for (const numberKey of numberKeys) {
          if (line.endsWith(numberKey, lastIndex + 1)) {
            lastNumberKey = numberKey;
            break;
          }
        }

        lastIndex--;
      }

      const firstNumber = numbers[firstNumberKey];
      const lastNumber = numbers[lastNumberKey];

      return firstNumber.toString() + lastNumber.toString();
    })
    .reduce((sum, number) => sum + parseInt(number, 10), 0)
    .toString();
}
