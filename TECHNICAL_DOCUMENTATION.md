# Crypto Portfolio Tracker - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design Decisions](#architecture--design-decisions)
3. [Technology Stack](#technology-stack)
4. [API Integration & Rate Limiting](#api-integration--rate-limiting)
5. [State Management](#state-management)
6. [Component Architecture](#component-architecture)
7. [Performance Optimizations](#performance-optimizations)
8. [Error Handling & Resilience](#error-handling--resilience)
9. [Data Flow & Caching Strategy](#data-flow--caching-strategy)
10. [Security Considerations](#security-considerations)
11. [Testing Strategy](#testing-strategy)
12. [Deployment & DevOps](#deployment--devops)
13. [Scalability & Future Enhancements](#scalability--future-enhancements)
14. [Code Quality & Best Practices](#code-quality--best-practices)
15. [Interview Discussion Points](#interview-discussion-points)

---

## Project Overview

### Business Requirements

- **Coin Discovery**: Search and explore cryptocurrencies with real-time data
- **Portfolio Management**: Add/sell coins with transaction tracking
- **Analytics Dashboard**: Portfolio performance, P&L, and asset allocation
- **Data Persistence**: Portfolio data survives browser sessions
- **Real-time Updates**: Live price updates for portfolio valuation

### Success Metrics

- **Performance**: < 2s initial load time, < 500ms navigation
- **Reliability**: 99% uptime, graceful degradation on API failures
- **User Experience**: Intuitive interface, responsive design
- **Data Accuracy**: Real-time price updates, accurate calculations

---

## Architecture & Design Decisions

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Application   │    │   Data Layer    │
│     Layer       │    │     Layer       │    │                 │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • React Components│    │ • Custom Hooks  │    │ • CoinGecko API │
│ • UI Components  │    │ • Context API   │    │ • localStorage  │
│ • Error Boundaries│    │ • State Mgmt    │    │ • Demo Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Design Patterns Used

#### 1. **Provider Pattern**

```typescript
// Context-based state management
<QueryProvider>
  <PortfolioProvider>
    <PortfolioPriceUpdater />
    {children}
  </PortfolioProvider>
</QueryProvider>
```

**Why**: Centralized state management, dependency injection, testability

#### 2. **Custom Hooks Pattern**

```typescript
// Encapsulates data fetching logic
export const useCoinsMarkets = (page: number, perPage: number) => {
  return useQuery({
    queryKey: ["coins-markets", page, perPage],
    queryFn: () => coinGeckoAPI.getCoinsMarkets(page, perPage),
    staleTime: 10 * 60 * 1000,
  });
};
```

**Why**: Reusability, separation of concerns, testability

#### 3. **Repository Pattern**

```typescript
class CoinGeckoAPI {
  private async makeRequest<T>(url: string): Promise<T> {
    // Centralized API logic with rate limiting
  }
}
```

**Why**: Abstraction, centralized error handling, easy mocking

#### 4. **Observer Pattern**

```typescript
// Tanstack Query provides reactive data fetching
const { data, isLoading, error } = useCoinsMarkets();
```

**Why**: Reactive updates, automatic re-fetching, cache invalidation

### Architectural Trade-offs

#### **Client-Side State vs Server-Side State**

- **Choice**: Client-side with localStorage persistence
- **Trade-off**:
  - ✅ Offline capability, fast access
  - ❌ Data loss risk, no cross-device sync
- **Alternative**: Server-side with user accounts (future enhancement)

#### **Context API vs Redux**

- **Choice**: Context API with useReducer
- **Trade-off**:
  - ✅ Simpler setup, less boilerplate
  - ❌ Performance concerns with frequent updates
- **Mitigation**: Memoization, selective context splitting

#### **Component Composition vs Inheritance**

- **Choice**: Composition with render props and children
- **Trade-off**:
  - ✅ Flexibility, reusability
  - ❌ Prop drilling (mitigated with context)

---

## Technology Stack

### Frontend Framework: Next.js 14

**Why Next.js?**

- **App Router**: Modern routing with layouts and nested routes
- **SSR/SSG**: Better SEO and initial load performance
- **API Routes**: Can add backend functionality later
- **Built-in Optimizations**: Image optimization, font optimization
- **TypeScript Support**: First-class TypeScript integration

**Configuration**:

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["assets.coingecko.com"],
  },
};
```

### State Management: Tanstack Query + Context API

**Tanstack Query Benefits**:

- **Automatic Caching**: Reduces API calls
- **Background Updates**: Keeps data fresh
- **Error Handling**: Built-in retry logic
- **Loading States**: Automatic loading/error states
- **DevTools**: Excellent debugging experience

**Context API Benefits**:

- **Portfolio State**: Global portfolio management
- **Type Safety**: Full TypeScript support
- **Persistence**: localStorage integration
- **Performance**: useReducer for complex state

### UI Framework: Shadcn UI + Tailwind CSS

**Shadcn UI Benefits**:

- **Accessibility**: ARIA-compliant components
- **Customizable**: Copy-paste components
- **Modern**: Built on Radix UI primitives
- **TypeScript**: Full type safety

**Tailwind CSS Benefits**:

- **Utility-First**: Rapid development
- **Responsive**: Mobile-first design
- **Consistent**: Design system enforcement
- **Performance**: Purged unused styles

### Data Visualization: Recharts

**Why Recharts?**

- **React Native**: Built for React
- **Responsive**: Automatic responsive behavior
- **Customizable**: Extensive customization options
- **Performance**: Optimized for large datasets
- **TypeScript**: Full type support

---

## API Integration & Rate Limiting

### CoinGecko API Integration

#### **API Client Architecture**

```typescript
class CoinGeckoAPI {
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_DELAY = 1200; // 1.2 seconds
}
```

#### **Rate Limiting Strategy**

**Problem**: CoinGecko free tier has strict rate limits (10-30 calls/minute)

**Solution**: Request Queue with Delays

```typescript
private async processQueue(): Promise<void> {
  while (this.requestQueue.length > 0) {
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;

    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      await this.delay(this.RATE_LIMIT_DELAY - timeSinceLastRequest);
    }

    const request = this.requestQueue.shift();
    await request();
    this.lastRequestTime = Date.now();
  }
}
```

**Benefits**:

- ✅ Prevents 429 errors
- ✅ Maintains request order
- ✅ Automatic retry logic
- ✅ Graceful degradation

#### **Fallback Strategy**

**Demo Data Fallback**:

```typescript
if (response.status === 429) {
  console.warn("Rate limited, returning demo data...");

  if (url.includes("/coins/markets")) {
    return DEMO_COINS as T;
  }

  if (url.includes("/search")) {
    return DEMO_SEARCH_RESULT as T;
  }
}
```

**Benefits**:

- ✅ App continues functioning
- ✅ User experience maintained
- ✅ Clear indication of demo mode

#### **Caching Strategy**

**Multi-Level Caching**:

1. **Tanstack Query Cache**: 10-minute stale time
2. **Browser Cache**: HTTP caching headers
3. **Demo Data**: Fallback when rate limited

```typescript
staleTime: 10 * 60 * 1000, // 10 minutes
gcTime: 15 * 60 * 1000,    // 15 minutes
retry: 2,                  // Retry failed requests
retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 30000)
```

---

## State Management

### Portfolio State Architecture

#### **Context + useReducer Pattern**

```typescript
interface PortfolioState {
  holdings: PortfolioHolding[];
  transactions: PortfolioTransaction[];
  isLoading: boolean;
  error: string | null;
}

type PortfolioAction =
  | { type: "ADD_TO_PORTFOLIO"; payload: AddToPortfolioData }
  | { type: "SELL_FROM_PORTFOLIO"; payload: SellFromPortfolioData }
  | { type: "UPDATE_PRICES"; payload: PriceUpdate[] }
  | { type: "CLEAR_PORTFOLIO" };
```

#### **State Management Benefits**

- **Predictable**: Pure functions for state updates
- **Debuggable**: Action logging and time-travel debugging
- **Testable**: Easy to unit test reducers
- **Type Safe**: Full TypeScript coverage

#### **Persistence Strategy**

```typescript
// Save to localStorage on every state change
useEffect(() => {
  localStorage.setItem("crypto-portfolio", JSON.stringify(state));
}, [state]);
```

**Trade-offs**:

- ✅ Offline capability
- ✅ No server required
- ❌ Limited to single device
- ❌ No data backup

### Data Flow Architecture

```
User Action → Component → Context Action → Reducer → State Update → UI Re-render
     ↓
localStorage ← State Persistence
     ↓
API Call ← Price Updates ← Background Sync
```

---

## Component Architecture

### Component Hierarchy

```
App
├── QueryProvider
├── PortfolioProvider
├── PortfolioPriceUpdater
└── Home
    ├── CoinSearch
    │   └── CoinSearchResults
    ├── CoinDetails
    │   └── CoinPriceChart
    ├── PortfolioDashboard
    │   ├── PortfolioChart
    │   └── PortfolioHoldingCard
    └── CoinBrowser
```

### Component Design Principles

#### **1. Single Responsibility**

Each component has one clear purpose:

- `CoinSearch`: Handle search input and results
- `CoinDetails`: Display coin information
- `PortfolioDashboard`: Show portfolio overview

#### **2. Composition over Inheritance**

```typescript
// Flexible dialog component
<AddToPortfolioDialog
  coinId={coin.id}
  trigger={<Button>Add to Portfolio</Button>}
/>
```

#### **3. Props Interface Design**

```typescript
interface CoinDetailsProps {
  coinId: string;
  onAddToPortfolio?: (coinId: string) => void;
}
```

**Benefits**:

- Clear API contracts
- Optional callbacks for flexibility
- Type safety

#### **4. Error Boundaries**

```typescript
<ErrorBoundary>
  <CoinSearch onCoinSelect={handleCoinSelect} />
</ErrorBoundary>
```

**Benefits**:

- Graceful error handling
- Isolated error recovery
- Better user experience

### Custom Hooks Architecture

#### **Data Fetching Hooks**

```typescript
export const useCoinsMarkets = (page: number, perPage: number) => {
  return useQuery({
    queryKey: ["coins-markets", page, perPage],
    queryFn: () => coinGeckoAPI.getCoinsMarkets(page, perPage),
    staleTime: 10 * 60 * 1000,
  });
};
```

#### **Business Logic Hooks**

```typescript
export const usePortfolioPrices = () => {
  const { state, updatePrices } = usePortfolio();
  const coinIds = state.holdings.map((holding) => holding.coinId);

  const { data: coinsData } = useCoinsMarkets(1, 250);

  useEffect(() => {
    if (coinsData && coinIds.length > 0) {
      const priceUpdates = coinIds
        .map((coinId) => {
          const coin = coinsData.find((c) => c.id === coinId);
          return coin ? { coinId, currentPrice: coin.current_price } : null;
        })
        .filter(Boolean);

      updatePrices(priceUpdates);
    }
  }, [coinsData, coinIds, updatePrices]);
};
```

---

## Performance Optimizations

### React Performance Optimizations

#### **1. Memoization**

```typescript
// Prevent unnecessary re-renders
const MemoizedCoinCard = React.memo(CoinCard);

// Expensive calculations
const totalValue = useMemo(() => {
  return holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
}, [holdings]);
```

#### **2. Callback Optimization**

```typescript
// Prevent function recreation on every render
const handleCoinSelect = useCallback((coinId: string) => {
  setSelectedCoinId(coinId);
  setActiveTab("market");
}, []);
```

#### **3. Lazy Loading**

```typescript
// Code splitting for better initial load
const CoinBrowser = lazy(() => import("./CoinBrowser"));
```

### Data Fetching Optimizations

#### **1. Query Key Optimization**

```typescript
// Granular cache keys for better cache hits
queryKey: ["coins-markets", page, perPage, vsCurrency];
```

#### **2. Stale Time Configuration**

```typescript
// Reduce unnecessary API calls
staleTime: 10 * 60 * 1000, // 10 minutes
```

#### **3. Background Updates**

```typescript
// Keep data fresh without blocking UI
refetchOnWindowFocus: true,
refetchInterval: 5 * 60 * 1000, // 5 minutes
```

### Bundle Optimization

#### **1. Tree Shaking**

- ES modules for better tree shaking
- Barrel exports avoided
- Unused code elimination

#### **2. Code Splitting**

```typescript
// Route-based code splitting
const PortfolioDashboard = lazy(() => import("./PortfolioDashboard"));
```

#### **3. Image Optimization**

```typescript
// Next.js automatic image optimization
<Image
  src={coin.image}
  alt={coin.name}
  width={64}
  height={64}
  priority={false}
/>
```

---

## Error Handling & Resilience

### Error Boundary Implementation

#### **Class Component Error Boundary**

```typescript
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
}
```

#### **Error Recovery Strategy**

```typescript
resetError = () => {
  this.setState({ hasError: false, error: undefined });
};
```

### API Error Handling

#### **Retry Logic**

```typescript
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
};
```

#### **Exponential Backoff**

```typescript
retryDelay: (attemptIndex, error) => {
  if (error instanceof Error && error.message.includes("429")) {
    return Math.min(1000 * 2 ** attemptIndex * 5, 30000);
  }
  return Math.min(1000 * 2 ** attemptIndex, 30000);
};
```

### Graceful Degradation

#### **Demo Data Fallback**

- When API is rate limited, show demo data
- Clear indication to users about demo mode
- App continues functioning normally

#### **Loading States**

```typescript
if (isLoading) {
  return <LoadingSpinner text="Loading coins..." />;
}

if (error) {
  return <ErrorMessage error={error} />;
}
```

---

## Data Flow & Caching Strategy

### Data Flow Architecture

```
User Interaction
       ↓
Component Event Handler
       ↓
Context Action Dispatch
       ↓
Reducer State Update
       ↓
Component Re-render
       ↓
localStorage Persistence
```

### Caching Layers

#### **1. Tanstack Query Cache**

- **Purpose**: API response caching
- **Duration**: 10 minutes stale time
- **Strategy**: Stale-while-revalidate
- **Benefits**: Reduced API calls, better UX

#### **2. Browser Cache**

- **Purpose**: Static asset caching
- **Strategy**: HTTP cache headers
- **Benefits**: Faster subsequent loads

#### **3. localStorage**

- **Purpose**: Portfolio data persistence
- **Strategy**: Write-through cache
- **Benefits**: Offline capability

### Cache Invalidation Strategy

#### **Time-based Invalidation**

```typescript
staleTime: 10 * 60 * 1000, // Data considered fresh for 10 minutes
gcTime: 15 * 60 * 1000,   // Cache garbage collected after 15 minutes
```

#### **Manual Invalidation**

```typescript
// Invalidate specific queries
queryClient.invalidateQueries(["coins-markets"]);
```

---

## Security Considerations

### Client-Side Security

#### **1. Input Validation**

```typescript
// Validate user inputs
const validateQuantity = (quantity: string): boolean => {
  const num = parseFloat(quantity);
  return !isNaN(num) && num > 0 && num <= 1000000;
};
```

#### **2. XSS Prevention**

- React's built-in XSS protection
- No `dangerouslySetInnerHTML` usage
- Proper escaping of user inputs

#### **3. Data Sanitization**

```typescript
// Sanitize API responses
const sanitizeCoinData = (coin: any): Coin => {
  return {
    id: String(coin.id || ""),
    name: String(coin.name || ""),
    symbol: String(coin.symbol || "").toLowerCase(),
    current_price: Number(coin.current_price) || 0,
    // ... other fields
  };
};
```

### API Security

#### **1. Rate Limiting**

- Client-side rate limiting
- Request queuing
- Graceful degradation

#### **2. Error Information**

- Generic error messages to users
- Detailed errors only in development
- No sensitive data exposure

### Data Privacy

#### **1. Local Storage**

- Only portfolio data stored locally
- No sensitive user information
- Clear data on logout

#### **2. API Data**

- No personal data sent to APIs
- Only public cryptocurrency data
- No authentication required

---

## Testing Strategy

### Testing Pyramid

#### **1. Unit Tests**

```typescript
// Test individual functions
describe("formatCurrency", () => {
  it("should format currency correctly", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });
});

// Test reducers
describe("portfolioReducer", () => {
  it("should add coin to portfolio", () => {
    const state = { holdings: [], transactions: [] };
    const action = { type: "ADD_TO_PORTFOLIO", payload: mockData };
    const newState = portfolioReducer(state, action);
    expect(newState.holdings).toHaveLength(1);
  });
});
```

#### **2. Integration Tests**

```typescript
// Test component interactions
describe('PortfolioDashboard', () => {
  it('should display portfolio value correctly', () => {
    render(
      <PortfolioProvider>
        <PortfolioDashboard />
      </PortfolioProvider>
    );

    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });
});
```

#### **3. End-to-End Tests**

```typescript
// Test user workflows
describe("Portfolio Management", () => {
  it("should allow adding coins to portfolio", () => {
    cy.visit("/");
    cy.get('[data-testid="search-input"]').type("bitcoin");
    cy.get('[data-testid="coin-result"]').first().click();
    cy.get('[data-testid="add-to-portfolio"]').click();
    cy.get('[data-testid="quantity-input"]').type("0.1");
    cy.get('[data-testid="confirm-add"]').click();
    cy.get('[data-testid="portfolio-total"]').should("contain", "$4,500");
  });
});
```

### Testing Tools

#### **1. Jest + React Testing Library**

- Unit and integration tests
- Component testing
- Mocking capabilities

#### **2. Cypress**

- End-to-end testing
- User interaction testing
- Visual regression testing

#### **3. MSW (Mock Service Worker)**

- API mocking
- Network request testing
- Offline testing

---

## Deployment & DevOps

### Build Process

#### **1. Next.js Build**

```bash
npm run build
# Generates optimized production build
# Static assets optimization
# Bundle analysis
```

#### **2. Type Checking**

```bash
npm run type-check
# TypeScript compilation check
# Type safety validation
```

#### **3. Linting**

```bash
npm run lint
# ESLint code quality checks
# Prettier formatting
```

### Deployment Options

#### **1. Vercel (Recommended)**

```yaml
# vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
}
```

**Benefits**:

- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Preview deployments

#### **2. Netlify**

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### **3. Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### CI/CD Pipeline

#### **GitHub Actions**

```yaml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## Scalability & Future Enhancements

### Current Limitations

#### **1. Single Device**

- Portfolio data only on one device
- No cloud synchronization
- No backup/recovery

#### **2. API Rate Limits**

- Limited to CoinGecko free tier
- Demo data fallback required
- No real-time updates

#### **3. No User Authentication**

- No user accounts
- No data privacy
- No sharing capabilities

### Scalability Improvements

#### **1. Backend Integration**

```typescript
// Future API structure
interface UserAPI {
  authenticate(email: string, password: string): Promise<User>;
  getPortfolio(userId: string): Promise<Portfolio>;
  updatePortfolio(userId: string, portfolio: Portfolio): Promise<void>;
  syncPrices(): Promise<PriceUpdate[]>;
}
```

#### **2. Real-time Updates**

```typescript
// WebSocket integration
const useRealTimePrices = () => {
  const [prices, setPrices] = useState<PriceUpdate[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://api.example.com/prices");
    ws.onmessage = (event) => {
      const priceUpdate = JSON.parse(event.data);
      setPrices((prev) => [...prev, priceUpdate]);
    };

    return () => ws.close();
  }, []);

  return prices;
};
```

#### **3. Database Integration**

```sql
-- Portfolio schema
CREATE TABLE portfolios (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE holdings (
  id UUID PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id),
  coin_id VARCHAR(50) NOT NULL,
  quantity DECIMAL(20, 8) NOT NULL,
  average_price DECIMAL(20, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Performance Scaling

#### **1. Virtual Scrolling**

```typescript
// For large coin lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedCoinList = ({ coins }: { coins: Coin[] }) => (
  <List
    height={600}
    itemCount={coins.length}
    itemSize={80}
    itemData={coins}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <CoinCard coin={data[index]} />
      </div>
    )}
  </List>
);
```

#### **2. Service Worker**

```typescript
// Offline capability
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/coins")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

#### **3. Code Splitting**

```typescript
// Route-based splitting
const PortfolioDashboard = lazy(() => import("./PortfolioDashboard"));
const CoinBrowser = lazy(() => import("./CoinBrowser"));
const MarketAnalysis = lazy(() => import("./MarketAnalysis"));
```

---

## Code Quality & Best Practices

### TypeScript Best Practices

#### **1. Strict Type Checking**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

#### **2. Interface Design**

```typescript
// Clear, focused interfaces
interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  // ... other properties
}

// Extending interfaces
interface CoinWithPrice extends Coin {
  price_change_24h: number;
  price_change_percentage_24h: number;
}
```

#### **3. Generic Types**

```typescript
// Reusable generic types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Usage
type CoinsResponse = ApiResponse<Coin[]>;
type CoinResponse = ApiResponse<Coin>;
```

### Code Organization

#### **1. Feature-Based Structure**

```
src/
├── features/
│   ├── coins/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── portfolio/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── types/
│   └── shared/
│       ├── components/
│       ├── hooks/
│       └── utils/
```

#### **2. Barrel Exports**

```typescript
// features/coins/index.ts
export { CoinSearch } from "./components/CoinSearch";
export { CoinDetails } from "./components/CoinDetails";
export { useCoinsMarkets } from "./hooks/useCoins";
export type { Coin } from "./types/coin";
```

### Documentation Standards

#### **1. JSDoc Comments**

```typescript
/**
 * Formats a number as currency with proper locale formatting
 * @param value - The numeric value to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, 'EUR') // "€1,234.56"
 */
export function formatCurrency(
  value: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
```

#### **2. README Documentation**

- Clear setup instructions
- API documentation
- Architecture overview
- Contributing guidelines

---

## Interview Discussion Points

### Technical Architecture Questions

#### **Q: Why did you choose Next.js over other React frameworks?**

**A**: Next.js provides several advantages:

- **App Router**: Modern routing with layouts and nested routes
- **SSR/SSG**: Better SEO and initial load performance
- **Built-in Optimizations**: Image optimization, font optimization
- **API Routes**: Can add backend functionality later
- **TypeScript Support**: First-class TypeScript integration
- **Deployment**: Easy deployment to Vercel

#### **Q: How do you handle state management in this application?**

**A**: I use a hybrid approach:

- **Tanstack Query**: For server state (API data) with caching, background updates, and error handling
- **Context API + useReducer**: For client state (portfolio data) with localStorage persistence
- **Local State**: For component-specific state (form inputs, UI state)

**Benefits**:

- Clear separation of concerns
- Automatic caching and synchronization
- Type-safe state management
- Easy testing and debugging

#### **Q: How do you handle API rate limiting?**

**A**: I implemented a comprehensive rate limiting strategy:

- **Request Queue**: Serializes API requests with 1.2-second delays
- **Retry Logic**: Exponential backoff for failed requests
- **Fallback Data**: Demo data when rate limited
- **Caching**: 10-minute cache to reduce API calls
- **User Feedback**: Clear indication of demo mode

#### **Q: What are the performance optimizations you implemented?**

**A**: Multiple layers of optimization:

- **React**: Memoization, useCallback, useMemo, lazy loading
- **Data Fetching**: Query caching, stale-while-revalidate, background updates
- **Bundle**: Code splitting, tree shaking, image optimization
- **UI**: Virtual scrolling for large lists, debounced search

#### **Q: How do you ensure code quality and maintainability?**

**A**: Several practices:

- **TypeScript**: Strict type checking, interface design, generic types
- **Testing**: Unit tests, integration tests, E2E tests
- **Linting**: ESLint, Prettier, pre-commit hooks
- **Documentation**: JSDoc comments, README, architecture docs
- **Code Organization**: Feature-based structure, barrel exports

### System Design Questions

#### **Q: How would you scale this application to handle millions of users?**

**A**: Several scaling strategies:

- **Backend**: Move to microservices architecture with user authentication
- **Database**: PostgreSQL with read replicas, Redis for caching
- **CDN**: Global content delivery for static assets
- **Real-time**: WebSocket connections for live price updates
- **Monitoring**: Application performance monitoring, error tracking
- **Caching**: Multi-level caching (browser, CDN, application, database)

#### **Q: How would you implement real-time price updates?**

**A**: Multiple approaches:

- **WebSockets**: Direct connection to price feed
- **Server-Sent Events**: One-way communication from server
- **Polling**: Regular API calls with exponential backoff
- **Hybrid**: WebSocket for active users, polling for inactive

#### **Q: How do you handle data consistency in a distributed system?**

**A**: Several strategies:

- **Event Sourcing**: Store events instead of state
- **CQRS**: Separate read and write models
- **Sagas**: Distributed transaction management
- **Eventual Consistency**: Accept temporary inconsistencies
- **Conflict Resolution**: Last-write-wins or user resolution

### Problem-Solving Questions

#### **Q: How would you debug a performance issue in production?**

**A**: Systematic debugging approach:

1. **Monitoring**: Check APM tools for bottlenecks
2. **Profiling**: Use React DevTools Profiler
3. **Bundle Analysis**: Analyze bundle size and dependencies
4. **Network**: Check API response times and caching
5. **Database**: Analyze query performance
6. **User Feedback**: Check error reports and user complaints

#### **Q: How do you handle security vulnerabilities?**

**A**: Multi-layered security approach:

- **Input Validation**: Sanitize all user inputs
- **XSS Prevention**: React's built-in protection, no dangerous HTML
- **CSRF Protection**: SameSite cookies, CSRF tokens
- **Rate Limiting**: Prevent abuse and DoS attacks
- **Dependency Scanning**: Regular security audits
- **HTTPS**: Encrypt all communications

#### **Q: How do you ensure accessibility compliance?**

**A**: Comprehensive accessibility strategy:

- **Semantic HTML**: Proper HTML structure and ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA attributes and descriptions
- **Color Contrast**: WCAG AA compliance
- **Testing**: Automated accessibility testing
- **User Testing**: Real user accessibility testing

### Trade-off Questions

#### **Q: What are the trade-offs of using localStorage vs a database?**

**A**:
**localStorage Benefits**:

- ✅ No server required
- ✅ Offline capability
- ✅ Fast access
- ✅ Simple implementation

**localStorage Drawbacks**:

- ❌ Single device only
- ❌ No data backup
- ❌ Limited storage (5-10MB)
- ❌ No sharing capabilities

**Database Benefits**:

- ✅ Multi-device sync
- ✅ Data backup
- ✅ Unlimited storage
- ✅ Sharing capabilities

**Database Drawbacks**:

- ❌ Requires server
- ❌ Network dependency
- ❌ Complex implementation
- ❌ Cost and maintenance

#### **Q: What are the trade-offs of client-side vs server-side rendering?**

**A**:
**Client-side Benefits**:

- ✅ Rich interactivity
- ✅ Reduced server load
- ✅ Better user experience
- ✅ Offline capability

**Client-side Drawbacks**:

- ❌ Slower initial load
- ❌ SEO challenges
- ❌ JavaScript dependency
- ❌ Security concerns

**Server-side Benefits**:

- ✅ Faster initial load
- ✅ Better SEO
- ✅ Works without JavaScript
- ✅ More secure

**Server-side Drawbacks**:

- ❌ Limited interactivity
- ❌ Higher server load
- ❌ Slower navigation
- ❌ Complex state management

This comprehensive documentation covers all aspects that could be discussed in a technical interview, from high-level architecture decisions to specific implementation details, trade-offs, and future considerations.

