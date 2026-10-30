import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  const freeShippingThreshold = 999;
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingCost;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Your Basket is Empty</h1>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          Discover nature's finest unprocessed liquid gold harvested from our apiary in Titoli, Rohtak.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-600/20"
        >
          <span>Explore Honey Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-5 flex items-baseline justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Shopping Cart</h1>
          <p className="text-xs text-stone-500 mt-1">{totalItems} pure honey jars in your order</p>
        </div>
        <Link to="/shop" className="text-xs font-semibold text-amber-800 hover:text-amber-900">
          + Add more items
        </Link>
      </div>

      {/* Free Shipping Callout */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Truck className="w-5 h-5 text-amber-700 shrink-0" />
          <span className="font-medium text-stone-800">
            {subtotal >= freeShippingThreshold ? (
              <b className="text-emerald-700">Congratulations! You unlocked FREE Delivery.</b>
            ) : (
              <span>Add <b>₹{remainingForFree}</b> more to your cart to qualify for <b>FREE Delivery</b>!</span>
            )}
          </span>
        </div>
        <div className="w-full sm:w-48 bg-stone-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full ${subtotal >= freeShippingThreshold ? 'bg-emerald-600' : 'bg-amber-600'}`}
            style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
          />
        </div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 overflow-hidden divide-y divide-stone-100 shadow-xs">
          {items.map((item) => (
            <div key={`${item.product._id}-${item.selectedWeight}`} className="p-6 flex flex-col sm:flex-row gap-5 items-center">
              <img
                src={item.product.images[0] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80'}
                alt={item.product.name}
                className="w-24 h-24 rounded-2xl object-cover border border-stone-200 bg-stone-50 shrink-0"
              />

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  {item.product.category}
                </span>
                <Link
                  to={`/honey/${item.product.slug || item.product._id}`}
                  className="font-serif font-bold text-base text-stone-900 hover:text-amber-700 block mt-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-xs text-stone-500 mt-0.5">
                  Jar Size: <b className="text-stone-800">{item.selectedWeight} grams</b> • Unit Price: ₹{item.price}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.selectedWeight, item.quantity - 1)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.selectedWeight, item.quantity + 1)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-sm font-black text-stone-900 w-20 text-right">
                  ₹{item.price * item.quantity}
                </span>

                <button
                  onClick={() => removeFromCart(item.product._id, item.selectedWeight)}
                  className="text-stone-400 hover:text-red-600 p-2 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Charges</span>
              <span className="font-semibold text-stone-900">
                {shippingCost === 0 ? <span className="text-emerald-700">FREE</span> : `₹${shippingCost}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
              <span>Total Amount</span>
              <span className="text-amber-900 text-xl font-black">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-600/20 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2 font-bold text-stone-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Direct WhatsApp Flow</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Your order total will be server-verified and saved securely to our database, then opened in WhatsApp for instant tracking and apiary dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
