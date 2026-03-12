// nodejs/service/userAddressService.js
'use strict';
const db = require('../db'); // mysql2/promise pool

// Lấy địa chỉ mặc định của user
exports.getDefaultAddress = async (userId) => {
  if (!userId) throw new Error('THIEU_ID_NGUOI_DUNG');

  const [rows] = await db.query(
    `SELECT user_id AS id_nguoi_dung, ho_ten, so_dien_thoai,
            tinh_thanh, quan_huyen, phuong_xa,
            so_nha, dia_chi_day_du, updated_at
     FROM user_addresses
     WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  if (rows.length) return rows[0];

  // Fallback: lấy name/phone từ users nếu có
  const [u] = await db.query(
    `SELECT name AS ho_ten, phone AS so_dien_thoai
       FROM users WHERE id=? LIMIT 1`,
    [userId]
  );
  if (u.length) {
    return {
      id_nguoi_dung: userId,
      ho_ten: u[0].ho_ten || '',
      so_dien_thoai: u[0].so_dien_thoai || '',
      tinh_thanh: '', quan_huyen: '', phuong_xa: '',
      so_nha: '', dia_chi_day_du: '',
      updated_at: null,
    };
  }
  return null;
};

// Lưu/cập nhật (UPSERT) địa chỉ mặc định
exports.saveDefaultAddress = async (userId, payload = {}) => {
  if (!userId) throw new Error('THIEU_ID_NGUOI_DUNG');

  const data = {
    ho_ten: (payload.ho_ten || '').trim(),
    so_dien_thoai: (payload.so_dien_thoai || '').trim(),
    tinh_thanh: payload.tinh_thanh || '',
    quan_huyen: payload.quan_huyen || '',
    phuong_xa: payload.phuong_xa || '',
    so_nha: payload.so_nha || '',
    dia_chi_day_du: payload.dia_chi_day_du || '',
  };

  await db.query(
    `INSERT INTO user_addresses
      (user_id, ho_ten, so_dien_thoai,
       tinh_thanh, quan_huyen, phuong_xa, so_nha, dia_chi_day_du, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE
       ho_ten=VALUES(ho_ten),
       so_dien_thoai=VALUES(so_dien_thoai),
       tinh_thanh=VALUES(tinh_thanh),
       quan_huyen=VALUES(quan_huyen),
       phuong_xa=VALUES(phuong_xa),
       so_nha=VALUES(so_nha),
       dia_chi_day_du=VALUES(dia_chi_day_du),
       updated_at=NOW()`,
    [
      userId,
      data.ho_ten,
      data.so_dien_thoai,
      data.tinh_thanh,
      data.quan_huyen,
      data.phuong_xa,
      data.so_nha,
      data.dia_chi_day_du,
    ]
  );

  return { id_nguoi_dung: userId, ...data };
};
