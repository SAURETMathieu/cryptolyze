import { capitalize } from "@/src/utils";

import { BroadcastChannelUtil } from "../broadcast";

export const createBroadcastSyncSetters = <T extends object>(
  channel: BroadcastChannelUtil,
  set: (partial: Partial<T>) => void,
  keys: (keyof T)[]
): {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
} => {
  const setters = {} as any;

  keys.forEach((key) => {
    setters[`set${capitalize(key as string)}`] = (value: any) => {
      set({ [key]: value } as Partial<T>);
      channel.send(`set${capitalize(key as string)}`, value);
    };
  });

  return setters;
};
