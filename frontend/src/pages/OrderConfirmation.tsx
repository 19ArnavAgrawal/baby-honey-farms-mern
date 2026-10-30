import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle,
  Phone,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import type { Order } from '../types';

export const OrderConfirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(
    (location.state as any)?.order || null
  );
  const [businessWhatsAppNumber, setBusinessWhatsAppNumber] = useState<string>(
    '8397858496'
  );
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;
      try {
        const res = await api.getOrder(orderNumber);
        setOrder(res.data);
        if (res.businessWhatsAppNumber) {
          setBusinessWhatsAppNumber(res.businessWhatsAppNumber);
        }
      } catch (err: any) {
        setError(err.message || 'Could not find order records.');
      } finally {
        setLoading(false);
      }
    };

    if (!order) {
      fetchOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-stone-600">Retrieving verified order from database...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-sm text-stone-600">{error || 'No matching order reference found.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl"
        >
          <span>Return to Home</span>
        </Link>
      </div>
    );
  }

  // Construct WhatsApp URL
  const itemsText = order.items
    .map(
      (it, idx) =>
        `${idx + 1}. *${it.name}* (${it.weight}g) x ${it.quantity} = ₹${it.itemTotal}`
    )
    .join('\n');

  const formattedMsg = [
    `*🐝 ORDER REFERENCE: ${order.orderNumber}*`,
    `Hi Baby Honey Farms! Here is my confirmed order:`,
    '',
    itemsText,
    '',
    `*Subtotal:* ₹${order.subtotal}`,
    `*Shipping:* ${order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}`,
    `*Total:* ₹${order.totalAmount}`,
    '',
    `*Deliver to:*`,
    `${order.customer.firstName} ${order.customer.lastName}`,
    `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`,
    `Phone: ${order.customer.phone}`,
  ].join('\n');

  const whatsappUrl = `https://wa.me/91${businessWhatsAppNumber}?text=${encodeURIComponent(
    formattedMsg
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-9 h-9" />
        </div>
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block">
          Order Successfully Recorded in Database
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-900">
          Thank You, {order.customer.firstName}!
        </h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
          Your order has been verified and safely logged with reference{' '}
          <b className="text-amber-800 font-mono">{order.orderNumber}</b>.
        </p>

        {/* WhatsApp Re-Open Action */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/25"
          >
            <Phone className="w-4 h-4" />
            <span>Chat With Farm on WhatsApp (+91 {businessWhatsAppNumber})</span>
          </a>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Header Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-stone-100 text-xs">
          <div>
            <span className="text-stone-400 block mb-1">Order Reference</span>
            <span className="font-mono font-bold text-stone-900 text-sm">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-stone-400 block mb-1">Order Date</span>
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block mb-1">Order Status</span>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Itemized List */}
        <div>
          <h3 className="font-serif text-base font-bold text-stone-900 mb-4">
            Items in This Order
          </h3>
          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">{item.name}</h4>
                    <span className="text-xs text-stone-500">
                      {item.weight}g jar • Qty: {item.quantity} × ₹{item.unitPrice}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-stone-900">₹{item.itemTotal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Totals */}
        <div className="pt-4 border-t border-stone-100 space-y-2 text-xs sm:text-sm max-w-xs ml-auto">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal:</span>
            <span className="font-bold text-stone-900">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Delivery:</span>
            <span className="font-bold text-stone-900">
              {order.shippingCost === 0 ? <span className="text-emerald-700">FREE</span> : `₹${order.shippingCost}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
            <span>Total Verified:</span>
            <span className="text-amber-900 text-xl">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Shipping Address Summary */}
        <div className="pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Delivery Address</span>
            </h4>
            <p className="text-stone-600 leading-relaxed">
              {order.customer.firstName} {order.customer.lastName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              India
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-2">Contact Details</h4>
            <p className="text-stone-600 leading-relaxed">
              Phone: {order.customer.phone}<br />
              Email: {order.customer.email}<br />
              Payment: {order.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/shop"
          className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5"
        >
          <span>Continue Shopping Honey</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-stone-600 hover:text-stone-900"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  );
};
