import {
  getTriggers,
  toogleTriggerInDatabase,
} from "@/src/app/actions/admin/triggers";
import { toast } from "sonner";
import { create } from "zustand";

import { Database } from "@/types/supabase";

export type TriggerType =
  Database["admin"]["Views"]["triggers_with_details"]["Row"] & {
    full_table_name: string;
    table_schema: string;
    function_name: string;
    function_schema: string;
    function_owner: string;
    enabled: "O" | "D";
    update_columns: string[];
  };

type TriggerStoreState = {
  triggers: TriggerType[];
  triggerFetched: boolean;
  setTriggerFetched: (bool: boolean) => void;
  setTriggers: (triggers: TriggerType[]) => void;
  setStore: (store: TriggerStoreState) => void;
};

export const useAdminTriggerStore = create<TriggerStoreState>((set, get) => ({
  triggers: [],
  triggerFetched: false,
  setTriggerFetched: (bool) => set({ triggerFetched: bool }),

  setTriggers: (triggers) => set({ triggers }),
  setStore: (store) => set(store),
}));

export const fetchTriggers = async () => {
  const { setTriggers, setTriggerFetched } = useAdminTriggerStore.getState();

  const { data: fetchedTriggers, success, message } = await getTriggers();

  if (!success) {
    console.error("Error fetching triggers:", message);
    return [];
  }

  if (Array.isArray(fetchedTriggers)) {
    setTriggers(fetchedTriggers as TriggerType[]);
    setTriggerFetched(true);
  } else {
    console.error("Fetched triggers is not an array or is undefined");
  }
};

export const toggleTriggerStatus = async (trigger: TriggerType) => {
  const { triggers } = useAdminTriggerStore.getState();

  const index = triggers.findIndex(
    (l) =>
      l.trigger_name === trigger.trigger_name &&
      l.table_schema === trigger.table_schema &&
      l.table_name === trigger.table_name
  );
  if (index !== -1) {
    triggers[index].enabled = trigger.enabled === "O" ? "D" : "O";
    useAdminTriggerStore.getState().setTriggers([...triggers]);
    const { success, message } = await toogleTriggerInDatabase(trigger);
    if (!success) {
      console.error("Error toggling trigger:", message);
      toast.error(message);
      triggers[index].enabled = trigger.enabled;
      useAdminTriggerStore.getState().setTriggers([...triggers]);
    } else {
      toast.success(
        `Trigger ${trigger.trigger_name} ${
          trigger.enabled === "O" ? "disabled" : "enabled"
        }`
      );
    }
  }
};

export const setTriggers = (triggers: TriggerType[]) => {
  useAdminTriggerStore.getState().setTriggers(triggers);
};
