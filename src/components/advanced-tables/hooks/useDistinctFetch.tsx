"use client";

import { useEffect, useState } from "react";

export function useDistinctFetch<T>(promise: Promise<T[]>) {
  const [values, setValues] = useState<T[]>([]);
  useEffect(() => {
    promise.then(setValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return values;
}
