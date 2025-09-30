"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Trash2,
  PieChart,
  Minus,
} from "lucide-react";
import { PortfolioHoldingCard } from "./PortfolioHoldingCard";
import { PortfolioChart } from "./PortfolioChart";
import { SellFromPortfolioDialog } from "./SellFromPortfolioDialog";

export function PortfolioDashboard() {
  const { state, clearPortfolio } = usePortfolio();

  if (state.holdings.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Portfolio Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Holdings Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start building your portfolio by adding cryptocurrencies from the
              search above.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositiveTotal = state.totalProfitLoss >= 0;

  return (
    <div className="space-y-8">
      {/* Current Balance Section */}
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Current Balance</div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-foreground">
            {formatCurrency(state.totalValue)}
          </div>
          <div className="text-lg text-muted-foreground">
            ≈ {formatCurrency(state.totalValue)}
          </div>
          <div
            className={`text-lg font-medium ${
              isPositiveTotal ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositiveTotal ? (
              <TrendingUp className="h-5 w-5 inline mr-1" />
            ) : (
              <TrendingDown className="h-5 w-5 inline mr-1" />
            )}
            {formatPercentage(state.totalProfitLossPercentage)}
          </div>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">
              Main Portfolio
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatCurrency(state.totalValue)}
            </div>
            <div className="text-sm text-muted-foreground">
              ≈ {formatCurrency(state.totalValue)}
            </div>
            <div
              className={`text-sm font-medium mt-2 ${
                isPositiveTotal ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatPercentage(state.totalProfitLossPercentage)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">24h Change</div>
            <div
              className={`text-2xl font-bold ${
                isPositiveTotal ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(state.totalProfitLoss)}
            </div>
            <div className="text-sm text-muted-foreground">24h</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-2">
              Total Holdings
            </div>
            <div className="text-2xl font-bold text-foreground">
              {state.holdings.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {state.transactions.length} transactions
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioChart holdings={state.holdings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Value</span>
              <span className="font-medium">
                {formatCurrency(state.totalValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Invested</span>
              <span className="font-medium">
                {formatCurrency(state.totalInvested)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total P&L</span>
              <span
                className={`font-medium ${isPositiveTotal ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(state.totalProfitLoss)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Holdings</span>
              <span className="font-medium">{state.holdings.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Assets Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Assets</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearPortfolio}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Portfolio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    24H
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Holdings
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Avg. Buy Price
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Profit/Loss
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.holdings.map((holding) => (
                  <tr
                    key={holding.coinId}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={holding.image}
                          alt={holding.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-foreground">
                            {holding.name}
                          </div>
                          <div className="text-sm text-muted-foreground uppercase">
                            {holding.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-medium text-foreground">
                        {formatCurrency(holding.currentPrice)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div
                        className={`text-sm font-medium ${
                          holding.profitLossPercentage >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {holding.profitLossPercentage >= 0 ? "+" : ""}
                        {formatPercentage(holding.profitLossPercentage)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-medium text-foreground">
                        {formatCurrency(holding.currentValue)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {holding.quantity.toFixed(4)}{" "}
                        {holding.symbol.toUpperCase()}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-medium text-foreground">
                        {formatCurrency(holding.averageBuyPrice)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div
                        className={`font-medium ${
                          holding.profitLoss >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {holding.profitLoss >= 0 ? "+" : ""}
                        {formatCurrency(holding.profitLoss)}
                      </div>
                      <div
                        className={`text-sm ${
                          holding.profitLossPercentage >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {holding.profitLossPercentage >= 0 ? "+" : ""}
                        {formatPercentage(holding.profitLossPercentage)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
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
                            <Minus className="h-4 w-4 mr-1" />
                            Sell
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
