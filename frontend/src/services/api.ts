import type { Product, Order, User, StoreConfig } from '../types';

const API_BASE = '/api';

const getAuthHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem('bhf_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
};

export const api = {
  // Public Configuration
  async getPublicConfig(): Promise<{ success: boolean; data: StoreConfig }> {
    const res = await fetch(`${API_BASE}/config/public`);
    if (!res.ok) throw new Error('Failed to load store configuration');
    return res.json();
  },

  // Products
  async getProducts(params: Record<string, string | number | boolean> = {}): Promise<{
    success: boolean;
    data: Product[];
    total: number;
    count: number;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(idOrSlug: string): Promise<{ success: boolean; data: Product }> {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async createProduct(productData: Partial<Product>, token?: string): Promise<{ success: boolean; data: Product }> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create product');
    return data;
  },

  async updateProduct(id: string, productData: Partial<Product>, token?: string): Promise<{ success: boolean; data: Product }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  },

  async deleteProduct(id: string, token?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete product');
    return data;
  },

  // Orders
  async createOrder(orderPayload: {
    customer: { firstName: string; lastName: string; email: string; phone: string };
    shippingAddress: { address: string; city: string; state: string; pincode: string };
    items: { productId: string; weight: number; quantity: number }[];
    notes?: string;
  }): Promise<{ success: boolean; data: Order; businessWhatsAppNumber: string; message: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to place order');
    return data;
  },

  async getOrder(idOrNumber: string): Promise<{ success: boolean; data: Order; businessWhatsAppNumber: string }> {
    const res = await fetch(`${API_BASE}/orders/${idOrNumber}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order not found');
    return data;
  },

  async getOrders(params: Record<string, string | number> = {}, token?: string): Promise<{
    success: boolean;
    data: Order[];
    total: number;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') query.append(key, String(val));
    });
    const res = await fetch(`${API_BASE}/orders?${query.toString()}`, {
      headers: getAuthHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load orders');
    return data;
  },

  async updateOrderStatus(id: string, status: string, token?: string): Promise<{ success: boolean; data: Order }> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update order status');
    return data;
  },

  async getDashboardStats(token?: string): Promise<{
    success: boolean;
    data: {
      totalOrders: number;
      totalRevenue: number;
      totalProducts: number;
      outOfStockProducts: number;
      pendingOrders: number;
      recentOrders: Order[];
    };
  }> {
    const res = await fetch(`${API_BASE}/orders/stats/overview`, {
      headers: getAuthHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load stats');
    return data;
  },

  // Auth
  async login(credentials: { email: string; password: string }): Promise<{
    success: boolean;
    data: User;
  }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe(token?: string): Promise<{ success: boolean; data: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unauthorized');
    return data;
  },
};
