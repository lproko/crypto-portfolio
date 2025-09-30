"use client";

import { useState, useEffect, useRef } from "react";
import { CoinSearch } from "@/components/coins/CoinSearch";
import { CoinDetails } from "@/components/coins/CoinDetails";
import { PortfolioDashboard } from "@/components/portfolio/PortfolioDashboard";
import { CoinBrowser } from "@/components/coins/CoinBrowser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { User, Settings, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "portfolio" | "market" | "browser"
  >("portfolio");
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const handleCoinSelect = (coinId: string) => {
    setSelectedCoinId(coinId);
    setActiveTab("market");
  };

  // Close avatar menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target as Node)
      ) {
        setIsAvatarMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTabChange = (tab: "portfolio" | "market" | "browser") => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 md:space-x-8">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  Cryptory
                </h1>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                  <button
                    onClick={() => handleTabChange("portfolio")}
                    className={`text-sm font-medium transition-colors ${
                      activeTab === "portfolio"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => handleTabChange("market")}
                    className={`text-sm font-medium transition-colors ${
                      activeTab === "market"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Market
                  </button>
                  <button
                    onClick={() => handleTabChange("browser")}
                    className={`text-sm font-medium transition-colors ${
                      activeTab === "browser"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Browse All
                  </button>
                </nav>
              </div>

              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Language and Currency - Hidden on mobile */}
                <div className="hidden sm:flex items-center space-x-2">
                  <select className="bg-background border border-border rounded px-2 py-1 text-xs">
                    <option>ENG</option>
                  </select>
                  <select className="bg-background border border-border rounded px-2 py-1 text-xs">
                    <option>USD</option>
                  </select>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-foreground" />
                  ) : (
                    <Menu className="w-5 h-5 text-foreground" />
                  )}
                </button>

                {/* Avatar Menu */}
                <div className="relative" ref={avatarMenuRef}>
                  <button
                    onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                    className="flex items-center space-x-1 md:space-x-2 p-1 md:p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                    </div>
                    <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground hidden sm:block" />
                  </button>

                  {isAvatarMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-border">
                        <div className="text-sm font-medium text-foreground">
                          {user?.name || "User"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user?.email || "user@example.com"}
                        </div>
                      </div>
                      <div className="py-1">
                        <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={logout}
                          className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-border">
                <nav className="flex flex-col space-y-2 pt-4">
                  <button
                    onClick={() => handleTabChange("portfolio")}
                    className={`text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "portfolio"
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => handleTabChange("market")}
                    className={`text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "market"
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Market
                  </button>
                  <button
                    onClick={() => handleTabChange("browser")}
                    className={`text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "browser"
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Browse All
                  </button>
                </nav>

                {/* Mobile Language and Currency */}
                <div className="flex items-center space-x-2 pt-4 border-t border-border mt-4">
                  <select className="bg-background border border-border rounded px-3 py-2 text-sm flex-1">
                    <option>English (ENG)</option>
                  </select>
                  <select className="bg-background border border-border rounded px-3 py-2 text-sm flex-1">
                    <option>USD ($)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <DemoModeBanner />
            <ErrorBoundary>
              <CoinSearch onCoinSelect={handleCoinSelect} />
            </ErrorBoundary>
          </div>

          {/* Tab Content */}
          <ErrorBoundary>
            {activeTab === "portfolio" && <PortfolioDashboard />}
          </ErrorBoundary>

          <ErrorBoundary>
            {activeTab === "market" &&
              (selectedCoinId ? (
                <CoinDetails coinId={selectedCoinId} />
              ) : (
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle>Market Explorer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Search for a cryptocurrency above to view detailed
                      information and add it to your portfolio.
                    </p>
                  </CardContent>
                </Card>
              ))}
          </ErrorBoundary>

          <ErrorBoundary>
            {activeTab === "browser" && <CoinBrowser />}
          </ErrorBoundary>
        </div>
      </div>
    </ProtectedRoute>
  );
}
