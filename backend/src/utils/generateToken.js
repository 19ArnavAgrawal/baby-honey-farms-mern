import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/constants.js';

export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || CONFIG.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || CONFIG.JWT_EXPIRES_IN,
  });
};
