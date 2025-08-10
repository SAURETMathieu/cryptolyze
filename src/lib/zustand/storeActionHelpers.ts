import { capitalize } from "@/src/utils";

// Generic type for items with ID
export interface WithId {
  id: number | string | null;
}

// Generic action helpers for external store usage
export const createStoreActionHelpers = <
  T extends WithId,
  K extends string = "items",
>(
  propertyName: K,
  getState: () => any,
  setterName?: string
) => {
  const actualSetterName = setterName || "set" + capitalize(propertyName);

  return {
    // Delete actions
    deleteById: (ids: (number | string)[]) => {
      const id = ids[0];
      const state = getState();
      const items = state[propertyName];
      const setter = state[actualSetterName];
      const filteredItems = items.filter((item: T) => item.id !== id);
      setter?.call(state, filteredItems);
    },

    deleteMultipleByIds: (ids: (number | string)[]) => {
      const state = getState();
      const items = state[propertyName];
      const setter = state[actualSetterName];
      const filteredItems = items.filter(
        (item: T) => !ids.includes(item.id as number | string)
      );
      setter?.call(state, filteredItems);
    },

    deleteByIndex: (index: number) => {
      const state = getState();
      const items = state[propertyName];
      const setter = state[actualSetterName];
      const filteredItems = items.filter((_: T, i: number) => i !== index);
      setter?.call(state, filteredItems);
    },

    deleteMultipleByIndexes: (indexes: number[]) => {
      const state = getState();
      const items = state[propertyName];
      const filteredItems = items.filter(
        (_: T, i: number) => !indexes.includes(i)
      );
      const setter = state[actualSetterName];
      setter?.call(state, filteredItems);
    },

    // Update actions
    updateById: (id: number | string, updates: Partial<T>) => {
      const state = getState();
      const items = state[propertyName];
      const updatedItems = items.map((item: T) =>
        item.id === id ? { ...item, ...updates } : item
      );
      const setter = state[actualSetterName];
      setter?.call(state, updatedItems);
    },

    updateMultipleByIds: (
      updates: Array<{ id: number | string; updates: Partial<T> }>
    ) => {
      const state = getState();
      const items = state[propertyName];
      const updatedItems = items.map((item: T) => {
        const update = updates.find((u) => u.id === item.id);
        return update ? { ...item, ...update.updates } : item;
      });
      const setter = state[actualSetterName];
      setter?.call(state, updatedItems);
    },

    updateByIndex: (index: number, updates: Partial<T>) => {
      const state = getState();
      const items = state[propertyName];
      const updatedItems = items.map((item: T, i: number) =>
        i === index ? { ...item, ...updates } : item
      );
      const setter = state[actualSetterName];
      setter?.call(state, updatedItems);
    },

    // Add actions
    addItem: (item: T) => {
      const state = getState();
      const items = state[propertyName];
      const setter = state[actualSetterName];
      setter?.call(state, [...items, item]);
    },

    addMultipleItems: (newItems: T[]) => {
      const state = getState();
      const items = state[propertyName];
      const setter = state[actualSetterName];
      setter?.call(state, [...items, ...newItems]);
    },

    addItemAtIndex: (item: T, index: number) => {
      const state = getState();
      const items = state[propertyName];
      const newItems = [...items.slice(0, index), item, ...items.slice(index)];
      const setter = state[actualSetterName];
      setter?.call(state, newItems);
    },

    addMultipleItemsAtIndex: (newItems: T[], index: number) => {
      const state = getState();
      const items = state[propertyName];
      const newItemsArray = [
        ...items.slice(0, index),
        ...newItems,
        ...items.slice(index),
      ];
      const setter = state[actualSetterName];
      setter?.call(state, newItemsArray);
    },

    // Replace actions
    replaceItemAtIndex: (item: T, index: number) => {
      const state = getState();
      const items = state[propertyName];
      const updatedItems = items.map((existingItem: T, i: number) =>
        i === index ? item : existingItem
      );
      const setter = state[actualSetterName];
      setter?.call(state, updatedItems);
    },

    // Filter actions
    filterBy: <P extends keyof T>(key: P, value: T[P]) => {
      const state = getState();
      const items = state[propertyName];
      const filteredItems = items.filter((item: T) => item[key] === value);
      const setter = state[actualSetterName];
      setter?.call(state, filteredItems);
    },

    filterByMultiple: <P extends keyof T>(
      filters: Array<{ key: P; value: T[P] }>
    ) => {
      const state = getState();
      const items = state[propertyName];
      const filteredItems = items.filter((item: T) =>
        filters.every((filter) => item[filter.key] === filter.value)
      );
      const setter = state[actualSetterName];
      setter?.call(state, filteredItems);
    },

    // Sort actions
    sortBy: <P extends keyof T>(key: P, direction: "asc" | "desc" = "asc") => {
      const state = getState();
      const items = state[propertyName];
      const sortedItems = [...items].sort((a: T, b: T) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
      const setter = state[actualSetterName];
      setter?.call(state, sortedItems);
    },
  };
};
