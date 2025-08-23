export const aggregateBalances = (wallets:any[]) => {
  if (!Array.isArray(wallets) || wallets.length === 0 || wallets.some(item => item == null)) {
    return [];
  }
  const balanceMap = new Map();

  wallets?.forEach((wallet: any) => {
    wallet.balances?.forEach((balance: any) => {
      const { symbol, nbToken, price } = balance;
      if (balanceMap.has(symbol)) {
        balanceMap.set(symbol, balanceMap.get(symbol) + nbToken * price);
      } else {
        balanceMap.set(symbol, nbToken * price);
      }
    });
  });

  const datas = Array.from(balanceMap).map(([symbol, value]) => ({
    name: symbol,
    value: parseFloat(value.toFixed(2)),
  }));

  datas.sort((a, b) => b.value - a.value);

  if (datas.length > 5) {
    const others = datas.slice(4);
    const othersValue = others.reduce((acc, cur) => acc + cur.value, 0);
    datas.splice(4, datas.length - 4, { name: "Others", value: parseFloat(othersValue.toFixed(2)) });
  }

  return datas;
};