import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedWeight?: number, quantity?: number) => void;
  removeFromCart: (productId: string, weight: number) => void;
  updateQuantity: (productId: string, weight: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bhf_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product: Product, selectedWeight?: number, quantity = 1) => {
    const weight = selectedWeight || (product.weightVariants?.[0]?.weight ?? 500);
    
    // Find price for this weight variant
    const variant = product.weightVariants?.find((v) => v.weight === weight);
    const price = variant ? variant.price : product.basePrice;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product._id === product._id && item.selectedWeight === weight
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [...prev, { product, selectedWeight: weight, price, quantity }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, weight: number) => {
    setItems((prev) => prev.filter((item) => !(item.product._id === productId && item.selectedWeight === weight)));
  };

  const updateQuantity = (productId: string, weight: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product._id === productId && item.selectedWeight === weight) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
