import express from 'express';
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
  getDashboardStats,
} from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/stats/overview', protectAdmin, getDashboardStats);
router.get('/', protectAdmin, getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', protectAdmin, updateOrderStatus);

export default router;
