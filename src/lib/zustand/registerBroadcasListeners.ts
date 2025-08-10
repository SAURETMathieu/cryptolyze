import { capitalize } from "@/src/utils";

import { BroadcastChannelUtil } from "../broadcast";

export const registerBroadcastListeners = <T extends object>(
  storeSetter: (partial: Partial<T>) => void,
  keys: (keyof T)[],
  channel: BroadcastChannelUtil,
  getState: () => T,
  keysToCheck: (keyof T)[]
) => {
  channel.onMessage((type, data) => {
    if (type === "ping") {
      const state = getState();
      const serializableState = {} as any;
      keys.forEach((key) => {
        const value = state[key];
        if (typeof value !== "function") {
          serializableState[key] = value;
        }
      });
      channel.send("pong", serializableState);
      return;
    }

    if (type === "pong") {
      const state = getState();
      const isReady = keysToCheck.some((key) => state[key]);
      if (!isReady) {
        const filteredData = {} as any;
        Object.keys(data).forEach((key) => {
          if (typeof data[key] !== "function") {
            filteredData[key] = data[key];
          }
        });
        storeSetter(filteredData);
      }
      return;
    }

    keys.forEach((key) => {
      if (type === `set${capitalize(String(key))}`) {
        storeSetter({ [key]: data } as Partial<T>);
      }
    });

    if (type === "setStore") {
      const filteredData = {} as any;
      Object.keys(data).forEach((key) => {
        if (typeof data[key] !== "function") {
          filteredData[key] = data[key];
        }
      });
      storeSetter(filteredData);
    }
  });
};
