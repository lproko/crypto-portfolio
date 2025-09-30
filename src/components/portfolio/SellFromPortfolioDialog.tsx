"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatCurrency } from "@/lib/utils";
import { Minus } from "lucide-react";

interface SellFromPortfolioDialogProps {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  currentPrice: number;
  maxQuantity: number;
  trigger?: React.ReactNode;
}

export function SellFromPortfolioDialog({
  coinId,
  coinName,
  coinSymbol,
  currentPrice,
  maxQuantity,
  trigger,
}: SellFromPortfolioDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(currentPrice.toString());
  const { sellFromPortfolio } = usePortfolio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);

    if (quantityNum > 0 && quantityNum <= maxQuantity && priceNum > 0) {
      sellFromPortfolio({
        coinId,
        quantity: quantityNum,
        price: priceNum,
      });

      setIsOpen(false);
      setQuantity("");
      setPrice(currentPrice.toString());
    }
  };

  const totalAmount = parseFloat(quantity) * parseFloat(price) || 0;
  const isValidQuantity =
    parseFloat(quantity) > 0 && parseFloat(quantity) <= maxQuantity;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Minus className="h-4 w-4 mr-2" />
            <span>Sell</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sell {coinName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">{coinName}</div>
              <div className="text-sm text-gray-500 uppercase">
                {coinSymbol}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Sell</Label>
            <Input
              id="quantity"
              type="number"
              step="0.00000001"
              min="0"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00000000"
              required
            />
            <div className="text-xs text-gray-500">
              Max: {maxQuantity.toFixed(8)} {coinSymbol.toUpperCase()}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Sell Price per {coinSymbol.toUpperCase()}
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Amount</div>
            <div className="text-lg font-semibold text-red-600">
              {formatCurrency(totalAmount)}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !quantity || !price || !isValidQuantity || totalAmount <= 0
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Sell
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
