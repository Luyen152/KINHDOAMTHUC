// // service/donHangService.js
// 'use strict';

// const db = require('../db'); // mysql2/promise pool

// /* ===================== Constants ===================== */
// const STATUS = {
//   CART: 'Đang xử lý',
//   PAID: 'Đã thanh toán',
//   CONFIRMED: 'Đã xác nhận',
//   CANCELED: 'Đã hủy',
// };

// /* ===================== Helpers ===================== */

// // Tìm đơn giỏ hiện có (không tạo mới). Nếu trạng thái NULL thì chuẩn hoá về 'Đang xử lý'.
// async function getCartOrderId(userId) {
//   const [rows] = await db.query(
//     "SELECT id, trang_thai FROM don_hang WHERE id_nguoi_dung=? AND (trang_thai=? OR trang_thai IS NULL) ORDER BY id DESC LIMIT 1",
//     [userId, STATUS.CART]
//   );
//   if (!rows.length) return null;
//   const id = rows[0].id;
//   if (rows[0].trang_thai == null) {
//     await db.query("UPDATE don_hang SET trang_thai=? WHERE id=?", [STATUS.CART, id]);
//   }
//   return id;
// }

// // Lấy hoặc tạo đơn giỏ cho user (chỉ dùng khi THÊM MÓN)
// async function getOrCreateCartOrder(userId) {
//   const existed = await getCartOrderId(userId);
//   if (existed) return existed;

//   const [ins] = await db.query(
//     "INSERT INTO don_hang (id_nguoi_dung, ngay_dat, tong_tien, trang_thai) VALUES (?, NOW(), 0, ?)",
//     [userId, STATUS.CART]
//   );
//   return ins.insertId;
// }

// // Tính lại tổng tiền cho 1 đơn
// async function recalcTotal(orderId) {
//   await db.query(
//     `UPDATE don_hang SET tong_tien = (
//        SELECT COALESCE(SUM(so_luong * gia_ban),0)
//        FROM chi_tiet_don_hang
//        WHERE id_don_hang = ?
//      ) WHERE id = ?`,
//     [orderId, orderId]
//   );
// }

// /* ===================== PUBLIC API ===================== */

// // ✅ Thêm hoặc cập nhật món trong giỏ hàng
// // body: { id_nguoi_dung, id_mon_an, so_luong=1, size='vừa' }
// exports.themMon = async ({ id_nguoi_dung, id_mon_an, so_luong = 1, size = 'vừa' }) => {
//   if (!id_nguoi_dung || !id_mon_an) throw new Error('Thiếu id_nguoi_dung hoặc id_mon_an');

//   // 1) Lấy/ tạo đơn giỏ (chỉ thao tác này mới tạo)
//   const id_don_hang = await getOrCreateCartOrder(id_nguoi_dung);

//   // 2) Lấy giá gốc từ dishes và quy đổi theo size
//   const [rows] = await db.query("SELECT gia FROM dishes WHERE id = ?", [id_mon_an]);
//   let gia_ban = Number(rows[0]?.gia || 0);
//   if (size === 'to') gia_ban *= 1.5;
//   else if (size === 'nhỏ') gia_ban *= 0.8;

//   // 3) Thêm/cộng dồn item
//   const [exists] = await db.query(
//     "SELECT id, so_luong FROM chi_tiet_don_hang WHERE id_don_hang=? AND id_mon_an=? AND size=?",
//     [id_don_hang, id_mon_an, size]
//   );

//   if (exists.length) {
//     const newQuantity = Number(exists[0].so_luong) + Number(so_luong);
//     await db.query(
//       "UPDATE chi_tiet_don_hang SET so_luong=?, gia_ban=? WHERE id=?",
//       [newQuantity, gia_ban, exists[0].id]
//     );
//   } else {
//     await db.query(
//       "INSERT INTO chi_tiet_don_hang (id_don_hang, id_mon_an, so_luong, gia_ban, size) VALUES (?, ?, ?, ?, ?)",
//       [id_don_hang, id_mon_an, so_luong, gia_ban, size]
//     );
//   }

