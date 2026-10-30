import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';

export const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Haryana',
    pincode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const freeShippingThreshold = 999;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 99;
  const totalAmount = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your Basket is Empty</h2>
        <p className="text-sm text-stone-500">Please add honey jars to your basket before checking out.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Shop</span>
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.trim().length < 10) newErrors.phone = '10-digit mobile number is required';
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.trim().length < 6) newErrors.pincode = '6-digit pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 1. Prepare items payload for server-side verification
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        weight: item.selectedWeight,
        quantity: item.quantity,
      }));

      // 2. Call backend POST /api/orders (verifies prices, calculates total, deducts stock, saves to MongoDB)
      const res = await api.createOrder({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: orderItems,
        notes: formData.notes,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || 'Server failed to save order to database.');
      }

      const createdOrder = res.data;
      const businessWhatsAppNumber = res.businessWhatsAppNumber || '8397858496';

      // 3. Clear shopping basket
      clearCart();

      // 4. Construct WhatsApp Order Confirmation Message
      const itemsListFormatted = createdOrder.items
        .map(
          (it, idx) =>
            `${idx + 1}. *${it.name}* (${it.weight}g) x ${it.quantity} = ₹${it.itemTotal}`
        )
        .join('\n');

      const whatsappText = [
        `*🐝 NEW ORDER: Baby Honey Farms*`,
        `*Order Reference:* ${createdOrder.orderNumber}`,
        `--------------------------------`,
        `*Ordered Items:*`,
        itemsListFormatted,
        `--------------------------------`,
        `*Subtotal:* ₹${createdOrder.subtotal}`,
        `*Shipping:* ${createdOrder.shippingCost === 0 ? 'FREE' : `₹${createdOrder.shippingCost}`}`,
        `*Total Verified Amount:* ₹${createdOrder.totalAmount}`,
        `--------------------------------`,
        `*Delivery Address:*`,
        `${createdOrder.customer.firstName} ${createdOrder.customer.lastName}`,
        `${createdOrder.shippingAddress.address}`,
        `${createdOrder.shippingAddress.city}, ${createdOrder.shippingAddress.state} - ${createdOrder.shippingAddress.pincode}`,
        `Phone: ${createdOrder.customer.phone}`,
        `Email: ${createdOrder.customer.email}`,
        createdOrder.notes ? `Notes: ${createdOrder.notes}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const whatsappUrl = `https://wa.me/91${businessWhatsAppNumber}?text=${encodeURIComponent(
        whatsappText
      )}`;

      // 5. Open WhatsApp in new tab
      try {
        window.open(whatsappUrl, '_blank');
      } catch (e) {
        console.warn('Popup blocked, customer can also click WhatsApp button on confirmation page');
      }

      // 6. Navigate to persistent Order Confirmation page
      navigate(`/order-confirmation/${createdOrder.orderNumber}`, {
        state: { order: createdOrder, whatsappUrl },
      });
    } catch (err: any) {
      console.error('Order creation failed:', err);
      setServerError(err.message || 'Could not verify or place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-1">
          Direct Apiary Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Shipping & Contact Details
        </h1>
        <p className="text-xs text-stone-500 mt-2">
          Your order will be verified by the backend server and assigned a persistent order ID before opening WhatsApp.
        </p>
      </div>

      {serverError && (
        <div className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Order Placement Error</span>
            <span>{serverError}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">
                1. Customer Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      errors.firstName ? 'border-red-400 bg-red-50' : 'border-stone-300'
                    } focus:outline-hidden focus:border-amber-600`}
                    placeholder="e.g. Rahul"
                  />
                  {errors.firstName && <span className="text-[11px] text-red-600 mt-1 block">{errors.firstName}</span>}
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-amber-600"
                    placeholder="e.g. Sharma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-stone-300'
                    } focus:outline-hidden focus:border-amber-600`}
                    placeholder="rahul@gmail.com"
                  />
                  {errors.email && <span className="text-[11px] text-red-600 mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      errors.phone ? 'border-red-400 bg-red-50' : 'border-stone-300'
                    } focus:outline-hidden focus:border-amber-600`}
                    placeholder="9876543210"
                  />
                  {errors.phone && <span className="text-[11px] text-red-600 mt-1 block">{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">
                2. Shipping Address (India)
              </h2>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">House, Street & Colony *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    errors.address ? 'border-red-400 bg-red-50' : 'border-stone-300'
                  } focus:outline-hidden focus:border-amber-600`}
                  placeholder="e.g. H.No 124, Model Town"
                />
                {errors.address && <span className="text-[11px] text-red-600 mt-1 block">{errors.address}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">City / Town *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      errors.city ? 'border-red-400 bg-red-50' : 'border-stone-300'
                    } focus:outline-hidden focus:border-amber-600`}
                    placeholder="Rohtak"
                  />
                  {errors.city && <span className="text-[11px] text-red-600 mt-1 block">{errors.city}</span>}
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-amber-600"
                    placeholder="Haryana"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      errors.pincode ? 'border-red-400 bg-red-50' : 'border-stone-300'
                    } focus:outline-hidden focus:border-amber-600`}
                    placeholder="124001"
                  />
                  {errors.pincode && <span className="text-[11px] text-red-600 mt-1 block">{errors.pincode}</span>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Delivery Notes (Optional)</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:border-amber-600"
                  placeholder="Special instructions or landmark near your address"
                />
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Risk Payment via Official WhatsApp</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Clicking confirm saves your order directly into our database and connects you with our Titoli apiary team on WhatsApp to confirm delivery time and UPI / COD payment preference.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/25 cursor-pointer disabled:bg-stone-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying & Saving Order to MongoDB...</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span>Confirm Order & Open WhatsApp (₹{totalAmount})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Review Sidebar */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
            Order Review ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h2>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-stone-100">
            {items.map((item) => (
              <div key={`${item.product._id}-${item.selectedWeight}`} className="pt-3 first:pt-0 flex gap-3 items-center">
                <img
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=200&q=80'}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">{item.product.name}</h4>
                  <p className="text-[11px] text-stone-500">
                    {item.selectedWeight}g jar • Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-xs font-bold text-stone-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping Fee</span>
              <span className="font-bold text-stone-900">
                {shippingCost === 0 ? <span className="text-emerald-700">FREE</span> : `₹${shippingCost}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-100">
              <span>Verified Total</span>
              <span className="text-amber-900 text-lg">₹{totalAmount}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center gap-3 text-stone-600 text-xs">
            <Truck className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Dispatched directly from Titoli apiary in shatter-proof foam packaging.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
