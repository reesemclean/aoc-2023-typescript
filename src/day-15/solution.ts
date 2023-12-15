export const expectedPartOneSampleOutput = '1320';

export function solvePartOne(input: string): string {
  return input
    .split(',')
    .reduce((acc, step) => {
      const hashValue = hash(step);
      return acc + hashValue;
    }, 0)
    .toString();
}

export const expectedPartTwoSampleOutput = '145';

export function solvePartTwo(input: string): string {
  const steps = input.split(',');

  const boxes = new Map<number, { label: string; focalLength: number }[]>();

  for (const step of steps) {
    const operationType = step.includes('=') ? 'add' : 'remove';
    if (operationType === 'add') {
      const [label, focalLength] = step.split('=');
      const boxNumber = hash(label);
      const box = boxes.get(boxNumber) || [];

      const existingLensIndex = box.findIndex((item) => item.label === label);
      if (existingLensIndex < 0) {
        box.push({ label, focalLength: parseInt(focalLength, 10) });
      } else {
        box[existingLensIndex] = {
          label,
          focalLength: parseInt(focalLength, 10),
        };
      }

      boxes.set(boxNumber, box);
    } else {
      const label = step.replace('-', '');
      const boxNumber = hash(label);
      const box = boxes.get(boxNumber);

      if (!box) {
        continue;
      }

      const existingLensIndex = box.findIndex((item) => item.label === label);
      if (existingLensIndex >= 0) {
        box.splice(existingLensIndex, 1);
      }
    }
  }

  let sum = 0;
  for (const [boxNumber, box] of boxes.entries()) {
    for (const [slotNumber, { focalLength }] of box.entries()) {
      const lensPower = (1 + boxNumber) * (1 + slotNumber) * focalLength;
      sum += lensPower;
    }
  }

  return sum.toString();
}

function hash(value: string): number {
  let currentValue = 0;

  for (let i = 0; i < value.length; i++) {
    const asciiCode = value.charCodeAt(i);
    currentValue += asciiCode;
    currentValue *= 17;
    currentValue = currentValue % 256;
  }

  return currentValue;
}
