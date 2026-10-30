export interface WeightVariant {
  weight: number;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface ProductOrigin {
  region: string;
  state: string;
  country: string;
}

export interface FlavorProfile {
  sweetness: number;
  floral: number;
  fruity: number;
  earthy: number;
  richness: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  tagline?: string;
  shortDescription?: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  weightVariants: WeightVariant[];
  images: string[];
  origin?: ProductOrigin;
  floralSource?: string;
  harvestSeason?: string;
  flavorProfile?: FlavorProfile;
  flavorNotes?: string[];
  healthBenefits?: string[];
  certifications?: string[];
  stock: number;
  inStock: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  selectedWeight: number;
  price: number;
  quantity: number;
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingAddressData {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  weight: number;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
  imageUrl?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: CustomerData;
  shippingAddress: ShippingAddressData;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  token?: string;
}

export interface StoreConfig {
  storeName: string;
  storeOrigin: string;
  contactEmail: string;
  businessWhatsAppNumber: string;
  freeShippingThreshold: number;
  defaultShippingFee: number;
  currency: string;
  currencySymbol: string;
}
