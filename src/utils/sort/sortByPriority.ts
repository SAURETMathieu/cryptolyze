export function sortByPriority<T>(
  array: T[],
  priorities: string[],
  key: keyof T
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key] as string;
    const bValue = b[key] as string;

    const aPriority = priorities.includes(aValue)
      ? priorities.indexOf(aValue)
      : priorities.length;

    const bPriority = priorities.includes(bValue)
      ? priorities.indexOf(bValue)
      : priorities.length;

    return aPriority - bPriority;
  });
}
