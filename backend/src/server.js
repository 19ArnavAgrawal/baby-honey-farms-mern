import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { CONFIG } from './config/constants.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust Render/proxy reverse proxy (required for express-rate-limit and accurate IP detection)
app.set('trust proxy', 1);

// Database Connection
connectDB();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'https://babyhoneyfarms.fly.dev',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body Parsing & Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global API rate limiting
app.use('/api', apiLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Baby Honey Farms MERN API',
    uptime: process.uptime(),
  });
});

// Public Store Configuration (Configured in single place)
app.get('/api/config/public', (req, res) => {
  res.json({
    success: true,
    data: {
      storeName: CONFIG.STORE_NAME,
      storeOrigin: CONFIG.STORE_ORIGIN,
      contactEmail: CONFIG.CONTACT_EMAIL,
      businessWhatsAppNumber: process.env.BUSINESS_WHATSAPP_NUMBER || CONFIG.BUSINESS_WHATSAPP_NUMBER,
      freeShippingThreshold: CONFIG.FREE_SHIPPING_THRESHOLD,
      defaultShippingFee: CONFIG.DEFAULT_SHIPPING_FEE,
      currency: 'INR',
      currencySymbol: '₹',
    },
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// In production, serve frontend build if present
const possibleDistPaths = [
  path.resolve(__dirname, '../../frontend/dist'),
  path.resolve(__dirname, '../../../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(process.cwd(), '../frontend/dist'),
];

let staticDir = null;
for (const p of possibleDistPaths) {
  if (fs.existsSync(p)) {
    staticDir = p;
    break;
  }
}

if (staticDir) {
  app.use(express.static(staticDir));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(path.join(staticDir, 'index.html'));
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || CONFIG.PORT;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] Baby Honey Farms API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} (0.0.0.0)`);
});

export { app, server };
