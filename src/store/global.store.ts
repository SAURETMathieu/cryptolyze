import { create } from "zustand";
import { GlobalStoreState } from "@/types/stores";

export const useGlobalStore = create<GlobalStoreState>((set, get) => ({
  countries: [],
  lastUpdated: null,
  countriesCodes: [],
  addresses: [],
  paymentMethods: [],
  currentForm: null,
  userInfosLoaded: false,
  setStore: (store) => set(store),
}));

export const fetchCountries = async () => {
  const { lastUpdated } = useGlobalStore.getState();

  const cacheDuration = 5 * 60 * 1000; // 5 minutes en millisecondes
  const now = Date.now();

  if (!lastUpdated || now - lastUpdated > cacheDuration) {
    try {
      const response = await fetch("/api/countries");

      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }

      const data = await response.json();

      if (data.isSuccess) {
        useGlobalStore.setState({
          lastUpdated: now,
        });
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }
};

export const initUserInfos = async () => {
  useGlobalStore.setState({
    userInfosLoaded: true,
  });
};

export const resetGlobalStore = () => {
  useGlobalStore.setState({
    lastUpdated: null,
    userInfosLoaded: false,
  });
};

export const setCurrentForm = (form: any) => {
  const { currentForm } = useGlobalStore.getState();

  if (form === null) {
    useGlobalStore.setState({ currentForm: [] });
    return;
  }

  const newForm = {
    defaultValues: form.control._defaultValues,
    fields: form.control._formValues,
    errors: form.formState.errors,
  };

  useGlobalStore.setState({
    currentForm: currentForm
      ? currentForm.some(
          (f) =>
            JSON.stringify(f.defaultValues) ===
            JSON.stringify(newForm.defaultValues)
        )
        ? currentForm.map((f) =>
            JSON.stringify(f.defaultValues) ===
            JSON.stringify(newForm.defaultValues)
              ? newForm
              : f
          )
        : [...currentForm, newForm]
      : [newForm],
  });
};
