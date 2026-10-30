import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/constants.js';
import { User } from '../models/User.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || CONFIG.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User associated with token not found' });
      }

      if (user.role !== 'admin' && user.role !== 'manager') {
        return res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Authentication required. No Bearer token provided.' });
  }
};
