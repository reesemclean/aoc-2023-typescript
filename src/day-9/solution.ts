export const expectedPartOneSampleOutput = '114';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  const nextNumbers: number[] = [];

  for (const line of lines) {
    const values = line.split(' ').map((value) => parseInt(value, 10));
    const sequences = recursiveDiffedSequences(values);

    for (let i = sequences.length - 1; i > 0; i--) {
      const laterSequence = sequences[i];
      const earlierSequence = sequences[i - 1];
      const nextValue =
        laterSequence[laterSequence.length - 1] +
        earlierSequence[earlierSequence.length - 1];
      earlierSequence.push(nextValue);
    }

    const firstSequence = sequences[0];
    nextNumbers.push(firstSequence[firstSequence.length - 1]);
  }

  return nextNumbers.reduce((sum, value) => sum + value, 0).toString();
}

function recursiveDiffedSequences(sequence: number[]): number[][] {
  if (sequence.every((value) => value === 0)) {
    return [sequence];
  }

  return [sequence, ...recursiveDiffedSequences(findDiffedSequence(sequence))];
}

function findDiffedSequence(sequence: number[]): number[] {
  const nextSequence = [];

  for (let i = 0; i < sequence.length - 1; i++) {
    nextSequence.push(sequence[i + 1] - sequence[i]);
  }

  return nextSequence;
}

export const expectedPartTwoSampleOutput = '2';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const previousNumbers: number[] = [];

  for (const line of lines) {
    const values = line.split(' ').map((value) => parseInt(value, 10));
    const sequences = recursiveDiffedSequences(values);

    for (let i = sequences.length - 1; i > 0; i--) {
      const laterSequence = sequences[i];
      const earlierSequence = sequences[i - 1];
      const previousValue = earlierSequence[0] - laterSequence[0];
      earlierSequence.unshift(previousValue);
    }

    const firstSequence = sequences[0];
    previousNumbers.push(firstSequence[0]);
  }

  return previousNumbers.reduce((sum, value) => sum + value, 0).toString();
}
