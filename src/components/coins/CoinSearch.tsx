"use client";

import { useState, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchCoins } from "@/hooks/useCoins";
import { debounce } from "@/lib/utils";
import { CoinSearchResult } from "@/types/coin";
import { CoinSearchResults } from "./CoinSearchResults";

interface CoinSearchProps {
  onCoinSelect?: (coinId: string) => void;
}

export function CoinSearch({ onCoinSelect }: CoinSearchProps) {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setShowResults(value.length >= 3);
    }, 300),
    []
  );

  const handleInputChange = (value: string) => {
    setQuery(value);
    debouncedSearch(value);
  };

  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchCoins(searchQuery, searchQuery.length >= 3);

  const handleCoinSelect = (coinId: string) => {
    setQuery("");
    setSearchQuery("");
    setShowResults(false);
    if (onCoinSelect) {
      onCoinSelect(coinId);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for cryptocurrencies (min 3 characters)..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
          onFocus={() => setShowResults(query.length >= 3)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {error && (
              <div className="p-4 text-center text-red-500">
                Error searching coins: {error.message}
              </div>
            )}

            {searchResults?.coins && searchResults.coins.length > 0 ? (
              <CoinSearchResults
                results={searchResults}
                onCoinSelect={handleCoinSelect}
              />
            ) : searchQuery && !isLoading ? (
              <div className="p-4 text-center text-gray-500">
                No coins found for "{searchQuery}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
