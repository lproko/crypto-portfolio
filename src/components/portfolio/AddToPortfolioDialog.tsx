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
import { Plus } from "lucide-react";

interface AddToPortfolioDialogProps {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  currentPrice: number;
  trigger?: React.ReactNode;
}

export function AddToPortfolioDialog({
  coinId,
  coinName,
  coinSymbol,
  coinImage,
  currentPrice,
  trigger,
}: AddToPortfolioDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(currentPrice.toString());
  const { addToPortfolio } = usePortfolio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);

    if (quantityNum > 0 && priceNum > 0) {
      addToPortfolio({
        coinId,
        symbol: coinSymbol,
        name: coinName,
        image: coinImage,
        quantity: quantityNum,
        price: priceNum,
      });

      setIsOpen(false);
      setQuantity("");
      setPrice(currentPrice.toString());
    }
  };

  const totalAmount = parseFloat(quantity) * parseFloat(price) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add to Portfolio</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {coinName} to Portfolio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={coinImage}
              alt={coinName}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-medium">{coinName}</div>
              <div className="text-sm text-gray-500 uppercase">
                {coinSymbol}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="0.00000001"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00000000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price per {coinSymbol.toUpperCase()}</Label>
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

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Amount</div>
            <div className="text-lg font-semibold text-blue-600">
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
              disabled={!quantity || !price || totalAmount <= 0}
            >
              Add to Portfolio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
