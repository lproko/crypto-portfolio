import {
  Coin,
  CoinMarketChart,
  CoinSearchResult,
  ApiError,
} from "@/types/coin";
import { DEMO_COINS, DEMO_SEARCH_RESULT } from "./demoData";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

class CoinGeckoAPI {
  private baseURL: string;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_DELAY = 1200; // 1.2 seconds between requests for free tier

  constructor(baseURL: string = COINGECKO_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
        await this.delay(this.RATE_LIMIT_DELAY - timeSinceLastRequest);
      }

      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
          this.lastRequestTime = Date.now();
        } catch (error) {
          console.error("Request failed:", error);
        }
      }
    }

    this.isProcessing = false;
  }

  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.makeRequest<T>(url);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async makeRequest<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        // Rate limited - return demo data instead of failing
        console.warn("Rate limited, returning demo data...");

        if (url.includes("/coins/markets")) {
          return DEMO_COINS as T;
        }

        if (url.includes("/search")) {
          return DEMO_SEARCH_RESULT as T;
        }

        throw new Error("Rate limited. Please wait a moment and try again.");
      }

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw new Error("Unknown API error occurred");
    }
  }

  // Get top coins by market cap
  async getCoinsMarkets(
    page: number = 1,
    perPage: number = 50,
    vsCurrency: string = "usd"
  ): Promise<Coin[]> {
    const url = `${this.baseURL}/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`;
    return this.fetchWithErrorHandling<Coin[]>(url);
  }

  // Search for coins
  async searchCoins(query: string): Promise<CoinSearchResult> {
    const url = `${this.baseURL}/search?query=${encodeURIComponent(query)}`;
    return this.fetchWithErrorHandling<CoinSearchResult>(url);
  }

  // Get coin market chart data
  async getCoinMarketChart(
    coinId: string,
    days: number = 7,
    vsCurrency: string = "usd"
  ): Promise<CoinMarketChart> {
    const url = `${this.baseURL}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}&interval=daily`;
    return this.fetchWithErrorHandling<CoinMarketChart>(url);
  }

  // Get specific coin details
  async getCoinDetails(coinId: string): Promise<Coin> {
    const url = `${this.baseURL}/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=24h`;
    const coins = await this.fetchWithErrorHandling<Coin[]>(url);

    if (coins.length === 0) {
      throw new Error(`Coin with id ${coinId} not found`);
    }

    return coins[0];
  }
}

export const coinGeckoAPI = new CoinGeckoAPI();
