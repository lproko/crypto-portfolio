"use client";

import { CoinSearchResult } from "@/types/coin";

interface CoinSearchResultsProps {
  results: CoinSearchResult;
  onCoinSelect: (coinId: string) => void;
}

export function CoinSearchResults({
  results,
  onCoinSelect,
}: CoinSearchResultsProps) {
  if (!results.coins || results.coins.length === 0) {
    return null;
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {results.coins.map((coin) => (
        <button
          key={coin.id}
          onClick={() => onCoinSelect(coin.id)}
          className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <img
              src={coin.thumb}
              alt={coin.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {coin.name}
              </div>
              <div className="text-sm text-gray-500 uppercase">
                {coin.symbol}
              </div>
            </div>
            <div className="text-sm text-gray-400">
              #{coin.market_cap_rank || "N/A"}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
