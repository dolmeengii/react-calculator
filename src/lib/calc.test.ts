import { describe, expect, it } from 'vitest';
import { calculate } from './calculate';

describe('문자열 계산기', () => {
  it('빈 문자열은 0을 반환한다', () => {
    expect(calculate('')).toBe(0);
  });

  it('쉼표 또는 콜론으로 구분된 숫자를 더한다', () => {
    expect(calculate('1,2,3')).toBe(6);
    expect(calculate('1:2:3')).toBe(6);
  });

  it('커스텀 구분자를 사용할 수 있다', () => {
    expect(calculate('//;\n1;2;3')).toBe(6);
  });

  it('음수를 입력하면 에러 발생', () => {
    expect(() => calculate('-1,2,3')).toThrow();
  });
});
