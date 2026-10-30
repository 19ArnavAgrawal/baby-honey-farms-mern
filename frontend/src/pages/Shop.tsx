import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import type { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = [
    { label: 'All Honeys', value: 'all' },
    { label: 'Raw Honey', value: 'Raw Honey' },
    { label: 'Monofloral Reserve', value: 'Monofloral Reserve' },
    { label: 'Infused & Wellness', value: 'Infused & Wellness' },
    { label: 'Comb & Specialty', value: 'Comb & Specialty' },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | boolean> = {};
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (search.trim()) {
        params.search = search.trim();
      }
      if (sortBy) {
        params.sort = sortBy;
      }
      if (inStockOnly) {
        params.inStock = true;
      }

      const res = await api.getProducts(params);
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, inStockOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    if (val === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', val);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-8 text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-2">
          Titoli Apiary Harvest
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
          Pure Raw Honey Collection
        </h1>
        <p className="text-sm text-stone-600 mt-3 leading-relaxed">
          100% unpasteurized single-origin honeys, cold-extracted with zero additive syrups. Filter by floral nectar or search your favorite flavor notes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by flower, note (e.g. Acacia, Tulsi, Sidr)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            />
          </form>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-sm text-stone-700 focus:outline-hidden focus:border-amber-600 bg-white"
            >
              <option value="newest">Sort: Fresh Harvest (Newest)</option>
              <option value="bestseller">Sort: Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Stock Checkbox & Reset */}
          <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>In Stock Only</span>
            </label>

            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSortBy('newest');
                setInStockOnly(false);
                searchParams.delete('category');
                setSearchParams(searchParams);
              }}
              className="text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer"
              title="Reset all filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Count Status */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>Showing <b>{products.length}</b> pure honey options</span>
        <span>All jars shipped in premium protective food-grade packaging</span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">No matching honey found</h3>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            We couldn't find any honey matching your exact search or filter selection. Try adjusting your query or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
            }}
            className="px-6 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
