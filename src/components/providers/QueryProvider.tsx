"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - longer to reduce API calls
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors except 429
              if (
                error instanceof Error &&
                error.message.includes("4") &&
                !error.message.includes("429")
              ) {
                return false;
              }
              // Retry 429 errors up to 2 times
              if (error instanceof Error && error.message.includes("429")) {
                return failureCount < 2;
              }
              return failureCount < 3;
            },
            retryDelay: (attemptIndex, error) => {
              // Longer delay for 429 errors
              if (error instanceof Error && error.message.includes("429")) {
                return Math.min(1000 * 2 ** attemptIndex * 5, 30000); // 5s, 10s, 20s, max 30s
              }
              return Math.min(1000 * 2 ** attemptIndex, 30000);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
