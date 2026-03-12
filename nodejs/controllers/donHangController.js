// controllers/donHangController.js
'use strict';

const donHangService = require('../service/donHangService');

/* ================== ADMIN ================== */
// ✅ Admin: Lấy tất cả đơn hàng
exports.layTatCaDonHang = async (req, res) => {
  try {
    const result = await donHangService.layTatCaDonHang();
    res.status(200).json(result);
  } catch (err) {
    console.error('[❌] Lỗi lấy tất cả đơn hàng:', err);
    res.status(500).json({ error: err.message || 'INTERNAL_ERROR' });
  }
};

/* ================== CART ================== */
// ✅ Thêm món vào giỏ
exports.themMonVaoGio = async (req, res) => {
  try {
    const result = await donHangService.themMon(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('[❌] Lỗi thêm món:', err);
    res.status(500).json({ error: err.message || 'ADD_CART_FAILED' });
  }
};

// ✅ Lấy đơn hàng đang xử lý theo người dùng
exports.layDonHangTheoNguoiDung = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await donHangService.layDonHangTheoNguoiDung(id);
    if (!result) {
      return res
        .status(200)
        .json({ chi_tiet: [], tong_tien: 0, trang_thai: 'Đang xử lý' });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error('[❌] Lỗi lấy đơn hàng:', err);
    res.status(500).json({ error: err.message || 'GET_CART_FAILED' });
  }
};

// ✅ Cập nhật số lượng món
exports.capNhatSoLuongMon = async (req, res) => {
  try {
    const result = await donHangService.capNhatSoLuongMon(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('[❌] Lỗi cập nhật số lượng:', err);
    res.status(500).json({ error: err.message || 'UPDATE_QTY_FAILED' });
  }
};

// ✅ Xoá món khỏi giỏ
exports.xoaMonKhoiGio = async (req, res) => {
  try {
    const result = await donHangService.xoaMonKhoiGioHang(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('[❌] Lỗi xoá món:', err);
    res.status(500).json({ error: err.message || 'REMOVE_ITEM_FAILED' });
  }
};

// ✅ Đếm tổng số lượng trong giỏ
exports.demSoLuongTrongGio = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await donHangService.demSoLuongTrongGio(id);
    res.status(200).json(result);
  } catch (err) {
    console.error('[❌] Lỗi đếm món trong giỏ:', err);
    res.status(500).json({ error: err.message || 'COUNT_CART_FAILED' });
  }
};

/* ================== CHECKOUT ================== */
// ✅ Thanh toán (đổi trạng thái 'Đã xác nhận')
exports.thanhToan = async (req, res) => {
  try {
    const out = await donHangService.thanhToan(req.body);
    res.status(200).json(out);
  } catch (e) {
    console.error('[❌] Lỗi thanh toán:', e);
    res.status(400).json({ error: e.message || 'CHECKOUT_FAILED' });
  }
};

/* ================== BỔ SUNG ================== */
// ✅ Xóa cả đơn trong giỏ (trạng thái 'Đang xử lý')
exports.xoaDonTrongGio = async (req, res) => {
  try {
    const id_don_hang = Number(req.params.id);
    const id_nguoi_dung =
      req.user?.id ||
      Number(req.body.id_nguoi_dung || req.query.id_nguoi_dung);

    if (!id_don_hang) return res.status(400).json({ error: 'THIEU_ID_DON_HANG' });
    if (!id_nguoi_dung) return res.status(401).json({ error: 'CHUA_DANG_NHAP' });

    const out = await donHangService.xoaDonHangTrongGio({ id_don_hang, id_nguoi_dung });
    if (!out.ok) {
      return res
        .status(404)
        .json({ error: 'KHONG_TIM_THAY_DON_HOAC_KHONG_O_TRANG_THAI_GIO' });
    }
    res.status(200).json({ ok: true, message: 'DA_XOA_GIO_HANG' });
  } catch (err) {
    console.error('[❌] Lỗi xóa giỏ hàng:', err);
    res.status(500).json({ error: err.message || 'DELETE_CART_FAILED' });
  }
};

// ✅ Hủy đơn trong 15 phút sau thanh toán/xác nhận
exports.huyDonTrong15Phut = async (req, res) => {
  try {
    const id_don_hang = Number(req.params.id);
    const id_nguoi_dung =
      req.user?.id ||
      Number(req.body.id_nguoi_dung || req.query.id_nguoi_dung);

    if (!id_don_hang) return res.status(400).json({ error: 'THIEU_ID_DON_HANG' });
    if (!id_nguoi_dung) return res.status(401).json({ error: 'CHUA_DANG_NHAP' });

    const out = await donHangService.huyDonTrong15Phut({ id_don_hang, id_nguoi_dung });
    if (!out.ok) {
      if (out.reason === 'ORDER_NOT_FOUND') {
        return res.status(404).json({ error: 'KHONG_TIM_THAY_DON_HANG' });
      }
      if (out.reason === 'INVALID_STATUS') {
        return res.status(400).json({ error: 'CHI_HUY_DUOC_DON_DA_THANH_TOAN_HOAC_DA_XAC_NHAN' });
      }
      if (out.reason === 'TIME_WINDOW_EXCEEDED') {
        return res.status(400).json({ error: 'QUA_15_PHUT_KHONG_THE_HUY' });
      }
      return res.status(400).json({ error: 'HUY_DON_THAT_BAI' });
    }
    res.status(200).json({ ok: true, message: 'DA_HUY_DON_HANG' });
  } catch (err) {
    console.error('[❌] Lỗi hủy đơn hàng:', err);
    res.status(500).json({ error: err.message || 'CANCEL_ORDER_FAILED' });
  }
};

// ✅ Cập nhật trạng thái đơn hàng (Admin hoặc User xác nhận đã nhận)
exports.capNhatTrangThai = async (req, res) => {
  try {
    const { id, trang_thai, id_nguoi_dung } = req.body;
    if (!id || !trang_thai) {
      return res.status(400).json({ error: 'THIEU_ID_OR_TRANG_THAI' });
    }

    const out = await donHangService.capNhatTrangThai({ id, trang_thai, id_nguoi_dung });
    if (!out.ok) {
      return res.status(400).json({ error: out.reason || 'CAP_NHAT_THAT_BAI' });
    }
    res.status(200).json({ ok: true, order: out.order, message: 'CAP_NHAT_TRANG_THAI_OK' });
  } catch (err) {
    console.error('[❌] Lỗi cập nhật trạng thái:', err);
    res.status(500).json({ error: err.message || 'CAP_NHAT_TRANG_THAI_FAILED' });
  }
};
