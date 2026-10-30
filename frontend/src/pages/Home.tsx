import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Droplets,
  Flower2,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { api } from '../services/api';
import type { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.getProducts({ featured: true, limit: 4 });
        if (res.data && res.data.length > 0) {
          setFeaturedProducts(res.data);
        } else {
          // If no featured, fetch first 4 products
          const fallbackRes = await api.getProducts({ limit: 4 });
          setFeaturedProducts(fallbackRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load featured honeys:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    {
      title: 'Raw Forest Honey',
      slug: 'Raw Honey',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      description: 'Cold-extracted & unfiltered directly from high-altitude wilderness.',
    },
    {
      title: 'Monofloral Reserve',
      slug: 'Monofloral Reserve',
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80',
      description: 'Single floral nectar sources: Kashmir Acacia, Royal Sidr & Mustard.',
    },
    {
      title: 'Infused & Wellness',
      slug: 'Infused & Wellness',
      image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=600&q=80',
      description: 'Cold-steeped with sacred Holy Tulsi and Ayurvedic medicinal botanicals.',
    },
    {
      title: 'Raw Comb in Glass',
      slug: 'Comb & Specialty',
      image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=600&q=80',
      description: 'Intact honeycomb squares loaded with propolis, bee bread, and wax.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-stone-50 to-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-amber-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Harvested at Titoli Apiary, Rohtak, Haryana</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.15]">
                Nature’s Purest Gold, <br />
                <span className="text-amber-700 italic font-serif">Straight From The Hive.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                Experience raw, unpasteurized honey enriched with live enzymes, propolis, and wild floral aromas. Every single jar is cold-extracted by hand and certified 100% pure by independent laboratories.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-600/25 flex items-center justify-center gap-2"
                >
                  <span>Explore Honey Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm rounded-xl border border-stone-300 transition-colors flex items-center justify-center"
                >
                  Our Ethical Apiary Story
                </Link>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="block text-2xl font-black text-stone-900">100%</span>
                  <span className="text-xs text-stone-500 font-medium">Raw & Unfiltered</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-stone-900">0%</span>
                  <span className="text-xs text-stone-500 font-medium">Sugar Syrup Added</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-stone-900">NABL</span>
                  <span className="text-xs text-stone-500 font-medium">Lab Certified Purity</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Amber Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-amber-400/20 to-amber-600/30 rounded-3xl blur-2xl -z-10" />

                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 aspect-4/5">
                  <img
                    src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"
                    alt="Baby Honey Farms Jar"
                    className="w-full h-full object-cover"
                  />
                  {/* Floating Authenticity Badge */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-amber-100 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Direct Apiary Harvest</h4>
                      <p className="text-xs text-stone-500">Titoli, Rohtak • Cold Extracted Raw</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-2">
            Curated Hive Reserves
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Explore By Botanical Origin
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Discover how diverse wildflowers, mountain meadows, and farm blossoms craft unique flavor palettes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${encodeURIComponent(cat.slug)}`}
              className="group relative rounded-2xl overflow-hidden aspect-4/5 bg-stone-900 shadow-md hover:shadow-xl transition-all duration-300 block"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-6">
                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  Collection
                </span>
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                  {cat.description}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>View Varieties</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-1">
              Top Customer Choices
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Featured Apiary Harvests
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-3 sm:mt-0 text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
          >
            <span>Browse Complete Shop ({featuredProducts.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-stone-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* The Baby Honey Farms Journey (5 Steps) */}
      <section className="bg-stone-900 text-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
              Our Apiary Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              The Blossom to Bottle Journey
            </h2>
            <p className="text-sm text-stone-400 mt-2">
              We practice mindful, ethical beekeeping at our Titoli farm. Here is how nature’s elixir reaches your home untampered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-amber-400 font-serif mb-4 block">01</span>
                <Flower2 className="w-8 h-8 text-amber-400 mb-4" />
                <h4 className="font-serif text-lg font-bold text-white mb-2">Pristine Foraging</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Apiaries are stationed amidst untouched seasonal blossoms — mustard in Rohtak, wildflowers in Himalayan foothills.
                </p>
              </div>
            </div>

            <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-amber-400 font-serif mb-4 block">02</span>
                <Heart className="w-8 h-8 text-amber-400 mb-4" />
                <h4 className="font-serif text-lg font-bold text-white mb-2">Ethical Extraction</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  We never over-harvest or feed sugar syrup. Honey is gathered only when comb cells are naturally capped by bees.
                </p>
              </div>
            </div>

            <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-amber-400 font-serif mb-4 block">03</span>
                <Droplets className="w-8 h-8 text-amber-400 mb-4" />
                <h4 className="font-serif text-lg font-bold text-white mb-2">Cold Extracted</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Centrifugally spun at hive ambient temperatures. Zero artificial heating so natural enzymes and pollen remain alive.
                </p>
              </div>
            </div>

            <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-amber-400 font-serif mb-4 block">04</span>
                <ShieldCheck className="w-8 h-8 text-amber-400 mb-4" />
                <h4 className="font-serif text-lg font-bold text-white mb-2">Lab Tested & Sealed</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Each batch undergoes nuclear magnetic resonance testing for sugar purity, then sealed in food-grade glass jars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health & Wellness Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block">
              Pure Nutritional Alchemy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              Why Raw Honey Outperforms Commercial Processed Honey
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Supermarket honey is often pasteurized at high heat, destroying fragile antibacterial enzymes and stripping nutritious bee pollen. Our raw honey preserves 100% of nature’s active compounds.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Enzyme & Pollen Intact</h4>
                  <p className="text-xs text-stone-500">Rich in diastase, invertase, and natural bio-flavonoids.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Ayurvedic Healing Properties</h4>
                  <p className="text-xs text-stone-500">Natural remedy for sore throat, wound recovery, and gut digestion.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Clean Sustained Energy</h4>
                  <p className="text-xs text-stone-500">Natural fructose-glucose balance provides fuel without insulin spikes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-4/3 border border-amber-200">
              <img
                src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80"
                alt="Raw Honey Jar on wooden table"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Direct WhatsApp Concierge CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
              Direct Farmer Connect
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold">
              Prefer To Order Directly on WhatsApp?
            </h3>
            <p className="text-sm text-amber-100/90 leading-relaxed">
              Have questions about flavor profiles, bulk corporate gifting, or apiary visits in Titoli, Rohtak? Chat directly with our beekeeper on WhatsApp.
            </p>
            <div className="pt-3 flex flex-wrap gap-4">
              <a
                href="https://wa.me/918397858496"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Chat on WhatsApp: +91 8397858496</span>
              </a>
              <Link
                to="/contact"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl backdrop-blur-xs transition-colors"
              >
                Visit Our Apiary Farm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
