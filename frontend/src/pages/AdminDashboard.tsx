import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  LogOut,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { Order, Product } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Raw Honey',
    description: '',
    shortDescription: '',
    basePrice: '',
    stock: '',
    imageUrl: '',
    isFeatured: false,
    isBestseller: false,
  });

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        api.getDashboardStats(token),
        api.getOrders({}, token),
        api.getProducts({ limit: 100 }),
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await api.updateOrderStatus(orderId, newStatus, token);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this honey product from the catalog?')) {
      return;
    }
    setActionLoading(true);
    try {
      await api.deleteProduct(productId, token);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        category: product.category,
        description: product.description,
        shortDescription: product.shortDescription || '',
        basePrice: String(product.basePrice),
        stock: String(product.stock),
        imageUrl: product.images?.[0] || '',
        isFeatured: !!product.isFeatured,
        isBestseller: !!product.isBestseller,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        category: 'Raw Honey',
        description: '',
        shortDescription: '',
        basePrice: '',
        stock: '50',
        imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
        isFeatured: false,
        isBestseller: false,
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setActionLoading(true);
    try {
      const payload: Partial<Product> = {
        name: productForm.name,
        category: productForm.category,
        description: productForm.description,
        shortDescription: productForm.shortDescription,
        basePrice: Number(productForm.basePrice),
        stock: Number(productForm.stock),
        images: [productForm.imageUrl || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'],
        isFeatured: productForm.isFeatured,
        isBestseller: productForm.isBestseller,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload, token);
      } else {
        await api.createProduct(payload, token);
      }

      setIsProductModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    const matchesSearch =
      !orderSearch ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.firstName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Header */}
      <div className="bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-serif font-black flex items-center justify-center text-lg">
              BHF
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-white">Baby Honey Farms Admin</h1>
              <p className="text-xs text-stone-400">Logged in as {user?.email} ({user?.name})</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'orders'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'products'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Honey Products ({products.length})
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-stone-900">
                  ₹{stats?.totalRevenue ?? 0}
                </div>
                <span className="text-xs text-stone-400 mt-1 block">From verified customer orders</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {stats?.totalOrders ?? 0}
                </div>
                <span className="text-xs text-stone-400 mt-1 block">
                  {stats?.pendingOrders ?? 0} pending processing
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Honey Products</span>
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-700">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {stats?.totalProducts ?? products.length}
                </div>
                <span className="text-xs text-stone-400 mt-1 block">Active in catalog</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Stock Alerts</span>
                  <div className="p-2 rounded-lg bg-red-50 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {stats?.outOfStockProducts ?? 0}
                </div>
                <span className="text-xs text-stone-400 mt-1 block">Out of stock items</span>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h2 className="font-serif text-lg font-bold text-stone-900">Recent Customer Orders</h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 cursor-pointer"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">No customer orders placed yet.</p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {ord.orderStatus}
                          </span>
                        </div>
                        <p className="text-stone-500 mt-0.5">
                          {ord.customer.firstName} {ord.customer.lastName} • {ord.customer.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-black text-stone-900 text-sm">₹{ord.totalAmount}</span>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          disabled={actionLoading}
                          className="text-xs border border-stone-300 rounded-lg px-2 py-1 bg-white font-medium focus:border-amber-600"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">Order Management</h2>
                <p className="text-xs text-stone-500">Track and update fulfillment status for all honey dispatches</p>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by order or phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs w-48 focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden focus:border-amber-600"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-y border-stone-200 text-stone-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Customer & Phone</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Verified Total</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-400">
                        No matching orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-amber-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold block text-stone-800">
                            {ord.customer.firstName} {ord.customer.lastName}
                          </span>
                          <span className="text-stone-500 text-[11px]">{ord.customer.phone}</span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {ord.shippingAddress.city}, {ord.shippingAddress.state} ({ord.shippingAddress.pincode})
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {ord.items.map((it) => `${it.name} (${it.weight}g) x${it.quantity}`).join(', ')}
                        </td>
                        <td className="py-3.5 px-4 font-black text-stone-900">
                          ₹{ord.totalAmount}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            disabled={actionLoading}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : ord.orderStatus === 'Cancelled'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-amber-50 text-amber-900 border-amber-200'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">Honey Catalog & Inventory</h2>
                <p className="text-xs text-stone-500">Add, edit, or adjust inventory for your apiary reserves</p>
              </div>
              <button
                onClick={() => handleOpenProductModal()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Honey</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div key={prod._id} className="border border-stone-200 rounded-2xl p-4 flex gap-4 bg-stone-50/50">
                  <img
                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=200&q=80'}
                    alt={prod.name}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-800 block">
                        {prod.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-stone-900 truncate">{prod.name}</h4>
                      <p className="text-xs text-stone-600 font-semibold mt-0.5">
                        Base: ₹{prod.basePrice} • Stock: {prod.stock}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                      <button
                        onClick={() => handleOpenProductModal(prod)}
                        className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Create / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingProduct ? 'Edit Honey Variety' : 'Add New Honey Variety'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Honey Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Kashmir Saffron Infused Raw Honey"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-hidden focus:border-amber-600"
                  >
                    <option value="Raw Honey">Raw Honey</option>
                    <option value="Monofloral Reserve">Monofloral Reserve</option>
                    <option value="Infused & Wellness">Infused & Wellness</option>
                    <option value="Comb & Specialty">Comb & Specialty</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                    placeholder="799"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe tasting notes, harvest origin, and purity..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span className="font-semibold text-stone-700">Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestseller}
                    onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span className="font-semibold text-stone-700">Bestseller Badge</span>
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer disabled:bg-stone-300"
                >
                  {actionLoading ? 'Saving...' : 'Save Honey Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
