export function parseNumbers(input: string): number[] {
  let delimiter = /,|:/;
  let expression = input;

  expression = expression.replace(/\\n/g, '\n');

  if (input.startsWith('//')) {
    const match = expression.match(/^\/\/(.)\n(.*)$/);
    if (!match) {
      throw new Error('[ERROR] 잘못된 구분자 형식입니다.');
    }

    const [, custom, rest] = match;

    const escapedCustom = custom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    delimiter = new RegExp(`[${escapedCustom},:]`);
    expression = rest;
  }

  const numbers = expression.split(delimiter).map(Number);

  if (numbers.some((num) => isNaN(num))) {
    throw new Error('[ERROR] 잘못된 입력입니다.');
  }

  if (numbers.some((num) => num < 0)) {
    throw new Error('[ERROR] 음수는 입력할 수 없습니다.');
  }

  return numbers;
}
