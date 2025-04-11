const express = require('express');
const dotenv = require('dotenv');
const saleRoutes = require('./payment.routes');
const paymentRoutes = require('./payment.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.send('👋 Welcome to the Stripe-less POS Backend!');
});

// Payment API Routes
app.use('/api/payment', paymentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
