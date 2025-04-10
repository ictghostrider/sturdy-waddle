const express = require('express');
const router = express.Router();

router.use('/transactions', require('./transactions'));
router.use('/offline', require('./offline'));
router.use('/reports', require('./reports'));

module.exports = router;