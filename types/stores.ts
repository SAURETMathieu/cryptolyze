import { CryptoYearlyHistoryStatusType } from "./returnType";

export type GlobalStoreState = {
  lastUpdated: number | null;
  userInfosLoaded: boolean;
  currentForm: any[] | null;
  setStore: (store: GlobalStoreState) => void;
};

export type CryptoHistoryStoreState = {
  cryptoHistories: CryptoYearlyHistoryStatusType[];
  cryptoHistoriesFetched: boolean;
  setStore: (store: CryptoHistoryStoreState) => void;

  setCryptoHistories: (
    cryptoHistories: CryptoYearlyHistoryStatusType[]
  ) => void;
  setCryptoHistoriesFetched: (cryptoHistoriesFetched: boolean) => void;

  deleteCryptoHistory: (id: number) => void;
  deleteMultipleCryptoHistories: (ids: number[]) => void;
};