//   // 4) Cập nhật tổng tiền
//   await recalcTotal(id_don_hang);

//   return { message: 'Đã thêm vào giỏ hàng', id_don_hang };
// };

// // ✅ Lấy đơn hàng (giỏ) theo người dùng
// exports.layDonHangTheoNguoiDung = async (idNguoiDung) => {
//   const id_don_hang = await getCartOrderId(idNguoiDung);
//   if (!id_don_hang) return null; // controller sẽ trả {chi_tiet:[], tong_tien:0}

//   const [orders] = await db.query("SELECT * FROM don_hang WHERE id=?", [id_don_hang]);
//   const donHang = orders[0];

//   const [chiTiet] = await db.query(
//     `SELECT ct.*, d.name AS ten_mon, d.image AS hinh_anh
//      FROM chi_tiet_don_hang ct
//      JOIN dishes d ON ct.id_mon_an = d.id
//      WHERE ct.id_don_hang = ?`,
//     [id_don_hang]
//   );

//   return { ...donHang, chi_tiet: chiTiet };
// };

// // ✅ Cập nhật số lượng món trong giỏ
// // body: { id_don_hang, id_mon_an, size, so_luong }
// exports.capNhatSoLuongMon = async ({ id_don_hang, id_mon_an, size = 'vừa', so_luong }) => {
//   if (!id_don_hang || !id_mon_an || typeof so_luong !== 'number') {
//     throw new Error('Thiếu tham số hoặc so_luong không hợp lệ');
//   }

//   if (so_luong <= 0) {
//     await db.query(
//       "DELETE FROM chi_tiet_don_hang WHERE id_don_hang=? AND id_mon_an=? AND size=?",
//       [id_don_hang, id_mon_an, size]
//     );
//   } else {
//     await db.query(
//       "UPDATE chi_tiet_don_hang SET so_luong=? WHERE id_don_hang=? AND id_mon_an=? AND size=?",
//       [so_luong, id_don_hang, id_mon_an, size]
//     );
//   }

//   // Cập nhật tổng tiền & xoá đơn nếu trống
//   const [remain] = await db.query(
//     "SELECT COUNT(*) AS c FROM chi_tiet_don_hang WHERE id_don_hang=?",
//     [id_don_hang]
//   );

//   if (remain[0].c === 0) {
//     await db.query("DELETE FROM don_hang WHERE id=?", [id_don_hang]);
//     return { message: 'Giỏ trống, đã xoá đơn hàng' };
//   }

//   await recalcTotal(id_don_hang);
//   return { message: 'Cập nhật số lượng thành công' };
// };

// // ✅ Xoá món khỏi giỏ hàng
// // body: { id_don_hang? , id_nguoi_dung?, id_mon_an, size='vừa' }
// exports.xoaMonKhoiGioHang = async ({ id_don_hang, id_nguoi_dung, id_mon_an, size = 'vừa' }) => {
//   if (!id_don_hang) {
//     if (!id_nguoi_dung) throw new Error('Thiếu id_don_hang hoặc id_nguoi_dung');
//     // KHÔNG tạo mới khi xoá
//     id_don_hang = await getCartOrderId(id_nguoi_dung);
//   }
//   if (!id_don_hang) throw new Error('Không tìm thấy giỏ hàng');
//   if (!id_mon_an) throw new Error('Thiếu id_mon_an');

//   await db.query(
//     "DELETE FROM chi_tiet_don_hang WHERE id_don_hang=? AND id_mon_an=? AND size=?",
//     [id_don_hang, id_mon_an, size]
//   );

//   const [remain] = await db.query(
//     "SELECT COUNT(*) AS c FROM chi_tiet_don_hang WHERE id_don_hang=?",
//     [id_don_hang]
//   );
//   if (remain[0].c === 0) {
//     await db.query("DELETE FROM don_hang WHERE id=?", [id_don_hang]);
//     return { message: 'Đã xoá đơn hàng vì không còn món nào' };
//   }

