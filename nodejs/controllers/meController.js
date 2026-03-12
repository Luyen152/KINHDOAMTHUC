// nodejs/controllers/meController.js
'use strict';

const db = require('../db'); // thêm để dùng cho API đơn hàng
const userAddressService = require('../service/userAddressService');

/* ===================== ĐỊA CHỈ MẶC ĐỊNH ===================== */
// GET /api/me/address
exports.getMyAddress = async (req, res) => {
  try {
    const userId = req.user?.id || Number(req.query.id_nguoi_dung);
    if (!userId) return res.status(401).json({ error: 'CHUA_DANG_NHAP' });

    const address = await userAddressService.getDefaultAddress(userId);
    res.status(200).json({ address: address || null });
  } catch (err) {
    console.error('[❌] GET /api/me/address:', err);
    res.status(500).json({ error: err.message || 'GET_ADDRESS_FAILED' });
  }
};

// PUT /api/me/address
exports.putMyAddress = async (req, res) => {
  try {
    const userId = req.user?.id || Number(req.body.id_nguoi_dung);
    if (!userId) return res.status(401).json({ error: 'CHUA_DANG_NHAP' });

    const payload = {
      ho_ten: req.body.ho_ten,
      so_dien_thoai: req.body.so_dien_thoai,
      tinh_thanh: req.body.tinh_thanh,
      quan_huyen: req.body.quan_huyen,
      phuong_xa: req.body.phuong_xa,
      so_nha: req.body.so_nha,
      dia_chi_day_du: req.body.dia_chi_day_du,
    };

    const saved = await userAddressService.saveDefaultAddress(userId, payload);
    res.status(200).json({ ok: true, address: saved });
  } catch (err) {
    console.error('[❌] PUT /api/me/address:', err);
    res.status(500).json({ error: err.message || 'SAVE_ADDRESS_FAILED' });
  }
};

/* ===================== ĐƠN HÀNG ===================== */
/**
 * PUT /api/orders/:id/confirm-delivered
 * Body/Query: user_id (nếu chưa có auth)
 * Chuyển orders.status => 'Đã giao', delivered_at = NOW()
 * Chỉ cho phép khi status đang 'Đã xác nhận' hoặc 'Đang giao'
 */
exports.confirmDeliveredByUser = async (req, res) => {
  try {
    const userId = req.user?.id || Number(req.body.user_id || req.query.user_id);
    const orderId = Number(req.params.id || req.body.order_id || req.query.order_id);
    if (!userId || !orderId) return res.status(400).json({ error: 'MISSING_USER_OR_ORDER_ID' });

    const [r1] = await db.query(
      `UPDATE orders
         SET status='Đã giao', delivered_at=NOW()
       WHERE id=? AND user_id=? AND status IN ('Đã xác nhận','Đang giao')
       LIMIT 1`,
      [orderId, userId]
    );
    if (!r1.affectedRows) return res.status(400).json({ error: 'ORDER_NOT_ALLOWED_OR_NOT_FOUND' });

    const [rows] = await db.query(
      `SELECT id, user_id, status, address_text, delivered_at, created_at, total_amount
         FROM orders WHERE id=? LIMIT 1`,
      [orderId]
    );
    return res.status(200).json({ ok: true, order: rows[0], message: 'Đã xác nhận đã nhận hàng' });
  } catch (e) {
    console.error('[❌] confirmDeliveredByUser', e);
    return res.status(400).json({ error: e.message || 'CONFIRM_DELIVERED_FAILED' });
  }
};

/**
 * GET /api/orders/admin/list?status=Đã giao
 * Trả danh sách đơn cho trang Admin (có thể lọc theo trạng thái)
 */
exports.adminListOrders = async (req, res) => {
  try {
    const status = req.query.status;
    const where = status ? 'WHERE status=?' : '';
    const params = status ? [status] : [];
    const [rows] = await db.query(
      `SELECT id,
              user_id          AS id_nguoi_dung,
              status           AS trang_thai,
              address_text     AS dia_chi,
              delivered_at,
              created_at       AS ngay_dat,
              total_amount     AS tong_tien
         FROM orders
         ${where}
         ORDER BY id DESC
         LIMIT 500`,
      params
    );
    res.status(200).json({ orders: rows });
  } catch (e) {
    console.error('[❌] adminListOrders', e);
    res.status(500).json({ error: e.message || 'LIST_ORDERS_FAILED' });
  }
};
