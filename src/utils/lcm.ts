export function lcm(numbers: number[]): number {
  function gcd(a: number, b: number): number {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  }

  function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
  }

  let result = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
  }

  return result;
}
