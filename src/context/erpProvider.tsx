"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { useAuth } from "./userProvider";

interface ItemNumbersInterface {
  [key: string]: number;
}

interface ErpContextInterface {
  itemNumbers: ItemNumbersInterface;
}

const ErpContext = createContext<ErpContextInterface | undefined>(undefined);

interface ErpProviderProps {
  children: ReactNode;
}

export const ErpProvider = ({ children }: ErpProviderProps) => {
  const { profile } = useAuth();

  const [itemNumbers, setItemNumbers] = useState<ItemNumbersInterface>({
    "/admin/hub/deals": 0,
  });

  return (
    <ErpContext.Provider value={{ itemNumbers }}>
      {children}
    </ErpContext.Provider>
  );
};

export const useErp = () => {
  const context = useContext(ErpContext);
  if (context === undefined) {
    throw new Error("useErp must be used within an ErpProvider");
  }
  return context;
};
