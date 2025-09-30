"use client";

import { usePortfolioPrices } from "@/hooks/usePortfolioPrices";

export function PortfolioPriceUpdater() {
  usePortfolioPrices();
  return null;
}
