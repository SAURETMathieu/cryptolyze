"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useDataFetch<T>(
  promise: Promise<{
    data: T[];
    count: number;
    success: boolean;
    message: string;
  }>,
  onSuccess?: (data: T[]) => void
) {
  const [data, setData] = useState<T[]>([]);
  const [count, setCount] = useState(0);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    promise.then((res) => {
      if (!res.success) {
        toast.error(res.message, { duration: 5000 });
      } else {
        setData(res.data);
        onSuccess?.(res.data);
        setCount(res.count);
      }
      setIsFetching(false);
    });
  }, [promise, onSuccess]);

  return { data, count, isFetching };
}
