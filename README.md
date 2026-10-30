# 🍯 Baby Honey Farms — Full-Stack MERN E-Commerce Platform

A production-oriented full-stack MERN application for **Baby Honey Farms** (Titoli, Rohtak, Haryana 124001, India). Built independently with pure React, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB.

---

## 🌟 Key Highlights

- **Pure MERN Architecture**: Integrated React 19 + TypeScript frontend with an Express + Mongoose MVC backend.
- **Server-Side Verified WhatsApp Commerce**: Orders undergo authoritative server-side price and inventory stock validation before saving into MongoDB and launching WhatsApp.
- **Persistent Order Confirmation**: Every order generates an order number (e.g. `BHF-20261030-XXXX`) with a dedicated confirmation and tracking receipt.
- **Full Admin Suite**:
  - Secure JWT authentication with bcrypt password encryption.
  - Live revenue, order count, product count, and inventory alert metrics.
  - Complete Product CRUD (weight variants, images, stock, tags).
  - Order status workflow (`Pending` → `Confirmed` → `Processing` → `Shipped` → `Delivered` → `Cancelled`).
- **Single Configurable WhatsApp Number**: Configured across backend & frontend via `BUSINESS_WHATSAPP_NUMBER` (`8397858496`).
- **Zero-Config Resilient Database**: Connects to MongoDB Atlas when `MONGODB_URI` is provided, and includes an automated in-memory MongoDB fallback with pre-seeded botanical honey catalog for seamless offline/local evaluation.

---

## 📁 Project Architecture & Directory Structure

```text
baby-honey-farms-mern/
├── package.json              # Unified root scripts (dev, build, seed)
├── Dockerfile                # Multi-stage production container
├── fly.toml                  # Deployment configuration for Fly.io
├── .gitignore                # Protects node_modules and .env secrets
│
├── backend/
│   ├── package.json
│   ├── .env.example          # Environment variables template
│   ├── src/
│   │   ├── config/           # Database connector & store constants
│   │   ├── controllers/      # auth, product, order, category controllers
│   │   ├── middleware/       # JWT auth, rate limiter, error handling
│   │   ├── models/           # User, Product, Order, Category schemas
│   │   ├── routes/           # REST API routes
│   │   ├── scripts/          # Seed script & test suite
│   │   ├── utils/            # JWT token generator
│   │   └── server.js         # Express app entry & static server
│
└── frontend/
    ├── package.json
    ├── vite.config.ts        # Vite + Tailwind plugin + API proxy
    ├── index.html            # Brand typography & metadata
    └── src/
        ├── components/       # Navbar, Footer, CartDrawer, ProductCard, WhatsAppFloat
        ├── contexts/         # CartContext & AuthContext
        ├── pages/            # 10 full pages (Home, Shop, Details, Cart, Checkout, etc.)
        ├── services/         # Typed API client
        ├── types/            # TypeScript interfaces
        ├── App.tsx           # Router and route guards
        └── main.tsx          # React DOM entry
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Installation
From the root directory:
```bash
npm run install:all
```

### 3. Run Development Servers (Concurrent)
To launch both Express (Port 5000) and Vite React Frontend (Port 5173) simultaneously:
```bash
npm run dev
```

Visit the store at: **`http://localhost:5173`**

### 4. Admin Credentials (Pre-Seeded)
- **Portal URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@babyhoneyfarms.com`
- **Password**: `Admin@123`

### 5. WhatsApp Business Number
- **Default Number**: `8397858496`
- Configurable in `backend/.env` under `BUSINESS_WHATSAPP_NUMBER`.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | System uptime & health check |
| **GET** | `/api/config/public` | Public | Store origin, free shipping cutoff, WhatsApp number |
| **GET** | `/api/products` | Public | List products with search, category & price filters |
| **GET** | `/api/products/:id` | Public | Get single product by ID or Slug |
| **POST** | `/api/products` | Admin (JWT) | Create new honey variety |
| **PUT** | `/api/products/:id` | Admin (JWT) | Update product details or stock |
| **DELETE** | `/api/products/:id` | Admin (JWT) | Delete honey variety |
| **POST** | `/api/orders` | Public | Server-verified order placement & stock reduction |
| **GET** | `/api/orders/:id` | Public | Retrieve verified order receipt |
| **GET** | `/api/orders` | Admin (JWT) | List orders with status & search filters |
| **PATCH** | `/api/orders/:id/status`| Admin (JWT) | Update order fulfillment status |
| **GET** | `/api/orders/stats/overview` | Admin (JWT) | Revenue, total orders, and stock alerts |
| **POST** | `/api/auth/login` | Public (Rate-limited) | Admin login & JWT generation |
| **GET** | `/api/auth/me` | Admin (JWT) | Verify active session & role |

---

## 🧪 Verification & Test Suite

Run the full automated endpoint suite:
```bash
node backend/src/scripts/testEndpoints.js
```
The test verifies:
1. Health & Config status
2. Product catalog retrieval
3. Admin authentication & JWT token generation
4. Server-side order total recalculation
5. MongoDB order storage & stock reduction
6. Order receipt lookup
7. Admin metrics aggregation

---

## 🚢 GitHub Push & Deployment Instructions

### 1. Initialize Git Repository & Push to GitHub
```bash
cd baby-honey-farms-mern
git init
git add .
git commit -m "feat: complete independent Baby Honey Farms MERN full-stack application"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

### 2. Deploy to Fly.io
```bash
# Login to flyctl
fly auth login

# Deploy using the included Dockerfile and fly.toml
fly deploy
```

### 3. Deploy to Render / Railway / Heroku
- Set the Root Directory to `baby-honey-farms-mern`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment Variables:
  - `NODE_ENV=production`
  - `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/babyhoneyfarms?retryWrites=true&w=majority`
  - `JWT_SECRET=<your_secure_random_key>`
  - `BUSINESS_WHATSAPP_NUMBER=8397858496`
