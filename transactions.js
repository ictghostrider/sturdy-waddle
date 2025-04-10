const express = require('express');
const router = express.Router();
const { processTransaction } = require('./transactionController');

router.post('/', processTransaction);

module.exports = router;