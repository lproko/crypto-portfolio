# Crypto Portfolio Tracker

A modern, responsive cryptocurrency portfolio tracking application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Coin Discovery

- **Search Functionality**: Real-time search with debounced input
- **Detailed Coin Information**: Comprehensive market data and statistics
- **Price Charts**: Interactive 7-day price history using Recharts
- **Market Browser**: Paginated view of all available cryptocurrencies

### Portfolio Management

- **Add/Sell Coins**: Easy portfolio management with buy/sell transactions
- **Real-time Updates**: Live price updates for portfolio valuation
- **Local Storage**: Persistent portfolio data across sessions
- **Transaction History**: Complete audit trail of all transactions

### Analytics & Dashboard

- **Portfolio Overview**: Total value, invested amount, and P&L
- **Asset Allocation**: Visual pie chart showing portfolio distribution
- **Individual Holdings**: Detailed view of each coin's performance
- **Profit/Loss Tracking**: Real-time P&L calculations

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: React Context + useReducer
- **Data Fetching**: Tanstack Query for caching and synchronization
- **Charts**: Recharts for data visualization
- **API**: CoinGecko API for cryptocurrency data

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd crypto-portfolio-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Shadcn UI components**

   ```bash
   npx shadcn@latest add card badge button input tabs
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main application page
├── components/             # React components
│   ├── coins/             # Coin-related components
│   ├── portfolio/         # Portfolio management components
│   ├── charts/            # Chart components
│   ├── providers/         # Context providers
│   └── ui/                # Shadcn UI components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and API
└── types/                 # TypeScript type definitions
```

## 🔧 Key Components

### API Integration

- **CoinGeckoAPI**: Centralized API client with error handling
- **Custom Hooks**: Reusable hooks for data fetching with caching
- **Type Safety**: Full TypeScript coverage for API responses

### State Management

- **PortfolioContext**: Global portfolio state with localStorage persistence
- **Tanstack Query**: Efficient data fetching with automatic caching
- **Error Boundaries**: Graceful error handling throughout the app

### UI Components

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA-compliant components from Shadcn UI
- **Loading States**: Comprehensive loading and error states

## 🎯 Usage

1. **Search for Coins**: Use the search bar to find cryptocurrencies
2. **View Market Data**: Click on coins to see detailed information and charts
3. **Build Portfolio**: Add coins to your portfolio with specified quantities
4. **Track Performance**: Monitor your portfolio's value and P&L
5. **Browse Market**: Explore all available cryptocurrencies with pagination

## 🔒 Data Persistence

- Portfolio data is automatically saved to localStorage
- Real-time price updates refresh every minute
- Transaction history is maintained for audit purposes

## 🚀 Deployment

The application is ready for deployment on platforms like:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **AWS Amplify**

## 📱 Responsive Design

- **Mobile**: Optimized for mobile devices with touch-friendly interfaces
- **Tablet**: Adaptive layout for medium-sized screens
- **Desktop**: Full-featured experience with hover states and animations

## 🧪 Testing

The application includes:

- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during data fetching
- **Input Validation**: Form validation and error messages
- **Type Safety**: Full TypeScript coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **CoinGecko**: For providing the cryptocurrency API
- **Shadcn UI**: For the beautiful component library
- **Tanstack**: For the excellent React Query library
- **Recharts**: For the charting capabilities
