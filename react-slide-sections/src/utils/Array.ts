export function reverseArrayIndex(array: any[], index: number) {
  /**
   * reversing algorithm for array
   * ex) if array = [1,2,3,4,5] and index = 7, return value is 3.
   * ex2) if array = [1,2,3,4,5] and index = -2, return value is 4
   *  */
  return index < 0
    ? array.length - (Math.abs(index) % array.length)
    : index % array.length;
}
