import { create } from "zustand";

interface SidebarStore {
  isMinimized: boolean;
  toggle: () => void;
  isFixed: boolean;
  toggleFixed: () => void;
}

export const useAdminSidebar = create<SidebarStore>((set) => ({
  isMinimized: false,
  isFixed: true,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
  toggleFixed: () =>
    set((state) => ({
      isFixed: !state.isFixed,
      isMinimized: !state.isMinimized,
    })),
}));
