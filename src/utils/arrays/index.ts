export const filterDuplicate = <T extends { id: number }>(items: T[]) => {
  const seenIds = new Set<number>();
  return items.filter((item, index, self) => {
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });
};
