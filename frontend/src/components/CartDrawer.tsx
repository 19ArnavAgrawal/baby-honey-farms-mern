import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Your Honey Basket</h2>
                <p className="text-xs text-stone-500">{totalItems} {totalItems === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3 bg-amber-50/30 border-b border-amber-100/60">
            <div className="flex items-center justify-between text-xs font-medium text-stone-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-700" />
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-bold">You unlocked FREE Home Delivery!</span>
                ) : (
                  <span>Add ₹{remainingForFreeShipping} more for <b>FREE Delivery</b></span>
                )}
              </span>
              <span className="text-stone-500">{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  subtotal >= freeShippingThreshold ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">Your basket is empty</h3>
                <p className="text-sm text-stone-500 max-w-xs mb-6">
                  Experience pure raw nectar harvested straight from our hives.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Explore Honey Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.product._id}-${item.selectedWeight}`} className="py-4 flex gap-4">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product._id, item.selectedWeight)}
                        className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block text-[11px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md">
                        {item.selectedWeight}g Jar
                      </span>
                      <span className="text-xs text-stone-500">₹{item.price} each</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.selectedWeight, item.quantity - 1)}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.selectedWeight, item.quantity + 1)}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="text-sm font-bold text-amber-900">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-stone-50 border-t border-stone-200 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-stone-900">
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-700">FREE</span>
                    ) : (
                      '₹99'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="text-amber-900 text-lg">
                    ₹{subtotal + (subtotal >= freeShippingThreshold ? 0 : 99)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-bold tracking-wide uppercase transition-colors cursor-pointer"
                >
                  View Full Cart
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-600/20"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-center text-stone-500">
                🔒 Orders are verified & confirmed directly via WhatsApp.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
