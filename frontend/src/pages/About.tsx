import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  MapPin,
  ArrowRight,
  Phone,
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50/60 to-white py-16 sm:py-24 border-b border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Rooted in Titoli, Rohtak, Haryana</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight">
            Honoring The Honeybee. <br />
            <span className="text-amber-700 italic">Preserving Pure Raw Gold.</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Baby Honey Farms was founded with one resolute principle: to deliver honey exactly as the bees sealed it in the comb — 100% raw, completely unheated, and untouched by industrial processing.
          </p>
        </div>
      </section>

      {/* Origin Story & Heritage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block">
              Our Titoli Farm Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              From Rural Mustard Fields to Pristine Alpine Reserves
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Nestled in the lush agricultural heartland of <b>Titoli, Rohtak, Haryana</b>, Baby Honey Farms began as a family passionate about restorative agriculture and traditional apiculture. Surrounded by fragrant yellow mustard blooms and seasonal flora, we realized commercial honey on supermarket shelves had been adulterated with high-fructose corn syrups and boiled into lifeless amber water.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              We decided to do things differently. We never feed our bee colonies sugar water or glucose. We practice nomadic apiary migration — moving hives to follow natural flowering cycles in Himachal valleys and Kashmir acacia groves — ensuring our bees forage only on wild, organic nectar.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="font-serif text-2xl font-black text-amber-900 block">500+</span>
                <span className="text-xs text-stone-600">Ethical Beehives</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="font-serif text-2xl font-black text-amber-900 block">0%</span>
                <span className="text-xs text-stone-600">Synthetic Processing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80"
                alt="Honeybee foraging on flower"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Beekeeping Pillars */}
      <section className="bg-stone-50 py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-2">
              The Gold Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Our 4 Pillars of Honey Purity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">No Sugar Syrup Feeding</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Many commercial producers boost hive yields by feeding bees sugar solution. We strictly leave ample honey reserves in each hive for the colony’s own sustenance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Cold Hand Extraction</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We spin uncapped honeycombs centrifugally without introducing heat above 35°C (natural hive temp). All beneficial invertase, amylase, and pollen grains remain intact.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Lab-Certified Purity</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Every batch is subjected to rigorous NABL testing for C4 sugar adulteration, antibiotic residues, and moisture standards (maintained under 19%).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Sustainable Glass Packaging</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We never store honey in microplastic-shedding plastic jars. We seal our harvest exclusively in recyclable, inert food-grade glass jars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connect & CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Experience The Difference of Raw Honey
        </h2>
        <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
          One spoonful of real, unpasteurized honey will forever change how you perceive sweetness. Browse our freshly harvested jars today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-600/20 flex items-center gap-2"
          >
            <span>Explore Honey Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/918397858496"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Inquire on WhatsApp (+91 8397858496)</span>
          </a>
        </div>
      </section>
    </div>
  );
};
