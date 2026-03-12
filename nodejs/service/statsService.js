// nodejs/service/statsService.js
'use strict';

const db = require('../db');

// Trạng thái đơn hàng được tính vào doanh thu
const VALID_STATUS = ['Đã xác nhận', 'Đã giao'];

/**
 * Thống kê theo sản phẩm (tổng số lượng & doanh thu)
 * @param {Object} opt
 * @param {string} [opt.from] - yyyy-mm-dd
 * @param {string} [opt.to]   - yyyy-mm-dd (bao hàm cả ngày to)
 */
async function getProductSales({ from, to } = {}) {
  const params = [...VALID_STATUS];
  let whereDate = '';

  if (from) {
    whereDate += ' AND dh.ngay_dat >= ?';
    params.push(from);
  }
  if (to) {
    // +1 ngày để bao trọn ngày 'to'
    whereDate += ' AND dh.ngay_dat < DATE_ADD(?, INTERVAL 1 DAY)';
    params.push(to);
  }

  const [rows] = await db.query(
    `
    SELECT 
      d.id,
      d.name AS ten_san_pham,
      SUM(ct.so_luong) AS so_luong_ban,
      SUM(ct.so_luong * ct.gia_ban) AS doanh_thu
    FROM don_hang dh
    JOIN chi_tiet_don_hang ct ON ct.id_don_hang = dh.id
    JOIN dishes d ON d.id = ct.id_mon_an
    WHERE dh.trang_thai IN (?, ?)
      ${whereDate}
    GROUP BY d.id, d.name
    ORDER BY doanh_thu DESC
    `,
    params
  );

  return rows;
}

/**
 * Doanh thu theo ngày (để vẽ biểu đồ đường)
 * @param {Object} opt
 * @param {string} [opt.from] - yyyy-mm-dd
 * @param {string} [opt.to]   - yyyy-mm-dd
 */
async function getRevenueDaily({ from, to } = {}) {
  const params = [...VALID_STATUS];
  let whereDate = '';

  if (from) {
    whereDate += ' AND dh.ngay_dat >= ?';
    params.push(from);
  }
  if (to) {
    whereDate += ' AND dh.ngay_dat < DATE_ADD(?, INTERVAL 1 DAY)';
    params.push(to);
  }

  const [rows] = await db.query(
    `
    SELECT 
      DATE(dh.ngay_dat) AS ngay,
      SUM(ct.so_luong * ct.gia_ban) AS doanh_thu
    FROM don_hang dh
    JOIN chi_tiet_don_hang ct ON ct.id_don_hang = dh.id
    WHERE dh.trang_thai IN (?, ?)
      ${whereDate}
    GROUP BY DATE(dh.ngay_dat)
    ORDER BY DATE(dh.ngay_dat)
    `,
    params
  );

  return rows;
}

module.exports = {
  getProductSales,
  getRevenueDaily,
};
