// nodejs/routes/dishes.js
const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

// Route GET tất cả món ăn
router.get('/', dishController.getAllDishes);

// Route GET theo slug
router.get('/slug/:slug', dishController.getDishBySlug); // ✅ ĐÚNG

module.exports = router;
