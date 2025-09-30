"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCoinDetails } from "@/hooks/useCoins";
import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
} from "@/lib/utils";
import { TrendingUp, TrendingDown, Plus, Minus } from "lucide-react";
import { CoinPriceChart } from "../charts/CoinPriceChart";

interface CoinDetailsProps {
  coinId: string;
  onAddToPortfolio?: (coinId: string) => void;
}

export function CoinDetails({ coinId, onAddToPortfolio }: CoinDetailsProps) {
  const { data: coin, isLoading, error } = useCoinDetails(coinId);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !coin) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading coin details: {error?.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositiveChange = coin.price_change_percentage_24h >= 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
              />
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold">
                  {coin.name}
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mt-1">
                  <Badge variant="secondary" className="uppercase w-fit">
                    {coin.symbol}
                  </Badge>
                  <Badge variant="outline" className="w-fit">
                    Rank #{coin.market_cap_rank}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold">
                {formatCurrency(coin.current_price)}
              </div>
              <div
                className={`flex items-center space-x-1 ${
                  isPositiveChange ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositiveChange ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {formatPercentage(coin.price_change_percentage_24h)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Chart (7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <CoinPriceChart coinId={coinId} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Market Cap
            </div>
            <div className="text-base sm:text-lg font-semibold">
              {formatCurrency(coin.market_cap)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Volume (24h)
            </div>
            <div className="text-base sm:text-lg font-semibold">
              {formatCurrency(coin.total_volume)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Circulating Supply
            </div>
            <div className="text-base sm:text-lg font-semibold">
              {formatLargeNumber(coin.circulating_supply)}{" "}
              {coin.symbol.toUpperCase()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              All Time High
            </div>
            <div className="text-base sm:text-lg font-semibold">
              {formatCurrency(coin.ath)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {formatPercentage(coin.ath_change_percentage)} from ATH
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              All Time Low
            </div>
            <div className="text-base sm:text-lg font-semibold">
              {formatCurrency(coin.atl)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {formatPercentage(coin.atl_change_percentage)} from ATL
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              24h High/Low
            </div>
            <div className="text-base sm:text-lg font-semibold">
              {formatCurrency(coin.high_24h)} / {formatCurrency(coin.low_24h)}
            </div>
          </CardContent>
        </Card>
      </div>

      {onAddToPortfolio && (
        <div className="flex justify-center">
          <Button
            onClick={() => onAddToPortfolio(coinId)}
            className="flex items-center space-x-2 w-full sm:w-auto"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            <span>Add to Portfolio</span>
          </Button>
        </div>
      )}
    </div>
  );
}
