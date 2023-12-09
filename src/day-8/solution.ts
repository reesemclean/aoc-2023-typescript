import { lcm } from '../utils/lcm';

export const expectedPartOneSampleOutput = '2';

export function solvePartOne(input: string): string {
  const lines = input.split('\n');

  const instructions = lines[0];
  let instructionIndex = 0;

  const nodes = lines.slice(2).reduce((map, line) => {
    const [nodeName, nodes] = line.split(' = ');
    const [leftNodeName, rightNodeName] = nodes
      .replace('(', '')
      .replace(')', '')
      .split(', ');
    map.set(nodeName, { leftNodeName, rightNodeName });
    return map;
  }, new Map<string, { leftNodeName: string; rightNodeName: string }>());

  const targetNodeName = 'ZZZ';

  let instructionsExecuted = 0;
  let currentNodeName = 'AAA';

  while (currentNodeName !== targetNodeName) {
    const instruction = instructions[instructionIndex];
    const { leftNodeName, rightNodeName } = nodes.get(currentNodeName)!;

    currentNodeName = instruction === 'L' ? leftNodeName : rightNodeName;
    instructionsExecuted++;

    instructionIndex = (instructionIndex + 1) % instructions.length;
  }

  return instructionsExecuted.toString();
}

export const expectedPartTwoSampleOutput = '6';

export function solvePartTwo(input: string): string {
  const lines = input.split('\n');

  const instructions = lines[0];

  const nodes = lines.slice(2).reduce((map, line) => {
    const [nodeName, nodes] = line.split(' = ');
    const [leftNodeName, rightNodeName] = nodes
      .replace('(', '')
      .replace(')', '')
      .split(', ');
    map.set(nodeName, { leftNodeName, rightNodeName });
    return map;
  }, new Map<string, { leftNodeName: string; rightNodeName: string }>());

  const startingNodeNames: string[] = [];

  for (const key of nodes.keys()) {
    if (key.endsWith('A')) {
      startingNodeNames.push(key);
    }
  }

  const instructionsRequiredPerNode: number[] = [];

  for (const startingNodeName of startingNodeNames) {
    let instructionsExecuted = 0;
    let currentNodeName = startingNodeName;
    let instructionIndex = 0;

    while (!currentNodeName.endsWith('Z')) {
      const instruction = instructions[instructionIndex];
      const { leftNodeName, rightNodeName } = nodes.get(currentNodeName)!;

      currentNodeName = instruction === 'L' ? leftNodeName : rightNodeName;
      instructionsExecuted++;

      instructionIndex = (instructionIndex + 1) % instructions.length;
    }

    instructionsRequiredPerNode.push(instructionsExecuted);
  }

  const leastCommonMultiple = lcm(instructionsRequiredPerNode);

  return leastCommonMultiple.toString();
}

// This was my attempt at finding the LCM without using co-pilot.
// The co-pilot solution in src/utils/lcm.ts is much better.
// function findLCM(values: number[]): number {
//   const primesPerNumber = values.map((value) => primesOf(value));
//   const countOfPrimesPerNumber = primesPerNumber.map((primes) => {
//     return primes.reduce((map, prime) => {
//       map.set(prime, (map.get(prime) ?? 0) + 1);
//       return map;
//     }, new Map<number, number>());
//   });

//   const minPrimeCounts = new Map<number, number>();

//   for (const countOfPrimes of countOfPrimesPerNumber) {
//     for (const [prime, count] of countOfPrimes.entries()) {
//       const existingCount = minPrimeCounts.get(prime) ?? Infinity;
//       minPrimeCounts.set(prime, Math.min(existingCount, count));
//     }
//   }

//   let lcm = 1;

//   for (const [prime, count] of minPrimeCounts.entries()) {
//     lcm *= prime ** count;
//   }

//   return lcm;
// }

// function primesOf(n: number): number[] {
//   const primes = [];

//   for (let i = 2; i <= n; i++) {
//     if (n % i === 0) {
//       primes.push(i);
//       n /= i;
//     }
//   }

//   return primes;
// }
