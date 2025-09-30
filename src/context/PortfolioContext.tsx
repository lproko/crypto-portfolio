"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import {
  PortfolioState,
  PortfolioHolding,
  PortfolioTransaction,
  AddToPortfolioData,
  SellFromPortfolioData,
} from "@/types/portfolio";

// Action types
type PortfolioAction =
  | { type: "ADD_HOLDING"; payload: AddToPortfolioData }
  | { type: "SELL_HOLDING"; payload: SellFromPortfolioData }
  | {
      type: "UPDATE_PRICES";
      payload: { coinId: string; currentPrice: number }[];
    }
  | { type: "LOAD_PORTFOLIO"; payload: PortfolioState }
  | { type: "CLEAR_PORTFOLIO" };

// Initial state
const initialState: PortfolioState = {
  holdings: [],
  transactions: [],
  totalValue: 0,
  totalInvested: 0,
  totalProfitLoss: 0,
  totalProfitLossPercentage: 0,
};

// Portfolio reducer
function portfolioReducer(
  state: PortfolioState,
  action: PortfolioAction
): PortfolioState {
  switch (action.type) {
    case "ADD_HOLDING": {
      const { coinId, symbol, name, image, quantity, price } = action.payload;
      const totalAmount = quantity * price;

      // Check if holding already exists
      const existingHolding = state.holdings.find((h) => h.coinId === coinId);

      let newHoldings: PortfolioHolding[];
      let newTransactions: PortfolioTransaction[] = [...state.transactions];

      if (existingHolding) {
        // Update existing holding
        const newQuantity = existingHolding.quantity + quantity;
        const newTotalInvested = existingHolding.totalInvested + totalAmount;
        const newAveragePrice = newTotalInvested / newQuantity;

        newHoldings = state.holdings.map((h) =>
          h.coinId === coinId
            ? {
                ...h,
                quantity: newQuantity,
                averageBuyPrice: newAveragePrice,
                totalInvested: newTotalInvested,
                currentValue: newQuantity * h.currentPrice,
                profitLoss: newQuantity * h.currentPrice - newTotalInvested,
                profitLossPercentage:
                  ((newQuantity * h.currentPrice - newTotalInvested) /
                    newTotalInvested) *
                  100,
                lastUpdated: new Date().toISOString(),
              }
            : h
        );
      } else {
        // Add new holding
        const newHolding: PortfolioHolding = {
          coinId,
          symbol,
          name,
          image,
          quantity,
          averageBuyPrice: price,
          totalInvested: totalAmount,
          currentPrice: price,
          currentValue: totalAmount,
          profitLoss: 0,
          profitLossPercentage: 0,
          lastUpdated: new Date().toISOString(),
        };

        newHoldings = [...state.holdings, newHolding];
      }

      // Add transaction
      const transaction: PortfolioTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        coinId,
        type: "buy",
        quantity,
        price,
        totalAmount,
        timestamp: new Date().toISOString(),
      };

      newTransactions.push(transaction);

      return calculatePortfolioTotals({
        ...state,
        holdings: newHoldings,
        transactions: newTransactions,
      });
    }

    case "SELL_HOLDING": {
      const { coinId, quantity, price } = action.payload;
      const totalAmount = quantity * price;

      const existingHolding = state.holdings.find((h) => h.coinId === coinId);
      if (!existingHolding || existingHolding.quantity < quantity) {
        return state; // Cannot sell more than owned
      }

      const newQuantity = existingHolding.quantity - quantity;
      const soldInvestedAmount =
        (quantity / existingHolding.quantity) * existingHolding.totalInvested;
      const remainingInvestedAmount =
        existingHolding.totalInvested - soldInvestedAmount;

      let newHoldings: PortfolioHolding[];

      if (newQuantity === 0) {
        // Remove holding completely
        newHoldings = state.holdings.filter((h) => h.coinId !== coinId);
      } else {
        // Update holding
        newHoldings = state.holdings.map((h) =>
          h.coinId === coinId
            ? {
                ...h,
                quantity: newQuantity,
                totalInvested: remainingInvestedAmount,
                averageBuyPrice: remainingInvestedAmount / newQuantity,
                currentValue: newQuantity * h.currentPrice,
                profitLoss:
                  newQuantity * h.currentPrice - remainingInvestedAmount,
                profitLossPercentage:
                  ((newQuantity * h.currentPrice - remainingInvestedAmount) /
                    remainingInvestedAmount) *
                  100,
                lastUpdated: new Date().toISOString(),
              }
            : h
        );
      }

      // Add sell transaction
      const transaction: PortfolioTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        coinId,
        type: "sell",
        quantity,
        price,
        totalAmount,
        timestamp: new Date().toISOString(),
      };

      const newTransactions = [...state.transactions, transaction];

      return calculatePortfolioTotals({
        ...state,
        holdings: newHoldings,
        transactions: newTransactions,
      });
    }

    case "UPDATE_PRICES": {
      const priceUpdates = action.payload;

      const newHoldings = state.holdings.map((holding) => {
        const priceUpdate = priceUpdates.find(
          (pu) => pu.coinId === holding.coinId
        );
        if (!priceUpdate) return holding;

        const currentValue = holding.quantity * priceUpdate.currentPrice;
        const profitLoss = currentValue - holding.totalInvested;
        const profitLossPercentage =
          holding.totalInvested > 0
            ? (profitLoss / holding.totalInvested) * 100
            : 0;

        return {
          ...holding,
          currentPrice: priceUpdate.currentPrice,
          currentValue,
          profitLoss,
          profitLossPercentage,
          lastUpdated: new Date().toISOString(),
        };
      });

      return calculatePortfolioTotals({
        ...state,
        holdings: newHoldings,
      });
    }

    case "LOAD_PORTFOLIO":
      return action.payload;

    case "CLEAR_PORTFOLIO":
      return initialState;

    default:
      return state;
  }
}

