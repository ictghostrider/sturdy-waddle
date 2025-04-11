const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');

// Online card processing
router.post('/process', paymentController.processPayment);

// Capture offline payment
router.post('/capture-offline', paymentController.captureOfflinePayment);

// Sync stored offline payments
router.post('/sync', paymentController.syncOfflinePayments);

module.exports = router;