//   await recalcTotal(id_don_hang);
//   return { message: 'Đã xoá món khỏi giỏ hàng' };
// };

// // ✅ Đếm tổng số lượng món trong giỏ theo user
// exports.demSoLuongTrongGio = async (id_nguoi_dung) => {
//   const id_don_hang = await getCartOrderId(id_nguoi_dung);
//   if (!id_don_hang) return { count: 0 };

//   const [rows] = await db.query(
//     "SELECT COALESCE(SUM(so_luong),0) AS count FROM chi_tiet_don_hang WHERE id_don_hang=?",
//     [id_don_hang]
//   );
//   return { count: rows[0].count || 0 };
// };

// // ✅ Lấy tất cả đơn hàng (admin)
// exports.layTatCaDonHang = async () => {
//   const [orders] = await db.query(`
//     SELECT dh.*, u.name AS ten_nguoi_dung
//     FROM don_hang dh
//     LEFT JOIN users u ON dh.id_nguoi_dung = u.id
//     ORDER BY dh.ngay_dat DESC
//   `);

//   for (const order of orders) {
//     const [details] = await db.query(
//       `SELECT ct.*, d.name AS ten_mon, d.image AS hinh_anh
//        FROM chi_tiet_don_hang ct
//        JOIN dishes d ON ct.id_mon_an = d.id
//        WHERE ct.id_don_hang = ?`,
//       [order.id]
//     );
//     order.chi_tiet = details;
//   }
//   return orders;
// };

// // ✅ Thanh toán: nhận thông tin + đổi trạng thái 'Đã xác nhận'
// /*
//   body: {
//     id_nguoi_dung: number,
//     ho_ten?: string,
//     so_dien_thoai: string,
//     tinh_thanh?: string = 'Thừa Thiên Huế',
//     quan_huyen: string,
//     phuong_xa: string,
//     so_nha?: string,
//     ghi_chu?: string
//   }
// */
// exports.thanhToan = async (body) => {
//   const {
//     id_nguoi_dung, ho_ten,
//     so_dien_thoai, tinh_thanh = 'Thừa Thiên Huế',
//     quan_huyen, phuong_xa, so_nha, ghi_chu
//   } = body || {};

//   if (!id_nguoi_dung) throw new Error('Thiếu id_nguoi_dung');
//   if (!so_dien_thoai) throw new Error('Thiếu số điện thoại');
//   if (!quan_huyen || !phuong_xa) throw new Error('Thiếu quận/huyện hoặc phường/xã');

//   // KHÔNG tạo mới khi thanh toán
//   const id_don_hang = await getCartOrderId(id_nguoi_dung);
//   if (!id_don_hang) throw new Error('Không tìm thấy giỏ hàng để thanh toán');

//   // giỏ phải có item
//   const [has] = await db.query(
//     "SELECT COUNT(*) AS c FROM chi_tiet_don_hang WHERE id_don_hang=?",
//     [id_don_hang]
//   );
//   if ((has[0]?.c || 0) === 0) throw new Error('Giỏ hàng trống');

//   // tính lại tổng trước khi xác nhận
//   await recalcTotal(id_don_hang);

//   const dia_chi_day_du = [so_nha, phuong_xa, quan_huyen, tinh_thanh].filter(Boolean).join(', ');

//   // cập nhật thông tin & đổi trạng thái
//   await db.query(
//     `UPDATE don_hang
//      SET ho_ten=?, so_dien_thoai=?, tinh_thanh=?, quan_huyen=?, phuong_xa=?,
//          so_nha=?, dia_chi_day_du=?, ghi_chu=?,
//          trang_thai=?, ngay_dat=NOW()
//      WHERE id=?`,
//     [ho_ten || null, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa,
//     so_nha || null, dia_chi_day_du, ghi_chu || null, STATUS.CONFIRMED, id_don_hang]
//   );

//   return { ok: true, don_hang_id: id_don_hang, trang_thai: STATUS.CONFIRMED, dia_chi: dia_chi_day_du };
// };

// /* ========== BỔ SUNG CHỨC NĂNG MỚI ========== */

