export const combination = <T = any>(array: T[]): [T, T][] => {
  if (array.length <= 1) return [];
  if (array.length === 2) return [[array[0], array[1]]];
  const newArr: [T, T][] = [];
  for (let i = 0; i < array.length - 1; i++) {
    newArr.push([array[i], array[i + 1]]);
  }
  newArr.push([array[array.length - 1], array[0]]);
  return newArr;
};
