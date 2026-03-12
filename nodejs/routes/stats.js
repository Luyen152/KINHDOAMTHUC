// nodejs/routes/stats.js
'use strict';

const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// GET /api/stats/product-sales?from=2025-08-01&to=2025-08-31
router.get('/product-sales', statsController.productSales);

// GET /api/stats/revenue-daily?from=2025-08-01&to=2025-08-31
router.get('/revenue-daily', statsController.revenueDaily);

module.exports = router;
