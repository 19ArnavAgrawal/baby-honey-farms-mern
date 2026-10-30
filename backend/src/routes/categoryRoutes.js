import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protectAdmin, createCategory);

export default router;
