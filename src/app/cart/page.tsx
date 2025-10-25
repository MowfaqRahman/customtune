"use client";

import {
  PlusIcon,
  MinusIcon,
  Trash2Icon,
  LockIcon,
  ShoppingCartIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useCart } from "@/context/CartContext";


export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  
  const subtotal = getTotalPrice();
  const deliveryFee = 15;
  const total = subtotal + deliveryFee;

  return (
    <>
      {/* Breadcrumb */}
      <div className="px-[100px] py-4">
        <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-black hover:text-gray-600">
              Home
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-400">Cart</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-[100px] py-8">
        <div className="grid grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Left Column - Cart Items */}
          <div className="col-span-2">
            <h1 className="text-[32px] font-bold text-black mb-8 tracking-[0] uppercase">
              Your Cart
            </h1>

            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some products to get started!</p>
                  <Link href="/">
                    <Button className="bg-black text-white px-6 py-3 rounded-lg">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                <Card key={item.id} className="bg-white border border-gray-200 rounded-[10px] shadow-none">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-[120px] h-[120px] bg-gray-100 rounded-[10px] flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-[80px] h-[80px] object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-black text-lg mb-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                          Category: {item.category}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-semibold text-black text-lg">
                            ${item.price}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls and Delete */}
                      <div className="flex flex-col items-end gap-3">
                        <button 
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2Icon className="w-5 h-5" />
                        </button>
                        
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                          <button 
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button 
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="col-span-1">
            <Card className="bg-gray-50 border border-gray-200 rounded-[10px] shadow-none sticky top-8">
              <CardContent className="p-6">
                <h2 className="font-bold text-black text-xl mb-6 tracking-[0] uppercase">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-black font-semibold">${subtotal}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Delivery Fee</span>
                    <span className="text-black font-semibold">${deliveryFee}</span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-bold text-lg">Total</span>
                    <span className="text-black font-bold text-lg">${total}</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="space-y-3 mb-6">
                  <Input
                    placeholder="Add promo code"
                    className="bg-white border-gray-200 rounded-[10px] h-12"
                  />
                  <Button className="w-full bg-black text-white rounded-[10px] hover:bg-black/90 h-12 font-medium">
                    Apply
                  </Button>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <Button className="w-full bg-black text-white rounded-[10px] hover:bg-black/90 h-14 text-lg font-medium flex items-center gap-2">
                    <LockIcon className="w-5 h-5" />
                    Go to Checkout →
                  </Button>
                </Link>

                {/* Note */}
                <p className="text-gray-500 text-xs mt-4 text-center">
                  Tax Included, SHIPPING and discounts calculated at checkout.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </>
  );
};
