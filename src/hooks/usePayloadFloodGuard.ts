import { useRef } from "react";

export function usePayloadFloodGuard<T>({
  maxPayloads = 10,
  timeWindowMs = 5000,
  floodDelayMs = 3000,
  onFlood,
  onBatchProcess,
}: {
  maxPayloads?: number;
  timeWindowMs?: number;
  floodDelayMs?: number;
  onFlood: () => void | Promise<void>;
  onBatchProcess: (payloads: T[]) => void | Promise<void>;
}) {
  const payloadBuffer = useRef<T[]>([]);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const floodTriggered = useRef(false);

  const handlePayload = async (payload: T) => {
    payloadBuffer.current.push(payload);

    if (!timer.current) {
      timer.current = setTimeout(async () => {
        const batch = [...payloadBuffer.current];
        payloadBuffer.current = [];
        timer.current = null;

        if (floodTriggered.current || batch.length > maxPayloads) {
          floodTriggered.current = true;
          setTimeout(async () => {
            await onFlood();
            floodTriggered.current = false;
          }, floodDelayMs);
        } else {
          const promiseFns = batch.map((p) => () => onBatchProcess([p]));
          await Promise.all(promiseFns.map((fn) => fn()));
        }
      }, timeWindowMs);
    }
  };

  return {
    handlePayload,
  };
}
