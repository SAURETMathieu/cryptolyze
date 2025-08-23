import { createSyncedStore } from "@/src/lib/zustand/createSyncedStore";
import { createStoreActionHelpers } from "@/src/lib/zustand/storeActionHelpers";
import { createStoreHelpers } from "@/src/lib/zustand/storeHelpers";
import { CryptoYearlyHistoryStatusType } from "@/types";
import { toast } from "sonner";

import { CryptoHistoryStoreState } from "@/types/stores";

const storeHelpers = createStoreHelpers<
  CryptoYearlyHistoryStatusType,
  "cryptoHistories"
>("cryptoHistories");

export const useCryptoHistoryStore = createSyncedStore<CryptoHistoryStoreState>(
  {
    channelName: "crypto-history-store-sync",
    syncKeys: ["cryptoHistories", "cryptoHistoriesFetched"],
    initKeys: ["cryptoHistoriesFetched"],
    partialStore: (set, get) => ({
      // ============================STATE============================
      cryptoHistories: [],
      cryptoHistoriesFetched: false,

      // ============================SET============================
      setStore: (store) => set(() => store),

      // ============================DELETE============================
      deleteCryptoHistory: (id) => set(storeHelpers.deleteById(id)),
      deleteMultipleCryptoHistories: (ids) =>
        set(storeHelpers.deleteMultipleByIds(ids)),
    }),
  }
);

// ============================FETCH============================

export const fetchAllCryptoHistories = async () => {
  const {
    setCryptoHistories,
    setCryptoHistoriesFetched,
    cryptoHistoriesFetched,
  } = useCryptoHistoryStore.getState();

  if (cryptoHistoriesFetched) return;

  try {
    const response = await fetch(`/api/crypto-histories`);
    const { data, success, message } = await response.json();

    if (!success) {
      toast.error("Error fetching orders");
      console.error("Error fetching orders:", message);
      setCryptoHistories([]);
    }
    setCryptoHistories(data);
  } catch (error: any) {
    console.error("Error fetching crypto histories:", error);
    toast.error(error.message);
  } finally {
    setCryptoHistoriesFetched(true);
  }
};

// ============================================================
// ======================CryptoHistoryActions==================
// ============================================================

export const {
  deleteMultipleByIds: deleteMultipleCryptoHistoriesStore,
  updateById: updateCryptoHistoryByIdStore,
  deleteById: deleteCryptoHistoryByIdStore,
} = createStoreActionHelpers<CryptoYearlyHistoryStatusType, "cryptoHistories">(
  "cryptoHistories",
  useCryptoHistoryStore.getState
);
