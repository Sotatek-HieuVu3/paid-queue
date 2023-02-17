import BigNumber from 'bignumber.js';

/**
 *
 * @param value - The value to be formatted
 * @returns string - The formatted value
 *
 * @description
 * This function formats a number to a string which contains e notation
 * E.g: 1e-9 -> 0.0000001
 * E.g: 1e+9 -> 1000000000
 */
export const normalizeNumber = (value: number | string): string => {
  let parsedValue = typeof value === 'string' ? parseFloat(value) : value;

  if (Math.abs(parsedValue) < 1.0) {
    const e = parseInt(value.toString().split('e-')[1]);
    if (e) {
      parsedValue *= Math.pow(10, e - 1);
      return (
        '0.' + new Array(e).join('0') + parsedValue.toString().substring(2)
      );
    }
    return parsedValue.toString();
  }

  let e = parseInt(value.toString().split('+')[1]);
  if (e > 20) {
    e -= 20;
  }

  return parsedValue / Math.pow(10, e) + new Array(e + 1).join('0');
};

export const generateNumber = (numberOfDigits: number): number => {
  return Math.floor(Math.random() * Math.pow(10, numberOfDigits));
};
const compareNumberStr = (numberA: string, numberB: string): number => {
  /**
   * 1: numberA is greater than numberB
   * 0: numberA is equal to numberB
   * -1: numberA is less than numberB
   */
  return new BigNumber(numberA).comparedTo(new BigNumber(numberB));
};

export const isLessThanStr = (numberA: string, numberB: string): boolean => {
  return compareNumberStr(numberA, numberB) === -1;
};

export const isEqualStr = (numberA: string, numberB: string): boolean => {
  return compareNumberStr(numberA, numberB) === 0;
};

export const isGreaterStr = (numberA: string, numberB: string): boolean => {
  return compareNumberStr(numberA, numberB) === 1;
};

export const minusStr = (numberA: string, numberB: string): string => {
  return new BigNumber(numberA).minus(new BigNumber(numberB)).toString();
};

export const multiStr = (numberA: string, numberB: string | number): string => {
  return new BigNumber(numberA).multipliedBy(new BigNumber(numberB)).toString();
};

export const plusStr = (numberA: string, numberB: string | number): string => {
  return new BigNumber(numberA).plus(new BigNumber(numberB)).toString();
};

export const powStr = (numberA: string, numberB: string | number): string => {
  return new BigNumber(numberA).pow(new BigNumber(numberB)).toString();
};

export const deviceStrByPower = (
  numberA: string,
  numberB: string | number,
): string => {
  return new BigNumber(numberA).dividedBy(powStr('10', numberB)).toString();
};
