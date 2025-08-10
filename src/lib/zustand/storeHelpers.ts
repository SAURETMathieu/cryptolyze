// Generic type for items with ID
export interface WithId {
  id: number | string | null;
}

// Helpers for delete operations
export const createDeleteHelpers = <
  T extends WithId,
  K extends string = "items",
>(
  propertyName: K
) => ({
  deleteById: (id: number | string) => (state: Record<K, T[]>) =>
    ({
      [propertyName]: state[propertyName].filter((item) => item.id !== id),
    }) as Record<K, T[]>,

  deleteMultipleByIds: (ids: (number | string)[]) => (state: Record<K, T[]>) =>
    ({
      [propertyName]: state[propertyName].filter(
        (item) => !ids.includes(item.id as number | string)
      ),
    }) as Record<K, T[]>,

  deleteByIndex: (index: number) => (state: Record<K, T[]>) =>
    ({
      [propertyName]: state[propertyName].filter((_, i) => i !== index),
    }) as Record<K, T[]>,

  deleteMultipleByIndexes: (indexes: number[]) => (state: Record<K, T[]>) =>
    ({
      [propertyName]: state[propertyName].filter(
        (_, i) => !indexes.includes(i)
      ),
    }) as Record<K, T[]>,
});

// Helpers for update operations
export const createUpdateHelpers = <
  T extends WithId,
  K extends string = "items",
>(
  propertyName: K
) => ({
  updateById:
    (id: number | string, updates: Partial<T>) => (state: Record<K, T[]>) =>
      ({
        [propertyName]: state[propertyName].map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      }) as Record<K, T[]>,

  updateMultipleByIds:
    (updates: Array<{ id: number | string; updates: Partial<T> }>) =>
    (state: Record<K, T[]>) =>
      ({
        [propertyName]: state[propertyName].map((item) => {
          const update = updates.find((u) => u.id === item.id);
          return update ? { ...item, ...update.updates } : item;
        }),
      }) as Record<K, T[]>,

  updateByIndex:
    (index: number, updates: Partial<T>) => (state: Record<K, T[]>) =>
      ({
        [propertyName]: state[propertyName].map((item, i) =>
          i === index ? { ...item, ...updates } : item
        ),
      }) as Record<K, T[]>,
});

// Helpers for add operations
export const createAddHelpers = <T, K extends string = "items">(
  propertyName: K
) => ({
  addItem: (item: T) => (state: Record<K, T[]>) =>
    ({
      [propertyName]: [...state[propertyName], item],
    }) as Record<K, T[]>,

  addMultipleItems: (newItems: T[]) => (state: Record<K, T[]>) =>
    ({
      [propertyName]: [...state[propertyName], ...newItems],
    }) as Record<K, T[]>,

  addItemAtIndex: (item: T, index: number) => (state: Record<K, T[]>) =>
    ({
      [propertyName]: [
        ...state[propertyName].slice(0, index),
        item,
        ...state[propertyName].slice(index),
      ],
    }) as Record<K, T[]>,

  addMultipleItemsAtIndex:
    (newItems: T[], index: number) => (state: Record<K, T[]>) =>
      ({
        [propertyName]: [
          ...state[propertyName].slice(0, index),
          ...newItems,
          ...state[propertyName].slice(index),
        ],
      }) as Record<K, T[]>,
});

// Helpers for replace operations
export const createReplaceHelpers = <T, K extends string = "items">(
  propertyName: K
) => ({
  replaceItemAtIndex: (item: T, index: number) => (state: Record<K, T[]>) =>
    ({
      [propertyName]: state[propertyName].map((existingItem, i) =>
        i === index ? item : existingItem
      ),
    }) as Record<K, T[]>,
});

// Helper to create a store with all helpers
export const createStoreHelpers = <
  T extends WithId,
  K extends string = "items",
>(
  propertyName: K
) => {
  const deleteHelpers = createDeleteHelpers<T, K>(propertyName);
  const updateHelpers = createUpdateHelpers<T, K>(propertyName);
  const addHelpers = createAddHelpers<T, K>(propertyName);
  const replaceHelpers = createReplaceHelpers<T, K>(propertyName);

  return {
    ...deleteHelpers,
    ...updateHelpers,
    ...addHelpers,
    ...replaceHelpers,
  };
};
