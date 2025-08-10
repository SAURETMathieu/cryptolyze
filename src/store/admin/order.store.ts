import { createSyncedStore } from "@/src/lib/zustand/createSyncedStore";
import { createStoreActionHelpers } from "@/src/lib/zustand/storeActionHelpers";
import { createStoreHelpers } from "@/src/lib/zustand/storeHelpers";
import { toast } from "sonner";

const storeHelpers = createStoreHelpers<
  NonNullable<any>,
  "orders"
>("orders");

export const useOrderStore = createSyncedStore<any>({
  channelName: "admin-order-store-sync",
  syncKeys: [
    "orders",
    "ordersFetched",
    "isFetching",
    "ordersCount",
    "ordersByStatus",
    "ordersByStatusFetched",
    "currentOrder",
    "currentOrderFetched",
  ],
  initKeys: ["ordersFetched", "ordersByStatusFetched", "currentOrderFetched"],
  partialStore: (set, get) => ({
    // ============================STATE============================
    orders: [],
    ordersByStatus: [],
    currentOrder: null,
    ordersCount: 0,
    isFetching: false,
    ordersFetched: false,
    ordersByStatusFetched: false,
    currentOrderFetched: false,

    // ============================SET============================
    setStore: (store: any) => set(() => store),

    // ============================DELETE============================
    deleteOrder: (id: any) => set(storeHelpers.deleteById(id)),
    deleteMultipleOrders: (ids: any) => set(storeHelpers.deleteMultipleByIds(ids)),
  }),
});

// ============================FETCH============================

export const fetchAllOrders = async () => {
  const { setOrders, setOrdersFetched } = useOrderStore.getState();

  const {
    data: fetchedOrders,
    success,
    message,
  } = await fetch(
    `/api/admin/orders?filterFlag=advancedFilters&revalidate=0&page=1&perPage=10000&sort=%5B%7B%22id%22%3A%22date%22%2C%22desc%22%3Atrue%7D%5D&country=%5B%5D&source=%5B%5D&status=%5B%5D&customer=&date=%5B%5D&filters=%5B%7B%22id%22%3A%22date%22%2C%22value%22%3A%5B%221738364400000%22%2C%221748728800000%22%5D%2C%22variant%22%3A%22dateRange%22%2C%22operator%22%3A%22isBetween%22%2C%22filterId%22%3A%22YKlNsydj%22%7D%5D&joinOperator=and`,
  ).then((res) => res.json());

  if (!success) {
    toast.error("Error fetching orders");
    console.error("Error fetching orders:", message);
    return [];
  }

  if (Array.isArray(fetchedOrders)) {
    setOrders(fetchedOrders as NonNullable<any>[]);
    setOrdersFetched(true);
  } else {
    console.error("Fetched orders is not an array or is undefined");
  }
};

// ============================================================
// ======================OrderByStatusActions==================
// ============================================================

export const {
  deleteMultipleByIds: deleteMultipleOrderByStatus,
  updateById: updateOrderByStatusById,
} = createStoreActionHelpers<NonNullable<any>, "ordersByStatus">(
  "ordersByStatus",
  useOrderStore.getState,
);
