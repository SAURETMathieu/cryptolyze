export function getCryptoHistoryCompleteness(priceHistory: Record<string, boolean>) {
  const entries = Object.entries(priceHistory);
  const totalYears = entries.length;
  const completeYears = entries.filter(([_, isComplete]) => isComplete).length;
  return (completeYears / totalYears) * 100;
}
