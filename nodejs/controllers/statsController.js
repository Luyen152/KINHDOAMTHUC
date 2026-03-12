// nodejs/controllers/statsController.js
'use strict';

const statsService = require('../service/statsService');

exports.productSales = async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await statsService.getProductSales({ from, to });
    res.json({ ok: true, data });
  } catch (err) {
    console.error('statsController.productSales', err);
    res.status(500).json({ ok: false, error: 'INTERNAL_ERROR' });
  }
};

exports.revenueDaily = async (req, res) => {
  try {
    const { from, to } = req.query;
    const data = await statsService.getRevenueDaily({ from, to });
    res.json({ ok: true, data });
  } catch (err) {
    console.error('statsController.revenueDaily', err);
    res.status(500).json({ ok: false, error: 'INTERNAL_ERROR' });
  }
};