// // ✅ XÓA CẢ ĐƠN TRONG GIỎ (chỉ khi trạng thái 'Đang xử lý')
// exports.xoaDonHangTrongGio = async ({ id_don_hang, id_nguoi_dung }) => {
//   const conn = await db.getConnection();
//   try {
//     await conn.beginTransaction();

//     const [rows] = await conn.query(
//       "SELECT id, trang_thai FROM don_hang WHERE id=? AND id_nguoi_dung=? FOR UPDATE",
//       [id_don_hang, id_nguoi_dung]
//     );
//     if (!rows.length || !(rows[0].trang_thai === STATUS.CART || rows[0].trang_thai == null)) {
//       await conn.rollback();
//       return { ok: false, reason: 'ORDER_NOT_FOUND_OR_NOT_CART' };
//     }

//     await conn.query("DELETE FROM chi_tiet_don_hang WHERE id_don_hang=?", [id_don_hang]);
//     await conn.query("DELETE FROM don_hang WHERE id=?", [id_don_hang]);

//     await conn.commit();
//     return { ok: true };
//   } catch (e) {
//     await conn.rollback();
//     throw e;
//   } finally {
//     conn.release();
//   }
// };

// // ✅ HỦY ĐƠN TRONG 15 PHÚT sau khi thanh toán/xác nhận
// exports.huyDonTrong15Phut = async ({ id_don_hang, id_nguoi_dung }) => {
//   const conn = await db.getConnection();
//   try {
//     await conn.beginTransaction();

//     const [orders] = await conn.query(
//       "SELECT * FROM don_hang WHERE id=? AND id_nguoi_dung=? FOR UPDATE",
//       [id_don_hang, id_nguoi_dung]
//     );
//     if (!orders.length) {
//       await conn.rollback();
//       return { ok: false, reason: 'ORDER_NOT_FOUND' };
//     }
//     const order = orders[0];

//     if (![STATUS.PAID, STATUS.CONFIRMED].includes(order.trang_thai)) {
//       await conn.rollback();
//       return { ok: false, reason: 'INVALID_STATUS' };
//     }

//     // const [[row]] = await conn.query(
//     //   "SELECT TIMESTAMPDIFF(MINUTE, ?, NOW()) AS diff",
//     //   [order.ngay_dat]
//     // );
//     // const diff = Number(row?.diff || 9999);
//     // if (diff > 15) {
//     //   await conn.rollback();
//     //   return { ok: false, reason: 'TIME_WINDOW_EXCEEDED' };
//     // }
//     const [[row]] = await conn.query(
//       "SELECT TIMESTAMPDIFF(SECOND, ngay_dat, NOW()) AS diff_sec FROM don_hang WHERE id=? AND id_nguoi_dung=? FOR UPDATE",
//       [id_don_hang, id_nguoi_dung]
//     );
//     if (Number(row?.diff_sec ?? 999999) > 15 * 60) {
//       await conn.rollback();
//       return { ok: false, reason: 'TIME_WINDOW_EXCEEDED' };
//     }


//     // TODO: hoàn kho / hoàn mã giảm giá (nếu có) tại đây

//     await conn.query(
//       "UPDATE don_hang SET trang_thai=? WHERE id=?",
//       [STATUS.CANCELED, id_don_hang]
//     );

//     await conn.commit();
//     return { ok: true };
//   } catch (e) {
//     await conn.rollback();
//     throw e;
//   } finally {
//     conn.release();
//   }
// };







// service/donHangService.js
'use strict';

const db = require('../db'); // mysql2/promise pool

/* ===================== Constants ===================== */
const STATUS = {
  CART: 'Đang xử lý',
  PAID: 'Đã thanh toán',
  CONFIRMED: 'Đã xác nhận',
  DELIVERED: 'Đã giao',     // nếu bạn không dùng có thể bỏ
  RECEIVED: 'Đã nhận',
  CANCELED: 'Đã hủy',
};

/* ===================== Helpers ===================== */

