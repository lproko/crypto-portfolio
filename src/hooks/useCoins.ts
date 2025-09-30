import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { coinGeckoAPI } from "@/lib/api";
import { Coin, CoinSearchResult, CoinMarketChart } from "@/types/coin";

export const useCoinsMarkets = (
  page: number = 1,
  perPage: number = 50,
  vsCurrency: string = "usd"
): UseQueryResult<Coin[], Error> => {
  return useQuery({
    queryKey: ["coins-markets", page, perPage, vsCurrency],
    queryFn: () => coinGeckoAPI.getCoinsMarkets(page, perPage, vsCurrency),
    staleTime: 10 * 60 * 1000, // 10 minutes - longer cache for market data
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 30000),
  });
};

export const useSearchCoins = (
  query: string,
  enabled: boolean = true
): UseQueryResult<CoinSearchResult, Error> => {
  return useQuery({
    queryKey: ["search-coins", query],
    queryFn: () => coinGeckoAPI.searchCoins(query),
    enabled: enabled && query.length > 2, // Only search after 3 characters to reduce API calls
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once for search
  });
};

export const useCoinMarketChart = (
  coinId: string,
  days: number = 7,
  vsCurrency: string = "usd"
): UseQueryResult<CoinMarketChart, Error> => {
  return useQuery({
    queryKey: ["coin-market-chart", coinId, days, vsCurrency],
    queryFn: () => coinGeckoAPI.getCoinMarketChart(coinId, days, vsCurrency),
    enabled: !!coinId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCoinDetails = (coinId: string): UseQueryResult<Coin, Error> => {
  return useQuery({
    queryKey: ["coin-details", coinId],
    queryFn: () => coinGeckoAPI.getCoinDetails(coinId),
    enabled: !!coinId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};
