export type GlobalStoreState = {
  lastUpdated: number | null;
  userInfosLoaded: boolean;
  currentForm: any[] | null;
  setStore: (store: GlobalStoreState) => void;
};
