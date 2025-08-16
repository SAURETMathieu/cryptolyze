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
