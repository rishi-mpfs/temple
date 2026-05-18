import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import donationRoutes from './routes/donation.routes.js';
import poojaRoutes from './routes/pooja.routes.js';
import darshanRoutes from './routes/darshan.routes.js';

// Load env vars
dotenv.config();

// Connect to DB (serverless safe)
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf && buf.length ? buf.toString() : '';
  },
}));
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Temple Backend is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/pooja-bookings', poojaRoutes);
app.use('/api/darshan-bookings', darshanRoutes);

// Error Handler
app.use(errorHandler);

export default app;