// Tìm đơn giỏ hiện có (không tạo mới). Nếu trạng thái NULL thì chuẩn hoá về 'Đang xử lý'.
async function getCartOrderId(userId) {
  const [rows] = await db.query(
    `SELECT id, trang_thai
       FROM don_hang
      WHERE id_nguoi_dung = ?
        AND (trang_thai = ? OR trang_thai IS NULL)
   ORDER BY id DESC
      LIMIT 1`,
    [userId, STATUS.CART]
  );
  if (!rows.length) return null;
  const id = rows[0].id;
  if (rows[0].trang_thai == null) {
    await db.query(`UPDATE don_hang SET trang_thai=? WHERE id=?`, [STATUS.CART, id]);
  }
  return id;
}

// Lấy hoặc tạo đơn giỏ cho user (chỉ dùng khi THÊM MÓN)
async function getOrCreateCartOrder(userId) {
  const existed = await getCartOrderId(userId);
  if (existed) return existed;

  const [ins] = await db.query(
    `INSERT INTO don_hang (id_nguoi_dung, ngay_dat, tong_tien, trang_thai)
     VALUES (?, NOW(), 0, ?)`,
    [userId, STATUS.CART]
  );
  return ins.insertId;
}

// Tính lại tổng tiền cho 1 đơn
async function recalcTotal(orderId) {
  await db.query(
    `UPDATE don_hang
        SET tong_tien = (
          SELECT COALESCE(SUM(so_luong * gia_ban), 0)
            FROM chi_tiet_don_hang
           WHERE id_don_hang = ?
        )
      WHERE id = ?`,
    [orderId, orderId]
  );
}

/* ===================== PUBLIC API ===================== */

/** Thêm hoặc cập nhật món trong giỏ
 * body: { id_nguoi_dung, id_mon_an, so_luong=1, size='vừa' }
 */
exports.themMon = async ({ id_nguoi_dung, id_mon_an, so_luong = 1, size = 'vừa' }) => {
  if (!id_nguoi_dung || !id_mon_an) throw new Error('Thiếu id_nguoi_dung hoặc id_mon_an');

  // 1) Lấy/ tạo đơn giỏ (chỉ thao tác này mới tạo)
  const id_don_hang = await getOrCreateCartOrder(id_nguoi_dung);

  // 2) Lấy giá gốc từ dishes và quy đổi theo size
  //    Hỗ trợ cả schema có cột `price` hoặc `gia`
  const [rows] = await db.query(
    `SELECT gia AS base_price
     FROM dishes
    WHERE id = ?
    LIMIT 1`,
    [id_mon_an]
  );

  if (!rows.length) throw new Error('Không tìm thấy món ăn');

  // Lấy giá bán
  let gia_ban = Number(rows[0].base_price || 0);

  // Tính giá theo size
  if (size === 'to') gia_ban *= 1.5;
  else if (size === 'nhỏ') gia_ban *= 0.8;


  // 3) Thêm/cộng dồn item
  const [exists] = await db.query(
    `SELECT id, so_luong
       FROM chi_tiet_don_hang
      WHERE id_don_hang=? AND id_mon_an=? AND size=?`,
    [id_don_hang, id_mon_an, size]
  );

  if (exists.length) {
    const newQuantity = Number(exists[0].so_luong) + Number(so_luong);
    await db.query(
      `UPDATE chi_tiet_don_hang
          SET so_luong=?, gia_ban=?
        WHERE id=?`,
      [newQuantity, gia_ban, exists[0].id]
    );
  } else {
    await db.query(
      `INSERT INTO chi_tiet_don_hang (id_don_hang, id_mon_an, so_luong, gia_ban, size)
       VALUES (?, ?, ?, ?, ?)`,
      [id_don_hang, id_mon_an, so_luong, gia_ban, size]
    );
  }

  // 4) Cập nhật tổng tiền
  await recalcTotal(id_don_hang);

  return { message: 'Đã thêm vào giỏ hàng', id_don_hang };
};

