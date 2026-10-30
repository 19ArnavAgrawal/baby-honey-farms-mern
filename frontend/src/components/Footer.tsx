import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Award, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Guarantees */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-stone-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Raw & Pure</h4>
              <p className="text-xs text-stone-400 mt-1">Never heated or ultra-filtered; preserves live enzymes.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Lab Tested Quality</h4>
              <p className="text-xs text-stone-400 mt-1">Tested for purity, zero antibiotics & zero added sugar.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Ethical Beekeeping</h4>
              <p className="text-xs text-stone-400 mt-1">Bees are never fed sugar syrup; gentle harvest protocols.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Direct Apiary Trace</h4>
              <p className="text-xs text-stone-400 mt-1">Every jar traceable straight back to Titoli, Rohtak apiary.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white font-serif font-black text-lg">
                BHF
              </div>
              <span className="font-serif font-bold text-xl text-white">Baby Honey Farms</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Harvested with care from our lush apiary in Titoli, Rohtak, Haryana. We bring nature’s purest, richest liquid gold straight from the honeycomb to your family table.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/918397858496"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp (+91 8397858496)</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-amber-400 transition-colors">Honey Catalog</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">Our Story & Heritage</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Visit Apiary</Link></li>
            </ul>
          </div>

          {/* Honey Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Featured Varieties</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/shop?category=Raw Honey" className="hover:text-amber-400 transition-colors">Himalayan Wildflower Raw</Link></li>
              <li><Link to="/shop?category=Monofloral Reserve" className="hover:text-amber-400 transition-colors">Kashmir White Acacia Honey</Link></li>
              <li><Link to="/shop?category=Monofloral Reserve" className="hover:text-amber-400 transition-colors">Royal Sidr / Berry Blossom</Link></li>
              <li><Link to="/shop?category=Comb & Specialty" className="hover:text-amber-400 transition-colors">Raw Honeycomb Jar</Link></li>
            </ul>
          </div>

          {/* Farm Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Apiary Headquarters</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>Baby Honey Farms, Titoli, Rohtak, Haryana 124001, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+918397858496" className="hover:text-white transition-colors">+91 8397858496</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:hello@babyhoneyfarms.com" className="hover:text-white transition-colors">hello@babyhoneyfarms.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Baby Honey Farms. All Rights Reserved. Crafted with pure devotion to nature.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="text-stone-400 hover:text-amber-400 transition-colors">Admin Portal</Link>
            <span>•</span>
            <span className="text-stone-400">FSSAI Certified Apiary</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
