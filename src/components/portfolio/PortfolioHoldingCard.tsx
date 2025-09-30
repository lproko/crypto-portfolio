"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
} from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SellFromPortfolioDialog } from "./SellFromPortfolioDialog";

interface PortfolioHoldingCardProps {
  holding: {
    coinId: string;
    symbol: string;
    name: string;
    image: string;
    quantity: number;
    averageBuyPrice: number;
    totalInvested: number;
    currentPrice: number;
    currentValue: number;
    profitLoss: number;
    profitLossPercentage: number;
    lastUpdated: string;
  };
}

export function PortfolioHoldingCard({ holding }: PortfolioHoldingCardProps) {
  const { state } = usePortfolio();
  const isPositive = holding.profitLoss >= 0;
  const portfolioPercentage =
    state.totalValue > 0 ? (holding.currentValue / state.totalValue) * 100 : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={holding.image}
              alt={holding.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{holding.name}</h3>
                <Badge variant="secondary" className="uppercase text-xs">
                  {holding.symbol}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                {formatLargeNumber(holding.quantity)}{" "}
                {holding.symbol.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(holding.currentValue)}
            </div>
            <div
              className={`text-sm ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 inline mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 inline mr-1" />
              )}
              {formatPercentage(holding.profitLossPercentage)}
            </div>
            <div className="text-xs text-gray-500">
              {formatCurrency(holding.profitLoss)} P&L
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Avg Buy Price</div>
            <div className="font-medium">
              {formatCurrency(holding.averageBuyPrice)}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Current Price</div>
            <div className="font-medium">
              {formatCurrency(holding.currentPrice)}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Total Invested</div>
            <div className="font-medium">
              {formatCurrency(holding.totalInvested)}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Portfolio %</div>
            <div className="font-medium">{portfolioPercentage.toFixed(2)}%</div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <SellFromPortfolioDialog
            coinId={holding.coinId}
            coinName={holding.name}
            coinSymbol={holding.symbol}
            currentPrice={holding.currentPrice}
            maxQuantity={holding.quantity}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Minus className="h-4 w-4 mr-2" />
                Sell
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
