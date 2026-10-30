import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Honey Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleOpenInWhatsApp = () => {
    const text = encodeURIComponent(
      `*Inquiry from Baby Honey Farms Website*\n` +
      `*Name:* ${formData.name || 'Friend'}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Topic:* ${formData.subject}\n` +
      `*Message:* ${formData.message || 'I would like to know more about your honey collection.'}`
    );
    window.open(`https://wa.me/918397858496?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block">
          We’d Love To Hear From You
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
          Visit Our Apiary or Send a Note
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Whether you have questions regarding raw honey crystalization, corporate gifting, or want to schedule a visit to our Titoli bee farm, our beekeepers are ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
              Apiary Contact Details
            </h2>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Farm Location</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Baby Honey Farms, Titoli<br />
                    Rohtak, Haryana 124001, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Phone & WhatsApp</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    <a href="tel:+918397858496" className="text-amber-800 font-semibold hover:underline">
                      +91 8397858496
                    </a>
                  </p>
                  <p className="text-[11px] text-stone-400">Direct farm concierge available 9am - 7pm</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Email Inquiry</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    <a href="mailto:hello@babyhoneyfarms.com" className="hover:text-amber-800">
                      hello@babyhoneyfarms.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Visiting Hours</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Monday to Saturday: 9:00 AM – 6:30 PM<br />
                    Sunday: By prior appointment for apiary tours
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Pill */}
            <div className="pt-2">
              <a
                href="https://wa.me/918397858496"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Chat: +91 8397858496</span>
              </a>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
            Send an Apiary Message
          </h2>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Message Received!</h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Thank you, {formData.name || 'Friend'}. Our Titoli apiary team will respond to your inquiry within 24 hours.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleOpenInWhatsApp}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Also via WhatsApp for Instant Reply</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-amber-600"
                    placeholder="e.g. Ananya Rao"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-amber-600"
                    placeholder="ananya@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-amber-600"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Topic</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-hidden focus:border-amber-600"
                  >
                    <option value="General Honey Inquiry">General Honey Inquiry</option>
                    <option value="Apiary Farm Visit in Titoli">Apiary Farm Visit in Titoli</option>
                    <option value="Bulk / Corporate Gifting">Bulk / Corporate Gifting</option>
                    <option value="Purity / Lab Reports">Purity / Lab Reports</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-amber-600"
                  placeholder="Tell us what you would like to know or how we can assist..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenInWhatsApp}
                  className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
