export const filterDuplicate = <
  T extends { id: number },
  K extends keyof T,
  V extends T[K] extends string | number | boolean ? string | number : never
>(
  items: T[], //@ts-ignore
  get: (item: T) => V = (item) => item.id
) => {
  const seenIds = new Set<V>();
  return items.filter((item, index, self) => {
    if (seenIds.has(get(item))) return false;
    seenIds.add(get(item));
    return true;
  });
};