/** Lấy đơn hàng (giỏ) theo id người dùng */
exports.layDonHangTheoNguoiDung = async (idNguoiDung) => {
  const id_don_hang = await getCartOrderId(idNguoiDung);
  if (!id_don_hang) return null; // controller sẽ trả {chi_tiet:[], tong_tien:0}

  const [orders] = await db.query(`SELECT * FROM don_hang WHERE id=?`, [id_don_hang]);
  const donHang = orders[0];

  const [chiTiet] = await db.query(
    `SELECT ct.*, d.name AS ten_mon, d.image AS hinh_anh
       FROM chi_tiet_don_hang ct
       JOIN dishes d ON ct.id_mon_an = d.id
      WHERE ct.id_don_hang = ?`,
    [id_don_hang]
  );

  return { ...donHang, chi_tiet: chiTiet };
};

/** Cập nhật số lượng món trong giỏ
 * body: { id_don_hang, id_mon_an, size, so_luong }
 */
exports.capNhatSoLuongMon = async ({ id_don_hang, id_mon_an, size = 'vừa', so_luong }) => {
  if (!id_don_hang || !id_mon_an || typeof so_luong !== 'number') {
    throw new Error('Thiếu tham số hoặc so_luong không hợp lệ');
  }

  if (so_luong <= 0) {
    await db.query(
      `DELETE FROM chi_tiet_don_hang
        WHERE id_don_hang=? AND id_mon_an=? AND size=?`,
      [id_don_hang, id_mon_an, size]
    );
  } else {
    await db.query(
      `UPDATE chi_tiet_don_hang
          SET so_luong=?
        WHERE id_don_hang=? AND id_mon_an=? AND size=?`,
      [so_luong, id_don_hang, id_mon_an, size]
    );
  }

  // Cập nhật tổng tiền & xoá đơn nếu trống
  const [remain] = await db.query(
    `SELECT COUNT(*) AS c
       FROM chi_tiet_don_hang
      WHERE id_don_hang=?`,
    [id_don_hang]
  );

  if (remain[0].c === 0) {
    await db.query(`DELETE FROM don_hang WHERE id=?`, [id_don_hang]);
    return { message: 'Giỏ trống, đã xoá đơn hàng' };
  }

  await recalcTotal(id_don_hang);
  return { message: 'Cập nhật số lượng thành công' };
};

/** Xoá 1 món khỏi giỏ
 * body: { id_don_hang? , id_nguoi_dung?, id_mon_an, size='vừa' }
 */
exports.xoaMonKhoiGioHang = async ({ id_don_hang, id_nguoi_dung, id_mon_an, size = 'vừa' }) => {
  if (!id_don_hang) {
    if (!id_nguoi_dung) throw new Error('Thiếu id_don_hang hoặc id_nguoi_dung');
    // KHÔNG tạo mới khi xoá
    id_don_hang = await getCartOrderId(id_nguoi_dung);
  }
  if (!id_don_hang) throw new Error('Không tìm thấy giỏ hàng');
  if (!id_mon_an) throw new Error('Thiếu id_mon_an');

  await db.query(
    `DELETE FROM chi_tiet_don_hang
      WHERE id_don_hang=? AND id_mon_an=? AND size=?`,
    [id_don_hang, id_mon_an, size]
  );

  const [remain] = await db.query(
    `SELECT COUNT(*) AS c FROM chi_tiet_don_hang WHERE id_don_hang=?`,
    [id_don_hang]
  );
  if (remain[0].c === 0) {
    await db.query(`DELETE FROM don_hang WHERE id=?`, [id_don_hang]);
    return { message: 'Đã xoá đơn hàng vì không còn món nào' };
  }

  await recalcTotal(id_don_hang);
  return { message: 'Đã xoá món khỏi giỏ hàng' };
};

/** Đếm tổng số lượng món trong giỏ theo user */
exports.demSoLuongTrongGio = async (id_nguoi_dung) => {
  const id_don_hang = await getCartOrderId(id_nguoi_dung);
  if (!id_don_hang) return { count: 0 };

  const [rows] = await db.query(
    `SELECT COALESCE(SUM(so_luong),0) AS count
       FROM chi_tiet_don_hang
      WHERE id_don_hang=?`,
    [id_don_hang]
  );
  return { count: rows[0].count || 0 };
};

