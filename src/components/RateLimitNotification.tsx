"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Clock } from "lucide-react";

interface RateLimitNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export function RateLimitNotification({
  isVisible,
  onDismiss,
}: RateLimitNotificationProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <Card className="fixed top-4 right-4 z-50 max-w-sm border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-orange-800">API Rate Limit</h4>
            <p className="text-sm text-orange-700 mt-1">
              Too many requests to CoinGecko API. Please wait a moment before
              trying again.
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-600">
                Auto-dismiss in {countdown}s
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-orange-600 hover:text-orange-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook to manage rate limit notifications
export function useRateLimitNotification() {
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = () => {
    setIsVisible(true);
  };

  const hideNotification = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    showNotification,
    hideNotification,
  };
}


