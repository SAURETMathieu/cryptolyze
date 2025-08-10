type StatusEntry = { status: string | null; timestamp: string | null };

/**
 * Gets the latest unique valid statuses from a list of status entries.
 * Optionally filters the statuses based on the provided status order.
 *
 * @param {Array<{ status: string | null; timestamp: string | null }>} statuses - The array of status entries, each containing a status and a timestamp.
 * @param {string[] | undefined} [statusOrder] - An optional array of statuses in the preferred order. If provided, only statuses up to and including the last status in the array will be included.
 * @returns {Record<string, string | null>} A record of the latest valid statuses with the status as the key and the timestamp as the value.
 * If `statusOrder` is provided, only statuses in the order up to the last valid one will be included.
 *
 * @example
 * const statuses = [
 *   { status: "payment", timestamp: "2025-03-17T14:00:00Z" },
 *   { status: "authentification", timestamp: "2025-03-17T12:00:00Z" },
 *   { status: "pending", timestamp: "2025-03-17T10:00:00Z" },
 *   { status: "payment", timestamp: "2025-03-17T15:00:00Z" },
 *   { status: "authentification", timestamp: "2025-03-17T11:00:00Z" },
 * ];
 * const statusOrder = ["pending", "authentification", "payment"];
 *
 * const result = getLatestUniqueValidStatuses(statuses, statusOrder);
 * console.log(result);
 * // {
 * //   pending: "2025-03-17T10:00:00Z",
 * //   authentification: "2025-03-17T12:00:00Z",
 * //   payment: "2025-03-17T15:00:00Z",
 * // }
 */

export function getLatestUniqueValidStatuses(
  statuses: StatusEntry[],
  statusOrder?: string[]
): Record<string, string | null> {
  if (statuses.length === 0) return {};
  const latestStatusMap: Record<string, string | null> = {};

  statuses?.forEach(({ status, timestamp }) => {
    if (status && timestamp) {
      latestStatusMap[status] = timestamp;
    }
  });

  if (!statusOrder) {
    return latestStatusMap;
  }

  const lastStatus = statuses[statuses.length - 1].status;
  if (!lastStatus) return latestStatusMap;

  const lastStatusIndex = statusOrder.indexOf(lastStatus);
  if (lastStatusIndex === -1) return latestStatusMap;

  return Object.fromEntries(
    Object.entries(latestStatusMap).filter(([key]) => {
      const index = statusOrder.indexOf(key);
      return index !== -1 && index <= lastStatusIndex;
    })
  );
}
