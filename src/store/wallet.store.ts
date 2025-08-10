import { create } from "zustand";

export const useWalletsStore = create((set: any) => ({
  wallets: [] as any[],
  balanceTotal: 0,
  balanceOfAllWallets: [] as any[],
  profitsTotal: 0,
  devise: "USD",
  fetchWallets: async (token: string) => {
    try {
      useWalletsStore.getState().calcBalanceTotal();
      useWalletsStore.getState().calcBalanceOfAllWallets();
      useWalletsStore.getState().calcProfitsTotal();
      set({ wallets: [] });
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  },
  resetWallets: () => set({ wallets: [] }),
  initializeWallets: (wallets: any) => set({ wallets }),
  calcBalanceTotal: () => {
    const wallets = useWalletsStore.getState().wallets;
    const balanceTotal = wallets.reduce(
      (acc: number, wallet: any) => acc + wallet.balance,
      0
    );
    set({ balanceTotal });
  },
  calcBalanceOfAllWallets: () => {
    const wallets = useWalletsStore.getState().wallets;
    const balanceOfAllWallets = wallets.map((wallet: any) => ({
      id: wallet.id,
      balance: wallet.balance,
    }));
    set({ balanceOfAllWallets });
  },
  calcProfitsTotal: () => {
    const wallets = useWalletsStore.getState().wallets;
    const profitsTotal = wallets.reduce(
      (acc: number, wallet: any) => acc + wallet.profits,
      0
    );
    set({ profitsTotal });
  },
  setDevise: (devise: string) => set({ devise }),
}));

export const addWallet = (wallet: any) => {
  const wallets = useWalletsStore.getState().wallets;
  useWalletsStore.setState({ wallets: [...wallets, wallet[0]] });
  useWalletsStore.getState().calcBalanceTotal();
  useWalletsStore.getState().calcBalanceOfAllWallets();
  useWalletsStore.getState().calcProfitsTotal();
};

export const updateWallet = (updatedWallet: any) => {
  const wallets = useWalletsStore.getState().wallets;
  useWalletsStore.setState({
    wallets: wallets.map((wallet: any) =>
      wallet.id === updatedWallet.id
        ? { ...wallet, name: updatedWallet.name }
        : wallet
    ),
  });
};

export const deleteWallet = (id: number) => {
  const wallets = useWalletsStore.getState().wallets;
  useWalletsStore.setState({
    wallets: wallets.filter((wallet: any) => wallet.id !== id),
  });
  useWalletsStore.getState().calcBalanceTotal();
  useWalletsStore.getState().calcBalanceOfAllWallets();
  useWalletsStore.getState().calcProfitsTotal();
};

export default useWalletsStore;
