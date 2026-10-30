export const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/babyhoneyfarms',
  JWT_SECRET: process.env.JWT_SECRET || 'bhf_secret_jwt_token_key_development_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BUSINESS_WHATSAPP_NUMBER: process.env.BUSINESS_WHATSAPP_NUMBER || '8397858496',
  FREE_SHIPPING_THRESHOLD: 999,
  DEFAULT_SHIPPING_FEE: 99,
  STORE_NAME: 'Baby Honey Farms',
  STORE_ORIGIN: 'Titoli, Rohtak, Haryana 124001, India',
  CONTACT_EMAIL: 'hello@babyhoneyfarms.com',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