// Helper function to calculate portfolio totals
function calculatePortfolioTotals(state: PortfolioState): PortfolioState {
  const totalValue = state.holdings.reduce(
    (sum, holding) => sum + holding.currentValue,
    0
  );
  const totalInvested = state.holdings.reduce(
    (sum, holding) => sum + holding.totalInvested,
    0
  );
  const totalProfitLoss = totalValue - totalInvested;
  const totalProfitLossPercentage =
    totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return {
    ...state,
    totalValue,
    totalInvested,
    totalProfitLoss,
    totalProfitLossPercentage,
  };
}

// Context type
interface PortfolioContextType {
  state: PortfolioState;
  addToPortfolio: (data: AddToPortfolioData) => void;
  sellFromPortfolio: (data: SellFromPortfolioData) => void;
  updatePrices: (updates: { coinId: string; currentPrice: number }[]) => void;
  clearPortfolio: () => void;
}

// Create context
const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);

// Provider component
export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  // Load portfolio from localStorage on mount
  useEffect(() => {
    try {
      const savedPortfolio = localStorage.getItem("crypto-portfolio");
      if (savedPortfolio) {
        const parsedPortfolio = JSON.parse(savedPortfolio);
        dispatch({ type: "LOAD_PORTFOLIO", payload: parsedPortfolio });
      }
    } catch (error) {
      console.error("Error loading portfolio from localStorage:", error);
    }
  }, []);

  // Save portfolio to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem("crypto-portfolio", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving portfolio to localStorage:", error);
    }
  }, [state]);

  const addToPortfolio = useCallback((data: AddToPortfolioData) => {
    dispatch({ type: "ADD_HOLDING", payload: data });
  }, []);

  const sellFromPortfolio = useCallback((data: SellFromPortfolioData) => {
    dispatch({ type: "SELL_HOLDING", payload: data });
  }, []);

  const updatePrices = useCallback(
    (updates: { coinId: string; currentPrice: number }[]) => {
      dispatch({ type: "UPDATE_PRICES", payload: updates });
    },
    []
  );

  const clearPortfolio = useCallback(() => {
    dispatch({ type: "CLEAR_PORTFOLIO" });
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        state,
        addToPortfolio,
        sellFromPortfolio,
        updatePrices,
        clearPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

// Custom hook to use portfolio context
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