/** Lấy tất cả đơn hàng (admin) */
exports.layTatCaDonHang = async () => {
  const [orders] = await db.query(
    `SELECT dh.*, u.name AS ten_nguoi_dung
       FROM don_hang dh
  LEFT JOIN users u ON dh.id_nguoi_dung = u.id
   ORDER BY dh.ngay_dat DESC`
  );

  for (const order of orders) {
    const [details] = await db.query(
      `SELECT ct.*, d.name AS ten_mon, d.image AS hinh_anh
         FROM chi_tiet_don_hang ct
         JOIN dishes d ON ct.id_mon_an = d.id
        WHERE ct.id_don_hang = ?`,
      [order.id]
    );
    order.chi_tiet = details;
  }
  return orders;
};

/** Thanh toán: nhận thông tin + đổi trạng thái 'Đã xác nhận'
 * body: {
 *   id_nguoi_dung, ho_ten?, so_dien_thoai,
 *   tinh_thanh?, quan_huyen, phuong_xa, so_nha?, ghi_chu?
 * }
 */
exports.thanhToan = async (body) => {
  const {
    id_nguoi_dung, ho_ten,
    so_dien_thoai, tinh_thanh = 'Thừa Thiên Huế',
    quan_huyen, phuong_xa, so_nha, ghi_chu
  } = body || {};

  if (!id_nguoi_dung) throw new Error('Thiếu id_nguoi_dung');
  if (!so_dien_thoai) throw new Error('Thiếu số điện thoại');
  if (!quan_huyen || !phuong_xa) throw new Error('Thiếu quận/huyện hoặc phường/xã');

  // KHÔNG tạo mới khi thanh toán
  const id_don_hang = await getCartOrderId(id_nguoi_dung);
  if (!id_don_hang) throw new Error('Không tìm thấy giỏ hàng để thanh toán');

  // giỏ phải có item
  const [has] = await db.query(
    `SELECT COUNT(*) AS c
       FROM chi_tiet_don_hang
      WHERE id_don_hang=?`,
    [id_don_hang]
  );
  if ((has[0]?.c || 0) === 0) throw new Error('Giỏ hàng trống');

  // tính lại tổng trước khi xác nhận
  await recalcTotal(id_don_hang);

  const dia_chi_day_du = [so_nha, phuong_xa, quan_huyen, tinh_thanh].filter(Boolean).join(', ');

  await db.query(
    `UPDATE don_hang
        SET ho_ten=?, so_dien_thoai=?, tinh_thanh=?,
            quan_huyen=?, phuong_xa=?, so_nha=?,
            dia_chi_day_du=?, ghi_chu=?,
            trang_thai=?, ngay_dat=NOW()
      WHERE id=?`,
    [
      ho_ten || null, so_dien_thoai, tinh_thanh,
      quan_huyen, phuong_xa, so_nha || null,
      dia_chi_day_du, ghi_chu || null,
      STATUS.CONFIRMED, id_don_hang
    ]
  );

  return {
    ok: true,
    don_hang_id: id_don_hang,
    trang_thai: STATUS.CONFIRMED,
    dia_chi: dia_chi_day_du
  };
};

