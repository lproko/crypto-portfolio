import { useEffect, useMemo, useRef } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { useCoinsMarkets } from "./useCoins";

export function usePortfolioPrices() {
  const { state, updatePrices } = usePortfolio();
  const lastUpdateRef = useRef<string>("");

  // Memoize coinIds to prevent unnecessary re-renders
  const coinIds = useMemo(
    () => state.holdings.map((holding) => holding.coinId),
    [state.holdings]
  );

  const { data: coinsData, isLoading } = useCoinsMarkets(1, 250);

  // Memoize the price updates to prevent unnecessary dispatches
  const priceUpdates = useMemo(() => {
    if (!coinsData || coinIds.length === 0) return [];

    return coinIds
      .map((coinId) => {
        const coin = coinsData.find((c) => c.id === coinId);
        return coin ? { coinId, currentPrice: coin.current_price } : null;
      })
      .filter(Boolean) as { coinId: string; currentPrice: number }[];
  }, [coinsData, coinIds]);

  useEffect(() => {
    if (priceUpdates.length === 0) return;

    // Create a unique key for this price update to prevent duplicate updates
    const updateKey = priceUpdates
      .map((update) => `${update.coinId}:${update.currentPrice}`)
      .sort()
      .join("|");

    // Only update if the prices have actually changed
    if (updateKey !== lastUpdateRef.current) {
      lastUpdateRef.current = updateKey;
      updatePrices(priceUpdates);
    }
  }, [priceUpdates, updatePrices]);

  return { isLoading };
}
