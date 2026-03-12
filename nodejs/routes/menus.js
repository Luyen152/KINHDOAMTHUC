const express = require('express');
const router = express.Router();
const menusController = require('../controllers/menusController');

router.get('/', menusController.getMenus);
router.get('/:id', menusController.getMenuById);

module.exports = router;
