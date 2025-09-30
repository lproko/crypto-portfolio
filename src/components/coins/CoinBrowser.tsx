"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCoinsMarkets } from "@/hooks/useCoins";
import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
} from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { AddToPortfolioDialog } from "@/components/portfolio/AddToPortfolioDialog";

export function CoinBrowser() {
  const [page, setPage] = useState(1);
  const { data: coins, isLoading, error } = useCoinsMarkets(page, 20);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading coins: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coins || coins.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">No coins found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {coins.map((coin) => {
              const isPositive = coin.price_change_percentage_24h >= 0;
              return (
                <div
                  key={coin.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-3 sm:space-y-0"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <h3 className="font-semibold text-foreground truncate">
                          {coin.name}
                        </h3>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Badge
                            variant="secondary"
                            className="uppercase text-xs"
                          >
                            {coin.symbol}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            #{coin.market_cap_rank}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Market Cap: {formatCurrency(coin.market_cap)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end space-x-4 sm:space-x-0 sm:space-y-1">
                    <div className="text-left sm:text-right">
                      <div className="text-base sm:text-lg font-semibold text-foreground">
                        {formatCurrency(coin.current_price)}
                      </div>
                      <div
                        className={`text-xs sm:text-sm ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3 inline mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 inline mr-1" />
                        )}
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Vol: {formatLargeNumber(coin.total_volume)}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <AddToPortfolioDialog
                        coinId={coin.id}
                        coinName={coin.name}
                        coinSymbol={coin.symbol}
                        coinImage={coin.image}
                        currentPrice={coin.current_price}
                        trigger={
                          <Button
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <Plus className="h-3 w-3" />
                            <span className="hidden sm:inline">Add</span>
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-3 sm:space-y-0">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="flex items-center space-x-2 w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="text-sm text-muted-foreground">Page {page}</div>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!coins || coins.length < 20}
              className="flex items-center space-x-2 w-full sm:w-auto"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