/** XÓA CẢ ĐƠN TRONG GIỎ (chỉ khi trạng thái 'Đang xử lý') */
exports.xoaDonHangTrongGio = async ({ id_don_hang, id_nguoi_dung }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT id, trang_thai
         FROM don_hang
        WHERE id=? AND id_nguoi_dung=?
        FOR UPDATE`,
      [id_don_hang, id_nguoi_dung]
    );
    if (!rows.length || !(rows[0].trang_thai === STATUS.CART || rows[0].trang_thai == null)) {
      await conn.rollback();
      return { ok: false, reason: 'ORDER_NOT_FOUND_OR_NOT_CART' };
    }

    await conn.query(`DELETE FROM chi_tiet_don_hang WHERE id_don_hang=?`, [id_don_hang]);
    await conn.query(`DELETE FROM don_hang WHERE id=?`, [id_don_hang]);

    await conn.commit();
    return { ok: true };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

/** HỦY ĐƠN TRONG 15 PHÚT sau khi thanh toán/xác nhận */
exports.huyDonTrong15Phut = async ({ id_don_hang, id_nguoi_dung }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [orders] = await conn.query(
      `SELECT *
         FROM don_hang
        WHERE id=? AND id_nguoi_dung=?
        FOR UPDATE`,
      [id_don_hang, id_nguoi_dung]
    );
    if (!orders.length) {
      await conn.rollback();
      return { ok: false, reason: 'ORDER_NOT_FOUND' };
    }
    const order = orders[0];

    if (![STATUS.PAID, STATUS.CONFIRMED].includes(order.trang_thai)) {
      await conn.rollback();
      return { ok: false, reason: 'INVALID_STATUS' };
    }

    // Thời gian từ khi đặt đến hiện tại <= 15 phút
    const [[row]] = await conn.query(
      `SELECT TIMESTAMPDIFF(SECOND, ngay_dat, NOW()) AS diff_sec
         FROM don_hang
        WHERE id=? AND id_nguoi_dung=?
        FOR UPDATE`,
      [id_don_hang, id_nguoi_dung]
    );
    if (Number(row?.diff_sec ?? 999999) > 15 * 60) {
      await conn.rollback();
      return { ok: false, reason: 'TIME_WINDOW_EXCEEDED' };
    }

    // TODO: hoàn kho / hoàn mã giảm giá (nếu có) tại đây

    await conn.query(
      `UPDATE don_hang SET trang_thai=? WHERE id=?`,
      [STATUS.CANCELED, id_don_hang]
    );

    await conn.commit();
    return { ok: true };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

/** CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Admin/User)
 *  params: { id, trang_thai, id_nguoi_dung? }
 *  Cho phép các trạng thái: CART, CONFIRMED, DELIVERED, RECEIVED, CANCELED
 */
exports.capNhatTrangThai = async ({ id, trang_thai, id_nguoi_dung }) => {
  if (!id || !trang_thai) return { ok: false, reason: 'MISSING_PARAMS' };

  const ALLOW = new Set([
    STATUS.CART,
    STATUS.CONFIRMED,
    STATUS.DELIVERED,
    STATUS.RECEIVED,
    STATUS.CANCELED
  ]);
  if (!ALLOW.has(trang_thai)) return { ok: false, reason: 'INVALID_STATUS' };

  // Nếu cần ràng buộc chỉ owner được đổi, thêm điều kiện id_nguoi_dung vào WHERE.
  // Ở đây mặc định cho Admin tự do đổi; nếu id_nguoi_dung truyền vào thì sẽ check.
  let where = 'id = ?';
  const params = [id];

  if (id_nguoi_dung) {
    where += ' AND id_nguoi_dung = ?';
    params.push(id_nguoi_dung);
  }

  // Nếu chuyển sang "Đã nhận", có thể lưu thời điểm nhận (nếu DB có cột thoi_gian_nhan)
  const setReceivedTime = trang_thai === STATUS.RECEIVED
    ? ', thoi_gian_nhan = NOW()'
    : '';

  const [upd] = await db.query(
    `UPDATE don_hang
        SET trang_thai = ?, updated_at = NOW()${setReceivedTime}
      WHERE ${where}
      LIMIT 1`,
    [trang_thai, ...params]
  );

  if (!upd.affectedRows) return { ok: false, reason: 'ORDER_NOT_FOUND_OR_NO_PERMISSION' };

  const [rows] = await db.query(
    `SELECT id, id_nguoi_dung, trang_thai, dia_chi_day_du AS dia_chi, ngay_dat, tong_tien
       FROM don_hang
      WHERE id=? LIMIT 1`,
    [id]
  );

  return { ok: true, order: rows[0] || null };
};

