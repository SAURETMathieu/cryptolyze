"use client";

import * as React from "react";
import {
  flagConfig,
  type FlagConfig,
} from "@/src/components/advanced-tables/config/flag";
import { useQueryState } from "nuqs";

type FilterFlag = FlagConfig["featureFlags"][number]["value"];

interface FeatureFlagsContextValue {
  filterFlag: FilterFlag;
  enableAdvancedFilter: boolean;
  setFilterFlag: (value: FilterFlag) => void;
  onFilterFlagChange: (value: FilterFlag) => void;
}

const FeatureFlagsContext =
  React.createContext<FeatureFlagsContextValue | null>(null);

export function useFeatureFlags() {
  const context = React.useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagsProvider"
    );
  }
  return context;
}

interface FeatureFlagsProviderProps {
  children: React.ReactNode;
}

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const [filterFlag, setFilterFlag] = useQueryState<FilterFlag | null>(
    "filterFlag",
    {
      parse: (value) => {
        if (!value) return null;
        const validValues = flagConfig.featureFlags.map((flag) => flag.value);
        return validValues.includes(value as FilterFlag)
          ? (value as FilterFlag)
          : null;
      },
      serialize: (value) => value ?? "",
      defaultValue: null,
      clearOnDefault: true,
      shallow: false,
      eq: (a, b) => (!a && !b) || a === b,
    }
  );

  const onFilterFlagChange = React.useCallback(
    (value: FilterFlag) => {
      setFilterFlag(value);
    },
    [setFilterFlag]
  );

  const contextValue = React.useMemo<FeatureFlagsContextValue>(
    () => ({
      filterFlag,
      enableAdvancedFilter:
        filterFlag === "advancedFilters" || filterFlag === "commandFilters",
      setFilterFlag,
      onFilterFlagChange,
    }),
    [filterFlag, setFilterFlag, onFilterFlagChange]
  );

  return (
    <FeatureFlagsContext.Provider value={contextValue}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
