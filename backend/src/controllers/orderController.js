import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { CONFIG } from '../config/constants.js';

// Helper to generate unique order reference
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BHF-${dateStr}-${randomSuffix}`;
};

// @desc    Create new order with server-side price & stock verification
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { customer, shippingAddress, items, notes, paymentMethod } = req.body;

    // 1. Basic validation
    if (!customer || !customer.firstName || !customer.phone || !customer.email) {
      return res.status(400).json({
        success: false,
        message: 'Customer information (first name, phone, email) is required',
      });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address (address, city, pincode) is required',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    // 2. Authoritative Price & Stock verification against MongoDB
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name || item.productId}" is no longer available in the store`,
        });
      }

      // Check weight variant
      const targetWeight = Number(item.weight);
      const variant = product.weightVariants.find((v) => Number(v.weight) === targetWeight);

      let unitPrice = product.basePrice;
      if (variant) {
        unitPrice = variant.price;
        if (variant.stock !== undefined && variant.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name} (${targetWeight}g). Available: ${variant.stock}, Requested: ${item.quantity}`,
          });
        }
      } else if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }

      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        productId: product._id,
        name: product.name,
        weight: targetWeight || 500,
        unitPrice,
        quantity: item.quantity,
        itemTotal,
        imageUrl: (product.images && product.images[0]) || '',
      });
    }

    // 3. Shipping cost calculation (Free shipping above threshold, e.g. 999)
    const shippingCost = calculatedSubtotal >= CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CONFIG.DEFAULT_SHIPPING_FEE;
    const totalAmount = calculatedSubtotal + shippingCost;

    const orderNumber = generateOrderNumber();

    // 4. Save to MongoDB
    const newOrder = await Order.create({
      orderNumber,
      customer: {
        firstName: customer.firstName.trim(),
        lastName: (customer.lastName || '').trim(),
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone.trim(),
      },
      shippingAddress: {
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state ? shippingAddress.state.trim() : 'Haryana',
        pincode: shippingAddress.pincode.trim(),
        country: shippingAddress.country || 'India',
      },
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      shippingCost,
      totalAmount,
      paymentMethod: paymentMethod || 'WhatsApp Direct / UPI / COD',
      orderStatus: 'Pending',
      notes: notes || '',
    });

    // 5. Deduct inventory stock safely
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stock: -item.quantity,
          'weightVariants.$[elem].stock': -item.quantity,
        },
      }, {
        arrayFilters: [{ 'elem.weight': item.weight }],
      });
    }

    // 6. Return verified order details including configured business WhatsApp number
    res.status(201).json({
      success: true,
      data: newOrder,
      businessWhatsAppNumber: process.env.BUSINESS_WHATSAPP_NUMBER || CONFIG.BUSINESS_WHATSAPP_NUMBER,
      message: 'Order created and verified successfully in database',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('items.productId', 'name slug images');
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: id }).populate('items.productId', 'name slug images');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: order,
      businessWhatsAppNumber: process.env.BUSINESS_WHATSAPP_NUMBER || CONFIG.BUSINESS_WHATSAPP_NUMBER,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'customer.firstName': searchRegex },
        { 'customer.lastName': searchRegex },
        { 'customer.phone': searchRegex },
        { 'customer.email': searchRegex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics & statistics
// @route   GET /api/orders/stats/overview
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => {
      // Exclude cancelled orders from revenue calculation
      return order.orderStatus !== 'Cancelled' ? sum + order.totalAmount : sum;
    }, 0);

    const totalProducts = await Product.countDocuments();
    const outOfStockProducts = await Product.countDocuments({ stock: { $lte: 0 } });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalProducts,
        outOfStockProducts,
        pendingOrders,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
