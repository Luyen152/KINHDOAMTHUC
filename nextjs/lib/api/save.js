// /lib/api/save.js
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'https://kinhdoamthuc.onrender.com';
// 👉 Bật gửi cookie nếu thật sự cần (đã cấu hình CORS bên BE)
// .env.local: NEXT_PUBLIC_WITH_CREDENTIALS=1
const WITH_CREDENTIALS =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_WITH_CREDENTIALS === '1';

/* --------------------- fetch helpers --------------------- */
async function apiFetch(path, { method = 'GET', body, headers, ...rest } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: WITH_CREDENTIALS ? 'include' : 'omit',
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });
  return res;
}

async function apiJSON(path, method, body, opts) {
  const res = await apiFetch(path, { method, body, ...(opts || {}) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `${method} ${path} failed`);
  return data;
}

/* ----------------- localStorage helpers ------------------ */
export const LS_USER_KEY = 'loggedInUser';
export const LS_LAST_ORDER_KEY = 'lastOrder';

export function getLoggedInUser() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(LS_USER_KEY) || 'null'); }
  catch { return null; }
}
export function setLoggedInUser(u) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_USER_KEY, JSON.stringify(u || null));
}

export function getLastOrder() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(LS_LAST_ORDER_KEY) || 'null'); }
  catch { return null; }
}
export function setLastOrder(o) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_LAST_ORDER_KEY, JSON.stringify(o || null));
}
export function clearLastOrder() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LS_LAST_ORDER_KEY);
}

/* ---------------------- Address API ---------------------- */
export async function getMyAddress(userId) {
  const qs = userId ? `?id_nguoi_dung=${encodeURIComponent(userId)}` : '';
  const res = await apiFetch(`/api/me/address${qs}`, { method: 'GET' });
  if (!res.ok) return { address: null };
  return res.json(); // { address: {...} | null }
}

export function putMyAddress(payload) {
  // payload phải có id_nguoi_dung
  return apiJSON('/api/me/address', 'PUT', payload);
}

/* ------------------- Orders / Cart API ------------------- */
// Lấy giỏ/đơn hiện tại của user
export async function getCart(userId) {
  const res = await apiFetch(`/api/donhang/${userId}`, { method: 'GET' });
  if (!res.ok) throw new Error('GET_CART_FAILED');
  return res.json();
}

// Cập nhật 1 món trong giỏ
export function updateCartItem({ id_don_hang, id_mon_an, size = 'vừa', so_luong }) {
  return apiJSON('/api/donhang/cap-nhat', 'PUT', { id_don_hang, id_mon_an, size, so_luong });
}

// Xoá 1 món khỏi giỏ
export function removeCartItem({ id_don_hang, id_nguoi_dung, id_mon_an, size = 'vừa' }) {
  return apiJSON('/api/donhang/xoa-mon', 'DELETE', { id_don_hang, id_nguoi_dung, id_mon_an, size });
}

// Thanh toán (tạo đơn)
export async function checkout({ userId, form }) {
  const payload = {
    id_nguoi_dung: userId,
    ...form,
    dia_chi_day_du:
      form.dia_chi_day_du ||
      [form.so_nha, form.phuong_xa, form.quan_huyen, form.tinh_thanh]
        .filter(Boolean)
        .join(', '),
  };
  const data = await apiJSON('/api/donhang/thanh-toan', 'POST', payload);
  const last = {
    id: data.don_hang_id,
    status: data.trang_thai,
    dia_chi: data.dia_chi,
    placedAt: Date.now(),
  };
  setLastOrder(last);
  return last;
}

// Huỷ đơn trong 15 phút
export function cancelOrderWithin15m(orderId, userId) {
  return apiJSON(`/api/donhang/huy/${orderId}`, 'POST', { id_nguoi_dung: userId });
}

// Xoá cả giỏ
export function deleteCartOrder(orderId, userId) {
  return apiJSON(`/api/donhang/gio/${orderId}`, 'DELETE', { id_nguoi_dung: userId });
}

/* -------- NEW: Xác nhận KHÁCH ĐÃ NHẬN HÀNG + Admin list -------- */
// Khách/adm xác nhận đã nhận hàng -> chuyển trạng thái "Đã nhận"
export function confirmOrderDelivered(orderId, userId) {
  return apiJSON(`/api/donhang/cap-nhat-trang-thai`, 'PUT', {
    id: orderId,
    id_nguoi_dung: userId,          // BE có thể không cần; gửi kèm cũng không sao
    trang_thai: 'Đã nhận',
  });
}

// Admin lấy danh sách đơn (dùng API sẵn có)
export async function adminFetchOrders() {
  const res = await apiFetch(`/api/donhang/all`, { method: 'GET' });
  if (!res.ok) throw new Error('ADMIN_LIST_ORDERS_FAILED');
  const data = await res.json().catch(() => ({}));
  return data || [];
}

/* -------------------- KHÔNG export default -------------------- */
