const express = require('express');
const router = express.Router();
const { saveOffline, listOffline } = require('./offlineController');

router.post('/save', saveOffline);
router.get('/all', listOffline);

module.exports = router;