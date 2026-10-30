import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  MessageCircle,
  Award,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<number>(500);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const res = await api.getProduct(id);
        setProduct(res.data);
        if (res.data.weightVariants && res.data.weightVariants.length > 0) {
          setSelectedWeight(res.data.weightVariants[0].weight);
        }
      } catch (err: any) {
        setError(err.message || 'Product could not be loaded');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-stone-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-stone-200 rounded w-1/4" />
            <div className="h-10 bg-stone-200 rounded w-3/4" />
            <div className="h-20 bg-stone-200 rounded" />
            <div className="h-12 bg-stone-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Honey Not Found</h2>
        <p className="text-sm text-stone-600 mb-6">{error || 'The requested product is not available.'}</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const activeVariant = product.weightVariants?.find((v) => v.weight === selectedWeight);
  const currentPrice = activeVariant ? activeVariant.price : product.basePrice;
  const currentOriginal = activeVariant?.originalPrice || product.originalPrice;

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedWeight, quantity);
    navigate('/checkout');
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Baby Honey Farms! I am viewing ${product.name} (${selectedWeight}g jar, ₹${currentPrice}) and would like to inquire about placing an order.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-amber-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-amber-700">Shop Pure Honey</Link>
        <span>/</span>
        <span className="text-stone-900 font-semibold truncate">{product.name}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === idx ? 'border-amber-600 shadow-sm' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Category and Origin */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="font-bold text-amber-800 uppercase tracking-widest text-[11px] bg-amber-50 px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <span className="flex items-center gap-1 text-stone-500 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {product.origin?.region || 'Titoli, Rohtak'} Apiary
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Tagline */}
            {product.tagline && (
              <p className="text-sm font-serif italic text-amber-800 mt-1">
                "{product.tagline}"
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-stone-800">{product.rating || 4.9}</span>
              <span className="text-xs text-stone-400">({product.reviewsCount || 28} Verified Apiary Reviews)</span>
            </div>
          </div>

          {/* Price & Taxes */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-stone-900">₹{currentPrice}</span>
              {currentOriginal && currentOriginal > currentPrice && (
                <span className="text-sm text-stone-400 line-through">₹{currentOriginal}</span>
              )}
              {currentOriginal && currentOriginal > currentPrice && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Save ₹{currentOriginal - currentPrice}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Inclusive of all taxes • Free shipping applies for orders over ₹999
            </p>
          </div>

          {/* Weight Variants */}
          {product.weightVariants && product.weightVariants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                Select Jar Size:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {product.weightVariants.map((variant) => (
                  <button
                    key={variant.weight}
                    onClick={() => setSelectedWeight(variant.weight)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedWeight === variant.weight
                        ? 'border-amber-600 bg-amber-50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <span className="block text-xs font-bold text-stone-900">{variant.weight} grams</span>
                    <span className="block text-xs text-amber-900 font-semibold mt-0.5">₹{variant.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  !product.inStock
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 active:scale-98'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Basket</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-stone-900 hover:bg-stone-800 text-white transition-all cursor-pointer"
            >
              Buy Now with Verified Checkout
            </button>
          </div>

          {/* Direct WhatsApp Ordering */}
          <div className="pt-2">
            <a
              href={`https://wa.me/918397858496?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Ask Beekeeper on WhatsApp (+91 8397858496)</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200 text-center">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <ShieldCheck className="w-5 h-5 text-amber-700 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-stone-900">100% Raw</span>
              <span className="text-[10px] text-stone-500">Unpasteurized</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <Truck className="w-5 h-5 text-amber-700 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-stone-900">Insured Delivery</span>
              <span className="text-[10px] text-stone-500">Safe Glass Transit</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <RotateCcw className="w-5 h-5 text-amber-700 mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-stone-900">Pure Guarantee</span>
              <span className="text-[10px] text-stone-500">Lab Backed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flavor Profile & Botanical Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-stone-200">
        {/* Flavor Profile Radar / Sliders */}
        <div className="lg:col-span-5 bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-amber-700" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Tasting & Sensory Profile</h3>
          </div>

          <div className="space-y-4">
            {product.flavorProfile && (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                    <span>Sweetness Intensity</span>
                    <span>{product.flavorProfile.sweetness} / 5</span>
                  </div>
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${(product.flavorProfile.sweetness / 5) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                    <span>Floral Aroma</span>
                    <span>{product.flavorProfile.floral} / 5</span>
                  </div>
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${(product.flavorProfile.floral / 5) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                    <span>Fruity / Citrus Notes</span>
                    <span>{product.flavorProfile.fruity} / 5</span>
                  </div>
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${(product.flavorProfile.fruity / 5) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                    <span>Earthy / Herbal Depth</span>
                    <span>{product.flavorProfile.earthy} / 5</span>
                  </div>
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${(product.flavorProfile.earthy / 5) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                    <span>Richness & Viscosity</span>
                    <span>{product.flavorProfile.richness} / 5</span>
                  </div>
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${(product.flavorProfile.richness / 5) * 100}%` }} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Flavor Notes */}
          {product.flavorNotes && product.flavorNotes.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                Distinguishable Tasting Notes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.flavorNotes.map((note, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-stone-200 text-stone-800 text-xs font-medium rounded-lg">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Botanical Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">Apiary Description & Sourcing</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
              <div>
                <span className="text-stone-400 block">Floral Nectar Source:</span>
                <span className="font-bold text-stone-800">{product.floralSource || 'Pure Wildflower Blossom'}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Harvest Season:</span>
                <span className="font-bold text-stone-800">{product.harvestSeason || 'Autumn / Spring'}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Apiary Origin:</span>
                <span className="font-bold text-stone-800">
                  {product.origin ? `${product.origin.region}, ${product.origin.state}` : 'Titoli, Rohtak, Haryana'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Packaging:</span>
                <span className="font-bold text-stone-800">Airtight Food-Grade Glass Jar</span>
              </div>
            </div>
          </div>

          {/* Health Benefits & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/60 space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Health & Wellness
              </span>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {(product.healthBenefits || ['Immunity Booster', 'Soothes Throat', 'High in Antioxidants']).map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/60 space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Certifications & Quality
              </span>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {(product.certifications || ['100% Raw & Cold Extracted', 'Lab Tested Purity']).map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
