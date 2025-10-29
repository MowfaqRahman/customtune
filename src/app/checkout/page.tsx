"use client";

import {
  SearchIcon,
  ChevronDownIcon,
  ClockIcon,
  CreditCardIcon,
  ShieldIcon,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useCart } from "../../context/CartContext";
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Image from "next/image";
import { useSession } from "../../components/supabase/SessionProvider";

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const { session } = useSession();
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    pinCode: "",
    phone: "",
    paymentMethod: "razorpay",
    billingAddress: "same"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const subtotal = getTotalPrice();
  const shipping = 100;
  const total = subtotal + shipping;

  const handleTestOrder = async () => {
    try {
      if (!session) {
        alert("You must be logged in to place an order.");
        router.push('/login');
        return;
      }

      // Explicitly check for user profile before placing the order
      const { data: profileCheck, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id);

      if (profileCheckError) {
        console.error("Error checking user profile before order placement:", profileCheckError);
        alert("Failed to check user profile. Please try again.");
        return;
      }

      if (!profileCheck || profileCheck.length === 0) {
        alert("User profile not found. Please ensure your profile exists or re-register.");
        router.push('/signup'); // Suggest re-registering if profile is missing
        return;
      }

      if (cartItems.length === 0) {
        alert("Your cart is empty. Add items before placing an order.");
        return;
      }

      // 1. Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          total_amount: total,
          status: 'confirmed',
          order_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Add order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.id, // Assuming item.id is the product_id
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      // 3. Clear the cart
      clearCart();

      alert("Test Order Placed Successfully!");
      router.push('/orders'); // Redirect to user's orders page

    } catch (error: unknown) {
      console.error("Error placing test order:", error);
      alert(`Failed to place test order: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-[100px] py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
          
          {/* Left Column - Customer Information */}
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Contact Section */}
            <div className="bg-white border border-gray-200 rounded-[10px] p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base sm:text-lg font-bold text-black">Contact</h2>
                <Link href="#" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700">
                  Sign in
                </Link>
              </div>
              <Input
                name="email"
                placeholder="Email or mobile phone number"
                value={formData.email}
                onChange={handleInputChange}
                className="border-yellow-400 focus:border-yellow-500 bg-gray-50 rounded-[8px] h-10 sm:h-12 text-sm"
              />
              <div className="mt-3 flex items-center">
                <input type="checkbox" defaultChecked className="rounded mr-2" />
                <label className="text-xs sm:text-sm text-gray-600">Email me with news and offers</label>
              </div>
            </div>

            {/* Delivery Section */}
            <div className="bg-white border border-gray-200 rounded-[10px] p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-black mb-4">Delivery</h2>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {/* Country/Region */}
                <div className="relative">
                  <select className="w-full border border-gray-300 rounded-[8px] h-10 sm:h-12 bg-gray-50 px-3 pr-10 text-sm">
                    <option>India</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-3 sm:top-4 w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input
                    name="firstName"
                    placeholder="First name (optional)"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-300 rounded-[8px] h-10 sm:h-12 text-sm"
                  />
                  <Input
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-300 rounded-[8px] h-10 sm:h-12 text-sm"
                  />
                </div>

                {/* Address */}
                <div className="relative">
                  <Input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-300 rounded-[8px] h-10 sm:h-12 pr-10 text-sm"
                  />
                  <SearchIcon className="absolute right-3 top-3 sm:top-4 w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </div>

                {/* Apartment */}
                <Input
                  name="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="bg-gray-50 border-gray-300 rounded-[8px] h-10 sm:h-12 text-sm"
                />

                {/* City, State, PIN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <Input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-300 rounded-[8px] h-10 sm:h-12 text-sm"
                  />
                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded-[8px] h-10 sm:h-12 bg-gray-50 px-3 pr-10 text-sm">
                      <option>Kerala</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-3 sm:top-4 w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  </div>
                  <Input
                    name="pinCode"
                    placeholder="PIN code"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-300 rounded-[8px] h-10 sm:h-12 text-sm"
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <Input
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-300 rounded-[8px] h-10 sm:h-12 pr-10 text-sm"
                  />
                  <ClockIcon className="absolute right-3 top-3 sm:top-4 w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <label className="text-sm text-gray-600">Save this information for next time</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <label className="text-sm text-gray-600">Text me with news and offers</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Method Section */}
            <div className="bg-white border border-gray-200 rounded-[10px] p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-black mb-4">Shipping method</h2>
              <div className="bg-gray-50 rounded-[8px] p-3 sm:p-4 border border-gray-300 text-sm">
                <p className="text-gray-500">Enter your shipping address to view available shipping methods.</p>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white border border-gray-200 rounded-[10px] p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-black mb-4">Payment</h2>
              
              <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600 mb-4 sm:mb-6">
                <ShieldIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                All transactions are secure and encrypted.
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Razorpay Option */}
                <div className="border border-gray-300 rounded-[8px] p-3 sm:p-4">
                  <div className="flex items-center mb-2 sm:mb-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="razorpay" 
                      checked={formData.paymentMethod === "razorpay"}
                      onChange={handleInputChange}
                      className="mr-2 sm:mr-3"
                    />
                    <span className="font-medium text-sm sm:text-base">Razorpay Secure (UPI, Cards, Int&apos;l Cards, Wallets)</span>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                    <div className="bg-gray-100 rounded px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-small">UPI</div>
                    <div className="bg-gray-100 rounded px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-small">Visa</div>
                    <div className="bg-gray-100 rounded px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-small">Mastercard</div>
                    <div className="bg-gray-100 rounded px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-small">+18</div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                    After clicking &quot;Pay now&quot;, you will be redirected to Razorpay Secure (UPI, Cards, Int&apos;l Cards, Wallets) to complete your purchase securely.
                  </p>

                  <div className="flex items-center gap-2">
                    <CreditCardIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    <div className="w-12 h-6 sm:w-16 sm:h-8 bg-blue-100 rounded flex items-center justify-center">
                      <CreditCardIcon className="w-4 h-2.5 sm:w-6 sm:h-4 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-500">Card moving animation</span>
                  </div>
                </div>

                {/* PhonePe Option */}
                <div className="border border-gray-300 rounded-[8px] p-3 sm:p-4">
                  <div className="flex items-center mb-2 sm:mb-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="phonepe" 
                      checked={formData.paymentMethod === "phonepe"}
                      onChange={handleInputChange}
                      className="mr-2 sm:mr-3"
                    />
                    <span className="font-medium text-sm sm:text-base">PhonePe Payment Gateway (UPI, Cards & NetBanking)</span>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="bg-gray-100 rounded px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-small">UPI</div>
                    <div className="bg-gray-100 rounded px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-small">Visa</div>
                    <div className="bg-gray-100 rounded px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-small">Mastercard</div>
                    <div className="bg-gray-100 rounded px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-small">+4</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white border border-gray-200 rounded-[10px] p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-black mb-4">Billing address</h2>
              
              <div className="space-y-2 sm:space-y-3 text-sm">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="billingAddress" 
                    value="same" 
                    checked={formData.billingAddress === "same"}
                    onChange={handleInputChange}
                    className="mr-2 sm:mr-3 border-yellow-400 focus:border-yellow-500"
                  />
                  <span className="font-medium">Same as shipping address</span>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="billingAddress" 
                    value="different" 
                    checked={formData.billingAddress === "different"}
                    onChange={handleInputChange}
                    className="mr-2 sm:mr-3"
                  />
                  <span className="font-medium">Use a different billing address</span>
                </div>
              </div>
            </div>

            {/* Pay Now Button */}
            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 h-12 sm:h-14 text-base sm:text-lg font-bold rounded-[8px]">
              Pay now
            </Button>

            {/* Test Order Button for Developers */}
            <Button
              onClick={handleTestOrder}
              className="w-full bg-gray-300 text-black hover:bg-gray-400 h-12 sm:h-14 text-base sm:text-lg font-bold rounded-[8px] mt-4"
            >
              Test Order (Dev Only)
            </Button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-1">
            <Card className="bg-gray-50 border border-gray-200 rounded-[10px] sticky top-8 p-4 sm:p-6">
              <CardContent className="p-0">
                <h2 className="font-bold text-black text-lg sm:text-xl mb-4 sm:mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={32} 
                          height={32} 
                          className="object-contain rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-black">{item.quantity}</span>
                          <span className="text-xs sm:text-sm font-bold text-black">₹{item.price * item.quantity}</span>
                        </div>
                        <p className="text-xs text-gray-600">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Discount code"
                      className="bg-white border-gray-300 rounded-[8px] h-10 text-sm"
                    />
                    <Button className="bg-gray-200 text-black hover:bg-gray-300 h-10 px-3 text-sm">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 sm:space-y-3 border-t pt-3 sm:pt-4">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Subtotal - {cartItems.length} items</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>Enter shipping address</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-bold text-black border-t pt-2 sm:pt-2">
                    <span>Total</span>
                    <span>INR ₹{total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </>
  );
};
