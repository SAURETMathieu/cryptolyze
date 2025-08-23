export function getCryptoHistoryCompleteness(
  priceHistory: Record<string, string>
) {
  const entries = Object.entries(priceHistory);
  const totalYears = entries.length;
  const completeYears = entries.filter(
    ([_, status]) => status === "complete"
  ).length;
  return (completeYears / totalYears) * 100;
}
