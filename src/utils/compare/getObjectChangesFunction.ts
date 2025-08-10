/**
 * Compares two arrays of objects (`originalItems` and `currentItems`) and returns an array of objects containing the changes
 * between the two arrays. Each object in the resulting array contains the properties that have changed with their new values.
 *
 * @template T
 * @param {T[]} originalItems - The array of original objects to compare with the current objects.
 * @param {T[]} currentItems - The array of current objects to compare with the original objects.
 * @param {keyof T} keyName - The key used to extract the value of the property in the object, typically a unique identifier.
 * @param {string} nameForKey - The dynamic name of the key to include in the resulting object.
 * @returns {Array<{ [key: string]: string | boolean }>} - An array of objects representing the changes between `originalItems` and `currentItems`.
 *
 * @example
 * const originalItems = [
 *   { id: 1, name: "John", age: 30 },
 *   { id: 2, name: "Jane", age: 25 }
 * ];
 *
 * const currentItems = [
 *   { id: 1, name: "John", age: 31 }, // Age change
 *   { id: 2, name: "Jane", age: 25 }
 * ];
 *
 * const result = getObjectChangesFunction(originalItems, currentItems, "id", "userId");
 *
 * console.log(result);
 * // Expected output:
 * // [
 * //   { userId: "1", age: 31 },
 * // ]
 */
export const getObjectChangesFunction = <T extends object>(
  originalItems: T[],
  currentItems: T[],
  keyName: keyof T,
  nameForKey: string
): { [key: string]: string | boolean }[] => {
  return currentItems.reduce(
    (acc: { [key: string]: string | boolean }[], item, index) => {
      const originalItem = originalItems[index];
      const itemChanges: { [key: string]: any } = {};

      // Compare the properties of each item
      Object.keys(item).forEach((key) => {
        if (item[key as keyof T] !== originalItem[key as keyof T]) {
          itemChanges[key] = item[key as keyof T];
        }
      });

      // If there are changes, add them to the results with a dynamic property
      if (Object.keys(itemChanges).length > 0) {
        acc.push({
          [nameForKey]: item[keyName] as unknown as string,
          ...itemChanges,
        });
      }
      return acc;
    },
    []
  );
};
