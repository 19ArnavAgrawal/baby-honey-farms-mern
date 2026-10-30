import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const defaultWeight = product.weightVariants?.[0]?.weight ?? 500;
  const [selectedWeight, setSelectedWeight] = useState<number>(defaultWeight);
  const [isAdded, setIsAdded] = useState(false);

  const activeVariant = product.weightVariants?.find((v) => v.weight === selectedWeight);
  const displayPrice = activeVariant ? activeVariant.price : product.basePrice;
  const displayOriginal = activeVariant?.originalPrice || product.originalPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Link */}
      <Link to={`/honey/${product.slug || product._id}`} className="relative aspect-4/3 overflow-hidden bg-stone-100 block">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isBestseller && (
            <span className="bg-amber-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Apiary Bestseller
            </span>
          )}
          {product.isFeatured && !product.isBestseller && (
            <span className="bg-stone-900 text-amber-300 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Farm Reserve
            </span>
          )}
        </div>

        {/* Stock status badge if low or out */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-lg shadow">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Origin */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-semibold text-amber-800 uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            <span className="truncate max-w-[140px] text-stone-400">
              {product.origin?.region || 'Titoli, Rohtak'}
            </span>
          </div>

          {/* Product Title */}
          <Link
            to={`/honey/${product.slug || product._id}`}
            className="font-serif font-bold text-base sm:text-lg text-stone-900 hover:text-amber-700 transition-colors line-clamp-1 mb-1.5 block"
          >
            {product.name}
          </Link>

          {/* Tagline / Short description */}
          <p className="text-xs text-stone-500 line-clamp-2 mb-3 min-h-[32px]">
            {product.shortDescription || product.tagline || product.description}
          </p>

          {/* Flavor Notes pills */}
          {product.flavorNotes && product.flavorNotes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.flavorNotes.slice(0, 3).map((note, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          )}

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-stone-700">{product.rating || 4.9}</span>
            <span className="text-xs text-stone-400">({product.reviewsCount || 24})</span>
          </div>
        </div>

        {/* Weight Selector & Price CTA */}
        <div className="pt-3 border-t border-stone-100">
          {/* Weight variant pills */}
          {product.weightVariants && product.weightVariants.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[11px] text-stone-400 mr-1 font-medium">Jar:</span>
              {product.weightVariants.map((variant) => (
                <button
                  key={variant.weight}
                  onClick={() => setSelectedWeight(variant.weight)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedWeight === variant.weight
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-transparent'
                  }`}
                >
                  {variant.weight}g
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-stone-900">₹{displayPrice}</span>
                {displayOriginal && displayOriginal > displayPrice && (
                  <span className="text-xs text-stone-400 line-through">₹{displayOriginal}</span>
                )}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium block">Taxes included</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                !product.inStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
