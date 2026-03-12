// 📁 routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// 🟢 Public
router.post('/register', userController.register);
router.post('/login', userController.login);

// 🟡 Private: người dùng đã đăng nhập
router.get('/me', verifyToken, userController.getMe); // Lấy user hiện tại

// 🔴 Admin Only: Quản lý user
router.get('/', verifyToken, isAdmin, userController.getAllUsers); // ✅ THÊM DÒNG NÀY
router.post('/', verifyToken, isAdmin, userController.createUser);
router.put('/:id', verifyToken, isAdmin, userController.updateUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;

