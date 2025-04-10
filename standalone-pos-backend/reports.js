const express = require('express');
const router = express.Router();
const { dailyReport } = require('./reportController');

router.get('/daily', dailyReport);

module.exports = router;