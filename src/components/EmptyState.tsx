"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, TrendingUp } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardContent className="p-8 text-center">
        <div className="mb-4">
          {icon || <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {action && (
          <Button
            onClick={action.onClick}
            className="flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{action.label}</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Portfolio empty state
export function PortfolioEmptyState({ onAddCoin }: { onAddCoin: () => void }) {
  return (
    <EmptyState
      icon={<TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />}
      title="No Holdings Yet"
      description="Start building your portfolio by adding some cryptocurrencies."
      action={{
        label: "Add Your First Coin",
        onClick: onAddCoin,
      }}
    />
  );
}

// Search empty state
export function SearchEmptyState() {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12 text-gray-400 mx-auto" />}
      title="No Results Found"
      description="Try searching for a different cryptocurrency or check your spelling."
    />
  );
}


