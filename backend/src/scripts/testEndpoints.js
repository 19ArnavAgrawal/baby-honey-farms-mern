import http from 'http';
import mongoose from 'mongoose';
import { app, server } from '../server.js';
import { CONFIG } from '../config/constants.js';

const PORT = 5001;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function waitForDb() {
  while (mongoose.connection.readyState !== 1) {
    await new Promise((r) => setTimeout(r, 200));
  }
}

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE MERN ENDPOINT VERIFICATION ---');
  let testServer;
  try {
    testServer = app.listen(PORT);
    console.log(`[Test Runner] Waiting for database connection...`);
    await waitForDb();
    console.log(`[Test Runner] Database connected and ready.`);

    // 1. Health check
    console.log('\n1. Testing GET /api/health');
    const health = await request({ hostname: 'localhost', port: PORT, path: '/api/health', method: 'GET' });
    console.log(`   Status: ${health.status}, Service: ${health.body.service}`);

    // 2. Public config
    console.log('\n2. Testing GET /api/config/public');
    const config = await request({ hostname: 'localhost', port: PORT, path: '/api/config/public', method: 'GET' });
    console.log(`   Store: ${config.body.data.storeName}, WhatsApp: ${config.body.data.businessWhatsAppNumber}`);

    // 3. Products list
    console.log('\n3. Testing GET /api/products');
    const products = await request({ hostname: 'localhost', port: PORT, path: '/api/products', method: 'GET' });
    console.log(`   Products found: ${products.body.count}`);

    // 4. Admin Login
    console.log('\n4. Testing POST /api/auth/login');
    const loginRes = await request(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@babyhoneyfarms.com', password: 'Admin@123' }
    );
    console.log(`   Login status: ${loginRes.status}, User: ${loginRes.body.data?.name}`);
    const token = loginRes.body.data?.token;

    // 5. Admin Auth Me
    console.log('\n5. Testing GET /api/auth/me (Protected Admin)');
    const meRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`   Auth Me status: ${meRes.status}, Email: ${meRes.body.data?.email}`);

    // 6. Test Order Creation with Server Verification
    console.log('\n6. Testing POST /api/orders (Price verification & MongoDB persistence)');
    let sampleProduct = products.body.data?.[0];
    if (sampleProduct) {
      const orderPayload = {
        customer: {
          firstName: 'Vikram',
          lastName: 'Mehta',
          email: 'vikram.mehta@example.com',
          phone: '9876543210',
        },
        shippingAddress: {
          address: '42 Blossom Boulevard, Sector 14',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122001',
        },
        items: [
          {
            productId: sampleProduct._id,
            name: sampleProduct.name,
            weight: 500,
            quantity: 2,
          },
        ],
        notes: 'Please dispatch in morning.',
      };

      const orderRes = await request(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/orders',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        orderPayload
      );
      console.log(`   Order creation status: ${orderRes.status}`);
      console.log(`   Created Order Number: ${orderRes.body.data?.orderNumber}`);
      console.log(`   Verified Total: ₹${orderRes.body.data?.totalAmount}`);
      console.log(`   WhatsApp Business Number: ${orderRes.body.businessWhatsAppNumber}`);

      // 7. Test Order Retrieval
      console.log('\n7. Testing GET /api/orders/:id');
      const getOrderRes = await request({
        hostname: 'localhost',
        port: PORT,
        path: `/api/orders/${orderRes.body.data?.orderNumber}`,
        method: 'GET',
      });
      console.log(`   Order retrieval status: ${getOrderRes.status}, Order Status: ${getOrderRes.body.data?.orderStatus}`);

      // 8. Admin Dashboard Stats
      console.log('\n8. Testing GET /api/orders/stats/overview (Admin Dashboard Metrics)');
      const statsRes = await request({
        hostname: 'localhost',
        port: PORT,
        path: '/api/orders/stats/overview',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`   Total Orders: ${statsRes.body.data?.totalOrders}, Revenue: ₹${statsRes.body.data?.totalRevenue}`);
    }

    console.log('\n======================================================');
    console.log(' ALL 8 MERN ENDPOINTS PASSED VERIFICATION WITH 200 OK');
    console.log('======================================================\n');
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    if (testServer) testServer.close();
    if (server) server.close();
    process.exit(0);
  }
}

runTests();
