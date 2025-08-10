import { create } from "zustand";

import { BroadcastChannelUtil } from "../broadcast";
import { registerBroadcastListeners } from "./registerBroadcasListeners";
import { createBroadcastSyncSetters } from "./zustandSync";

type CreateSyncedStoreOptions<T extends object> = {
  channelName: string;
  syncKeys: (keyof T)[];
  initKeys: (keyof T)[];
  partialStore: (
    set: (
      partial: T | Partial<T> | ((state: T) => T | Partial<T>),
      replace?: boolean
    ) => void,
    get: () => T
  ) => Partial<T>;
};

export function createSyncedStore<T extends object>({
  channelName,
  syncKeys,
  initKeys,
  partialStore,
}: CreateSyncedStoreOptions<T>) {
  const channel = new BroadcastChannelUtil(channelName);

  const useStore = create<T>((set, get) => {
    const syncedSetters = createBroadcastSyncSetters<T>(channel, set, syncKeys);

    setTimeout(() => {
      const state = get();
      const isReady = initKeys.some((key) => !!state[key]);
      if (!isReady) {
        channel.send("ping", {});
      }
    }, 100);

    return {
      ...partialStore(set, get),
      ...syncedSetters,
    } as T;
  });

  registerBroadcastListeners<T>(
    useStore.setState,
    syncKeys,
    channel,
    useStore.getState,
    initKeys
  );

  return useStore;
}
