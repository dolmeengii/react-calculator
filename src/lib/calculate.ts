import { parseNumbers } from './parse';

export function calculate(input: string): number {
  if (!input) return 0;
  const numbers = parseNumbers(input);
  return numbers.reduce((sum, num) => sum + num, 0);
}
