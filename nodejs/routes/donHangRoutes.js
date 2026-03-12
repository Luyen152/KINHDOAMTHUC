// nodejs/routes/donHang.routes.js
const express = require('express');
const router = express.Router();
const donHangController = require('../controllers/donHangController');

// ===== ADMIN =====
router.get('/all', donHangController.layTatCaDonHang);

// ===== CART (đơn hàng trạng thái "Đang xử lý") =====
router.get('/dem/:id', donHangController.demSoLuongTrongGio);
router.post('/them-mon', donHangController.themMonVaoGio);
router.put('/cap-nhat', donHangController.capNhatSoLuongMon);
router.post('/xoa-mon', donHangController.xoaMonKhoiGio);
router.delete('/xoa-mon', donHangController.xoaMonKhoiGio);

// ✅ XÓA TOÀN BỘ ĐƠN TRONG GIỎ (trạng thái "Đang xử lý")
router.delete('/xoa-don/:id', donHangController.xoaDonTrongGio);

// ✅ HỦY ĐƠN trong 15 phút sau khi thanh toán/xác nhận
router.post('/huy/:id', donHangController.huyDonTrong15Phut);

// ✅ CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (VD: "Đã nhận")
router.put('/cap-nhat-trang-thai', donHangController.capNhatTrangThai);

// Thanh toán (đổi trạng thái)
router.post('/thanh-toan', donHangController.thanhToan);

// Lấy đơn hàng "Đang xử lý" theo người dùng (đặt CUỐI CÙNG để không nuốt route khác)
router.get('/:id', donHangController.layDonHangTheoNguoiDung);

module.exports = router;

