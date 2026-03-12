// import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
// import styles from '../styles/cart.module.css';

// const API_BASE = 'http://localhost:5000'; // giữ giống code đang chạy ổn

// /* =======================
//    CONFIG – endpoints địa chỉ
// ======================= */
// const addrGetUrl   = () => `${API_BASE}/api/me/address`;
// const addrSaveUrl  = () => `${API_BASE}/api/me/address`;

// const HUE_DISTRICTS = [
//   'Thành phố Huế', 'Hương Thủy', 'Hương Trà', 'Phong Điền', 'Quảng Điền',
//   'Phú Vang', 'Phú Lộc', 'A Lưới', 'Nam Đông'
// ];
// const HUE_WARDS_BY_DISTRICT = {
//   'Thành phố Huế': [
//     'Phú Nhuận','Phú Hội','Vĩnh Ninh','Thuận Hòa','Thuận Thành','Phú Cát','Phú Hiệp',
//     'Phú Hậu','Tây Lộc','Thủy Biều','Thủy Xuân','An Cựu','An Đông','An Tây','Kim Long',
//     'Hương Sơ','Hương Long','Phường Đúc','Trường An','Phước Vĩnh','Xuân Phú'
//   ]
// };

// // ========= Regex & helpers =========
// const VN_PHONE_REGEX = /^(?:0|\+84)(?:3|5|7|8|9)\d{8}$/; // phổ biến VN
// const onlySpaces = (s) => !String(s || '').trim();
// const safeSize = (s) => (s && String(s).trim()) || 'vừa';

// const Cart = forwardRef(({ onUserLoaded, onCartLoaded }, ref) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [user, setUser] = useState(null);

//   // Modal thanh toán
//   const [showModal, setShowModal] = useState(false);
//   const [hasSavedAddress, setHasSavedAddress] = useState(false);
//   const [autoSaveAddress, setAutoSaveAddress] = useState(true); // lưu lần đầu

//   const [form, setForm] = useState({
//     ho_ten: '',
//     so_dien_thoai: '',
//     tinh_thanh: 'Thừa Thiên Huế',
//     quan_huyen: 'Thành phố Huế',
//     phuong_xa: '',
//     so_nha: '',
//     dia_chi_day_du: '',   // thêm trường khớp DB
//     ghi_chu: ''
//   });

//   // Trạng thái lỗi & touched để hiển thị inline
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   const wards = HUE_WARDS_BY_DISTRICT[form.quan_huyen] || [];

//   const triggerCartUpdate = () => {
//     if (typeof window !== 'undefined') {
//       window.dispatchEvent(new Event('cartUpdated'));
//     }
//   };

//   useEffect(() => {
//     const raw = localStorage.getItem('loggedInUser');
//     if (!raw) return;
//     try {
//       const storedUser = JSON.parse(raw);
//       if (!storedUser?.id) return;
//       setUser(storedUser);
//       onUserLoaded?.(storedUser);
//       fetchCart(storedUser.id);
//       // Tải địa chỉ mặc định để tự điền
//       fetchSavedAddress();
//     } catch (e) {
//       console.error('Không đọc được loggedInUser:', e);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* ===== API helpers ===== */
//   const fetchSavedAddress = async () => {
//     try {
//       const r = await fetch(addrGetUrl(), { headers: { Accept: 'application/json' }, credentials: 'include' });
//       if (!r.ok) return;
//       const data = await r.json();
//       if (data?.address) {
//         setForm(f => ({
//           ...f,
//           ...data.address,
//           tinh_thanh: data.address.tinh_thanh || 'Thừa Thiên Huế',
//           quan_huyen: data.address.quan_huyen || 'Thành phố Huế',
//         }));
//         setHasSavedAddress(true);
//         setAutoSaveAddress(false); // đã có rồi thì không cần hỏi lưu nữa
//       } else {
//         setHasSavedAddress(false);
//         setAutoSaveAddress(true);
//       }
//     } catch (e) {
//       console.warn('Không thể tải địa chỉ mặc định:', e);
//     }
//   };

//   const saveDefaultAddress = async (payload) => {
//     try {
//       const r = await fetch(addrSaveUrl(), {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(payload),
//       });
//       if (!r.ok) throw new Error(`HTTP ${r.status}`);
//       const data = await r.json().catch(() => ({}));
//       if (data?.address) {
//         setHasSavedAddress(true);
//       }
//     } catch (e) {
//       console.warn('Lưu địa chỉ mặc định thất bại:', e);
//     }
//   };

//   const fetchCart = async (userId) => {
//     try {
//       const res = await fetch(`${API_BASE}/api/donhang/${userId}`, {
//         headers: { Accept: 'application/json' }
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       const items = Array.isArray(data?.chi_tiet) ? data.chi_tiet : [];
//       const tong = typeof data?.tong_tien === 'number'
//         ? data.tong_tien
//         : items.reduce((s, it) => s + Number(it.gia_ban || 0) * Number(it.so_luong || 0), 0);
//       setCartItems(items);
//       setTotal(tong);
//       onCartLoaded?.(items);
//       triggerCartUpdate();
//     } catch (err) {
//       console.error('❌ Lỗi khi tải giỏ hàng:', err);
//       setCartItems([]);
//       setTotal(0);
//     }
//   };

//   useImperativeHandle(ref, () => ({
//     reloadCart: () => {
//       if (user?.id) fetchCart(user.id);
//     }
//   }));

//   // ====== Validation ======
//   const buildFullAddress = (f) =>
//     [f.so_nha, f.phuong_xa, f.quan_huyen, f.tinh_thanh].filter(Boolean).join(', ');

//   const validateField = (name, value, all = form) => {
//     switch (name) {
//       case 'ho_ten':
//         if (onlySpaces(value) || String(value).trim().length < 2) return 'Vui lòng nhập họ tên (≥ 2 ký tự).';
//         return '';
//       case 'so_dien_thoai':
//         if (onlySpaces(value)) return 'Vui lòng nhập số điện thoại.';
//         if (!VN_PHONE_REGEX.test(String(value).trim())) return 'SĐT không hợp lệ (VD: 09xxxxxxxx hoặc +84xxxxxxxxx).';
//         return '';
//       case 'quan_huyen':
//         if (onlySpaces(value)) return 'Vui lòng chọn Quận/Huyện.';
//         if (!HUE_DISTRICTS.includes(value)) return 'Quận/Huyện không hợp lệ.';
//         return '';
//       case 'phuong_xa':
//         if (onlySpaces(value)) return 'Vui lòng nhập Phường/Xã.';
//         // Không bắt buộc phải nằm trong gợi ý, nhưng nếu có danh sách thì nhắc
//         if (wards.length && !wards.includes(value)) return 'Phường/Xã không nằm trong gợi ý – vui lòng kiểm tra.';
//         return '';
//       case 'dia_chi_day_du':
//       case 'so_nha': {
//         // Cần ít nhất 1 trong 2: so_nha hoặc dia_chi_day_du
//         const one = String(all.so_nha || '').trim();
//         const two = String(all.dia_chi_day_du || '').trim();
//         if (!one && !two) return 'Nhập Số nhà/đường hoặc Địa chỉ đầy đủ.';
//         return '';
//       }
//       default:
//         return '';
//     }
//   };

//   const validateForm = (current = form) => {
//     const newErrors = {};
//     ['ho_ten', 'so_dien_thoai', 'quan_huyen', 'phuong_xa', 'so_nha', 'dia_chi_day_du'].forEach((k) => {
//       const msg = validateField(k, current[k], current);
//       if (msg) newErrors[k] = msg;
//     });

//     if (!user) newErrors._global = 'Vui lòng đăng nhập trước khi thanh toán.';
//     if (!cartItems?.length || Number(total) <= 0) {
//       newErrors._cart = 'Giỏ hàng trống hoặc tổng tiền không hợp lệ.';
//     }
//     return newErrors;
//   };

//   const scrollToFirstError = () => {
//     const firstErrField = document.querySelector('[data-has-error="true"]');
//     if (firstErrField?.scrollIntoView) {
//       firstErrField.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       firstErrField.focus?.();
//     }
//   };

//   // Live-validate khi người dùng gõ
//   const onChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => {
//       const next = { ...f, [name]: value };
//       if (touched[name]) {
//         setErrors((prev) => ({ ...prev, [name]: validateField(name, value, next) }));
//       }
//       return next;
//     });
//   };

//   const onBlur = (e) => {
//     const { name } = e.target;
//     setTouched((t) => ({ ...t, [name]: true }));
//     setErrors((prev) => ({ ...prev, [name]: validateField(name, form[name], form) }));
//   };

//   const openCheckout = () => {
//     if (!user) return alert('Vui lòng đăng nhập trước khi thanh toán');
//     if (!cartItems?.length) return alert('Giỏ hàng trống');
//     setShowModal(true);
//   };

//   // === Submit Thanh toán ===
//   const submitCheckout = async () => {
//     // chấm dứt submit nếu form lỗi
//     const found = validateForm(form);
//     setErrors(found);
//     // mark tất cả là touched để hiện lỗi
//     setTouched((t) => ({
//       ...t,
//       ho_ten: true,
//       so_dien_thoai: true,
//       quan_huyen: true,
//       phuong_xa: true,
//       so_nha: true,
//       dia_chi_day_du: true
//     }));
//     if (Object.keys(found).length) {
//       const summary = [
//         found._global,
//         found._cart,
//         found.ho_ten,
//         found.so_dien_thoai,
//         found.quan_huyen,
//         found.phuong_xa,
//         found.so_nha || found.dia_chi_day_du
//       ].filter(Boolean).join('\n• ');
//       alert('Vui lòng kiểm tra lại:\n• ' + summary);
//       // cuộn tới lỗi đầu tiên
//       setTimeout(scrollToFirstError, 0);
//       return;
//     }

//     try {
//       // 1) Nếu user CHƯA có địa chỉ mặc định & checkbox đang bật -> lưu mặc định
//       if (!hasSavedAddress && autoSaveAddress) {
//         await saveDefaultAddress({
//           ho_ten: form.ho_ten,
//           so_dien_thoai: form.so_dien_thoai,
//           tinh_thanh: form.tinh_thanh,
//           quan_huyen: form.quan_huyen,
//           phuong_xa: form.phuong_xa,
//           so_nha: form.so_nha,
//           dia_chi_day_du: form.dia_chi_day_du || buildFullAddress(form),
//         });
//       }

//       // 2) Gọi thanh toán
//       const res = await fetch(`${API_BASE}/api/donhang/thanh-toan`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id_nguoi_dung: user.id,
//           ...form,
//           dia_chi_day_du: form.dia_chi_day_du || buildFullAddress(form)
//         })
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.error || 'Thanh toán thất bại');

//       alert('✅ Đã xác nhận đơn hàng!');
//       setShowModal(false);
//       await fetchCart(user.id); // giỏ rỗng sau khi xác nhận
//     } catch (e) {
//       console.error('Thanh toán lỗi:', e);
//       alert('❌ ' + e.message);
//     }
//   };

//   const updateQuantity = async (item, delta) => {
//     const newQuantity = Number(item.so_luong || 0) + Number(delta);
//     if (newQuantity <= 0) return handleDelete(item);

//     try {
//       const res = await fetch(`${API_BASE}/api/donhang/cap-nhat`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id_don_hang: item.id_don_hang,
//           id_mon_an: item.id_mon_an,
//           size: safeSize(item.size),
//           so_luong: newQuantity
//         })
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       await fetchCart(user.id);
//     } catch (err) {
//       console.error('⚠️ Lỗi cập nhật số lượng:', err);
//       alert('⚠️ Lỗi cập nhật số lượng!');
//     }
//   };

//   const handleDelete = async (item) => {
//     if (!confirm('Bạn muốn xoá món này khỏi giỏ hàng?')) return;

//     try {
//       const res = await fetch(`${API_BASE}/api/donhang/xoa-mon`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id_don_hang: item.id_don_hang,
//           id_mon_an: item.id_mon_an,
//           size: safeSize(item.size)
//         })
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       await fetchCart(user.id);
//     } catch (err) {
//       console.error('❌ Lỗi xoá món:', err);
//       alert('❌ Lỗi xoá món!');
//     }
//   };

//   // Tạo class lỗi tiện dụng
//   const inputClass = (name) =>
//     `${styles.input || ''} ${touched[name] && errors[name] ? (styles.inputError || 'input-error') : ''}`.trim();

//   const hasErrAttr = (name) => (touched[name] && errors[name] ? 'true' : 'false');

//   return (
//     <div className={styles.container}>
//       <h1>🛒 Giỏ hàng của bạn</h1>
//       {cartItems.length === 0 ? (
//         <p>Chưa có món nào trong giỏ hàng.</p>
//       ) : (
//         <>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Món ăn</th>
//                 <th>Size</th>
//                 <th>Số lượng</th>
//                 <th>Giá bán</th>
//                 <th>Thao tác</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map(item => (
//                 <tr key={`${item.id_mon_an}-${safeSize(item.size)}`}>
//                   <td>{item.ten_mon}</td>
//                   <td>{safeSize(item.size)}</td>
//                   <td>
//                     <button onClick={() => updateQuantity(item, -1)}>-</button>
//                     <span style={{ margin: '0 10px' }}>{item.so_luong}</span>
//                     <button onClick={() => updateQuantity(item, 1)}>+</button>
//                   </td>
//                   <td>{Number(item.gia_ban || 0).toLocaleString('vi-VN')}₫</td>
//                   <td>
//                     <button onClick={() => handleDelete(item)}>❌</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className={styles.footer}>
//             <h3 className={styles.total}>Tổng cộng: {Number(total || 0).toLocaleString('vi-VN')}₫</h3>
//             <button className={styles.checkoutBtn} onClick={openCheckout}>Thanh toán</button>
//           </div>
//         </>
//       )}

//       {/* Modal thanh toán */}
//       {showModal && (
//         <div className={styles.modalBackdrop}>
//           <div className={styles.modal}>
//             <h2>Thông tin nhận hàng</h2>

//             {/* Thông báo lỗi tổng quát nếu có */}
//             {(errors._global || errors._cart) && (
//               <div className={styles.alertError || ''} style={{ marginBottom: 8 }}>
//                 {errors._global || errors._cart}
//               </div>
//             )}

//             <label>Họ tên *</label>
//             <input
//               name="ho_ten"
//               value={form.ho_ten}
//               onChange={onChange}
//               onBlur={onBlur}
//               placeholder="Nguyễn Văn A"
//               className={inputClass('ho_ten')}
//               data-has-error={hasErrAttr('ho_ten')}
//               aria-invalid={touched.ho_ten && !!errors.ho_ten}
//             />
//             {touched.ho_ten && errors.ho_ten && <div className={styles.errorMsg || ''}>{errors.ho_ten}</div>}

//             <label>Số điện thoại *</label>
//             <input
//               name="so_dien_thoai"
//               value={form.so_dien_thoai}
//               onChange={onChange}
//               onBlur={onBlur}
//               placeholder="09xx... hoặc +84..."
//               className={inputClass('so_dien_thoai')}
//               data-has-error={hasErrAttr('so_dien_thoai')}
//               aria-invalid={touched.so_dien_thoai && !!errors.so_dien_thoai}
//               inputMode="tel"
//               autoComplete="tel"
//             />
//             {touched.so_dien_thoai && errors.so_dien_thoai && <div className={styles.errorMsg || ''}>{errors.so_dien_thoai}</div>}

//             <label>Tỉnh/Thành phố</label>
//             <input
//               name="tinh_thanh"
//               value={form.tinh_thanh}
//               onChange={onChange}
//               onBlur={onBlur}
//               className={styles.input || ''}
//             />

//             <label>Quận/Huyện *</label>
//             <select
//               name="quan_huyen"
//               value={form.quan_huyen}
//               onChange={(e) => {
//                 const v = e.target.value;
//                 setForm(f => ({ ...f, quan_huyen: v, phuong_xa: '' }));
//                 setTouched(t => ({ ...t, quan_huyen: true, phuong_xa: false }));
//                 setErrors(prev => ({
//                   ...prev,
//                   quan_huyen: validateField('quan_huyen', v),
//                   phuong_xa: '' // reset lỗi phường khi đổi quận
//                 }));
//               }}
//               onBlur={onBlur}
//               className={inputClass('quan_huyen')}
//               data-has-error={hasErrAttr('quan_huyen')}
//               aria-invalid={touched.quan_huyen && !!errors.quan_huyen}
//             >
//               {HUE_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
//             </select>
//             {touched.quan_huyen && errors.quan_huyen && <div className={styles.errorMsg || ''}>{errors.quan_huyen}</div>}

//             <label>Phường/Xã *</label>
//             <input
//               name="phuong_xa"
//               value={form.phuong_xa}
//               onChange={onChange}
//               onBlur={onBlur}
//               list="wards"
//               placeholder="Chọn/nhập phường xã"
//               className={inputClass('phuong_xa')}
//               data-has-error={hasErrAttr('phuong_xa')}
//               aria-invalid={touched.phuong_xa && !!errors.phuong_xa}
//             />
//             <datalist id="wards">
//               {wards.map(w => <option key={w} value={w} />)}
//             </datalist>
//             {touched.phuong_xa && errors.phuong_xa && <div className={styles.errorMsg || ''}>{errors.phuong_xa}</div>}

//             <label>Số nhà, đường (hoặc nhập địa chỉ đầy đủ)</label>
//             <input
//               name="so_nha"
//               value={form.so_nha}
//               onChange={onChange}
//               onBlur={onBlur}
//               placeholder="12 Nguyễn Huệ..."
//               className={inputClass('so_nha')}
//               data-has-error={hasErrAttr('so_nha')}
//               aria-invalid={touched.so_nha && !!errors.so_nha}
//             />
//             {touched.so_nha && errors.so_nha && <div className={styles.errorMsg || ''}>{errors.so_nha}</div>}

//             <label>Địa chỉ đầy đủ (tùy chọn)</label>
//             <input
//               name="dia_chi_day_du"
//               value={form.dia_chi_day_du}
//               onChange={onChange}
//               onBlur={onBlur}
//               placeholder="Tự động ghép nếu để trống"
//               className={inputClass('dia_chi_day_du')}
//               data-has-error={hasErrAttr('dia_chi_day_du')}
//               aria-invalid={touched.dia_chi_day_du && !!errors.dia_chi_day_du}
//             />
//             {touched.dia_chi_day_du && errors.dia_chi_day_du && <div className={styles.errorMsg || ''}>{errors.dia_chi_day_du}</div>}

//             <label>Ghi chú</label>
//             <textarea
//               name="ghi_chu"
//               value={form.ghi_chu}
//               onChange={onChange}
//               onBlur={onBlur}
//               placeholder="Gọi trước khi giao..."
//               className={styles.textarea || ''}
//             />

//             {!hasSavedAddress && (
//               <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
//                 <input
//                   type="checkbox"
//                   checked={autoSaveAddress}
//                   onChange={(e) => setAutoSaveAddress(e.target.checked)}
//                 />
//                 Lưu làm địa chỉ mặc định cho lần sau
//               </label>
//             )}

//             <div className={styles.modalActions}>
//               <button onClick={() => setShowModal(false)}>Hủy</button>
//               <button onClick={submitCheckout} className={styles.primary}>Xác nhận thanh toán</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// });

// export default Cart;






// nextjs/components/Cart.js
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import styles from '../styles/cart.module.css';

import {
  getLoggedInUser,
  getMyAddress,
  putMyAddress,
  getCart,
  updateCartItem,
  removeCartItem,
  checkout,
} from '../lib/api/save';

const HUE_DISTRICTS = [
  'Thành phố Huế', 'Hương Thủy', 'Hương Trà', 'Phong Điền', 'Quảng Điền',
  'Phú Vang', 'Phú Lộc', 'A Lưới', 'Nam Đông'
];
const HUE_WARDS_BY_DISTRICT = {
  'Thành phố Huế': [
    'Phú Nhuận','Phú Hội','Vĩnh Ninh','Thuận Hòa','Thuận Thành','Phú Cát','Phú Hiệp',
    'Phú Hậu','Tây Lộc','Thủy Biều','Thủy Xuân','An Cựu','An Đông','An Tây','Kim Long',
    'Hương Sơ','Hương Long','Phường Đúc','Trường An','Phước Vĩnh','Xuân Phú'
  ]
};

const VN_PHONE_REGEX = /^(?:0|\+84)(?:3|5|7|8|9)\d{8}$/;
const onlySpaces = (s) => !String(s || '').trim();
const safeSize = (s) => (s && String(s).trim()) || 'vừa';
const ADDRESS_SAVED_EVENT = 'address:saved';

const Cart = forwardRef(({ onUserLoaded, onCartLoaded }, ref) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [autoSaveAddress, setAutoSaveAddress] = useState(true);

  const [form, setForm] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    tinh_thanh: 'Thừa Thiên Huế',
    quan_huyen: 'Thành phố Huế',
    phuong_xa: '',
    so_nha: '',
    dia_chi_day_du: '',
    ghi_chu: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const wards = HUE_WARDS_BY_DISTRICT[form.quan_huyen] || [];

  const triggerCartUpdate = () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('cartUpdated'));
  };

  useEffect(() => {
    const storedUser = getLoggedInUser();
    if (!storedUser?.id) return;
    setUser(storedUser);
    onUserLoaded?.(storedUser);
    fetchCartData(storedUser.id);
    fetchSavedAddress(storedUser.id);

    // Đồng bộ khi trang tài khoản vừa lưu
    const onAddrSaved = (e) => {
      const addr = e?.detail?.address || null;
      if (addr) {
        setForm((f) => ({
          ...f,
          ...addr,
          tinh_thanh: addr.tinh_thanh || 'Thừa Thiên Huế',
          quan_huyen: addr.quan_huyen || 'Thành phố Huế',
        }));
        setHasSavedAddress(true);
        setAutoSaveAddress(false);
      }
    };
    window.addEventListener(ADDRESS_SAVED_EVENT, onAddrSaved);
    return () => window.removeEventListener(ADDRESS_SAVED_EVENT, onAddrSaved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSavedAddress = async (userId) => {
    try {
      const { address } = await getMyAddress(userId);
      if (address) {
        setForm((f) => ({
          ...f,
          ...address,
          tinh_thanh: address.tinh_thanh || 'Thừa Thiên Huế',
          quan_huyen: address.quan_huyen || 'Thành phố Huế',
        }));
        setHasSavedAddress(true);
        setAutoSaveAddress(false);
      } else {
        setHasSavedAddress(false);
        setAutoSaveAddress(true);
      }
    } catch {
      setHasSavedAddress(false);
      setAutoSaveAddress(true);
    }
  };

  const fetchCartData = async (userId) => {
    try {
      const data = await getCart(userId);
      const items = Array.isArray(data?.chi_tiet) ? data.chi_tiet : [];
      const tong = Number.isFinite(Number(data?.tong_tien))
        ? Number(data.tong_tien)
        : items.reduce((s, it) => s + Number(it.gia_ban || 0) * Number(it.so_luong || 0), 0);
      setCartItems(items);
      setTotal(tong);
      onCartLoaded?.(items);
      triggerCartUpdate();
    } catch (err) {
      console.error('❌ Lỗi khi tải giỏ hàng:', err);
      setCartItems([]);
      setTotal(0);
    }
  };

  useImperativeHandle(ref, () => ({
    reloadCart: () => { if (user?.id) fetchCartData(user.id); }
  }));

  // ====== Validation ======
  const buildFullAddress = (f) =>
    [f.so_nha, f.phuong_xa, f.quan_huyen, f.tinh_thanh].filter(Boolean).join(', ');

  const validateField = (name, value, all = form) => {
    switch (name) {
      case 'ho_ten':
        if (onlySpaces(value) || String(value).trim().length < 2) return 'Vui lòng nhập họ tên (≥ 2 ký tự).';
        return '';
      case 'so_dien_thoai':
        if (onlySpaces(value)) return 'Vui lòng nhập số điện thoại.';
        if (!VN_PHONE_REGEX.test(String(value).trim())) return 'SĐT không hợp lệ (VD: 09xxxxxxxx hoặc +84xxxxxxxxx).';
        return '';
      case 'quan_huyen':
        if (onlySpaces(value)) return 'Vui lòng chọn Quận/Huyện.';
        if (!HUE_DISTRICTS.includes(value)) return 'Quận/Huyện không hợp lệ.';
        return '';
      case 'phuong_xa':
        if (onlySpaces(value)) return 'Vui lòng nhập Phường/Xã.';
        if (wards.length && !wards.includes(value)) return 'Phường/Xã không nằm trong gợi ý – vui lòng kiểm tra.';
        return '';
      case 'dia_chi_day_du':
      case 'so_nha': {
        const one = String(all.so_nha || '').trim();
        const two = String(all.dia_chi_day_du || '').trim();
        if (!one && !two) return 'Nhập Số nhà/đường hoặc Địa chỉ đầy đủ.';
        return '';
      }
      default:
        return '';
    }
  };

  const validateForm = (current = form) => {
    const newErrors = {};
    ['ho_ten', 'so_dien_thoai', 'quan_huyen', 'phuong_xa', 'so_nha', 'dia_chi_day_du'].forEach((k) => {
      const msg = validateField(k, current[k], current);
      if (msg) newErrors[k] = msg;
    });
    if (!user) newErrors._global = 'Vui lòng đăng nhập trước khi thanh toán.';
    if (!cartItems?.length || Number(total) <= 0) newErrors._cart = 'Giỏ hàng trống hoặc tổng tiền không hợp lệ.';
    return newErrors;
  };

  const scrollToFirstError = () => {
    const firstErrField = document.querySelector('[data-has-error="true"]');
    firstErrField?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    firstErrField?.focus?.();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, value, next) }));
      return next;
    });
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, form[name], form) }));
  };

  const openCheckout = () => {
    if (!user) return alert('Vui lòng đăng nhập trước khi thanh toán');
    if (!cartItems?.length) return alert('Giỏ hàng trống');
    setShowModal(true);
  };

  // === Submit Thanh toán ===
  const submitCheckout = async () => {
    const found = validateForm(form);
    setErrors(found);
    setTouched((t) => ({ ...t, ho_ten: true, so_dien_thoai: true, quan_huyen: true, phuong_xa: true, so_nha: true, dia_chi_day_du: true }));
    if (Object.keys(found).length) {
      const summary = [
        found._global, found._cart, found.ho_ten, found.so_dien_thoai,
        found.quan_huyen, found.phuong_xa, found.so_nha || found.dia_chi_day_du
      ].filter(Boolean).join('\n• ');
      alert('Vui lòng kiểm tra lại:\n• ' + summary);
      setTimeout(scrollToFirstError, 0);
      return;
    }

    try {
      const fullAddress = form.dia_chi_day_du?.trim() || buildFullAddress(form);

      // 1) Nếu chưa có địa chỉ mặc định & user cho phép -> lưu vào /api/me
      if (!hasSavedAddress && autoSaveAddress) {
        await putMyAddress({
          ho_ten: form.ho_ten,
          so_dien_thoai: form.so_dien_thoai,
          tinh_thanh: form.tinh_thanh,
          quan_huyen: form.quan_huyen,
          phuong_xa: form.phuong_xa,
          so_nha: form.so_nha,
          dia_chi_day_du: fullAddress,
          id_nguoi_dung: user.id,
        });
        setHasSavedAddress(true);
        // phát event để các trang khác (Account) đồng bộ ngay
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent(ADDRESS_SAVED_EVENT, {
              detail: { address: { ...form, dia_chi_day_du: fullAddress } },
            })
          );
        }
      }

      // 2) Gọi API /api/donhang/thanh-toan (đúng chữ ký trong save.js)
      await checkout({ userId: user.id, form: { ...form, dia_chi_day_du: fullAddress } });

      alert('✅ Đã xác nhận đơn hàng!');
      setShowModal(false);
      await fetchCartData(user.id);
    } catch (e) {
      console.error('Thanh toán lỗi:', e);
      alert('❌ ' + e.message);
    }
  };

  const updateQuantity = async (item, delta) => {
    const newQuantity = Number(item.so_luong || 0) + Number(delta);
    if (newQuantity <= 0) return handleDelete(item);
    try {
      await updateCartItem({
        id_don_hang: item.id_don_hang,
        id_mon_an: item.id_mon_an,
        size: safeSize(item.size),
        so_luong: newQuantity,
      });
      await fetchCartData(user.id);
    } catch (err) {
      console.error('⚠️ Lỗi cập nhật số lượng:', err);
      alert('⚠️ Lỗi cập nhật số lượng!');
    }
  };

  const handleDelete = async (item) => {
    if (!confirm('Bạn muốn xoá món này khỏi giỏ hàng?')) return;
    try {
      await removeCartItem({
        id_don_hang: item.id_don_hang,
        id_nguoi_dung: user.id,          // <- đúng chữ ký trong save.js
        id_mon_an: item.id_mon_an,
        size: safeSize(item.size),
      });
      await fetchCartData(user.id);
    } catch (err) {
      console.error('❌ Lỗi xoá món:', err);
      alert('❌ Lỗi xoá món!');
    }
  };

  const inputClass = (name) =>
    `${styles.input || ''} ${touched[name] && errors[name] ? (styles.inputError || 'input-error') : ''}`.trim();
  const hasErrAttr = (name) => (touched[name] && errors[name] ? 'true' : 'false');

  return (
    <div className={styles.container}>
      <h1>🛒 Giỏ hàng của bạn</h1>
      {cartItems.length === 0 ? (
        <p>Chưa có món nào trong giỏ hàng.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Món ăn</th>
                <th>Size</th>
                <th>Số lượng</th>
                <th>Giá bán</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={`${item.id_mon_an}-${safeSize(item.size)}`}>
                  <td>{item.ten_mon}</td>
                  <td>{safeSize(item.size)}</td>
                  <td>
                    <button onClick={() => updateQuantity(item, -1)}>-</button>
                    <span style={{ margin: '0 10px' }}>{item.so_luong}</span>
                    <button onClick={() => updateQuantity(item, 1)}>+</button>
                  </td>
                  <td>{Number(item.gia_ban || 0).toLocaleString('vi-VN')}₫</td>
                  <td><button onClick={() => handleDelete(item)}>❌</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.footer}>
            <h3 className={styles.total}>Tổng cộng: {Number(total || 0).toLocaleString('vi-VN')}₫</h3>
            <button className={styles.checkoutBtn} onClick={openCheckout}>Thanh toán</button>
          </div>
        </>
      )}

      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h2>Thông tin nhận hàng</h2>

            {(errors._global || errors._cart) && (
              <div className={styles.alertError || ''} style={{ marginBottom: 8 }}>
                {errors._global || errors._cart}
              </div>
            )}

            <label>Họ tên *</label>
            <input
              name="ho_ten"
              value={form.ho_ten}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Nguyễn Văn A"
              className={inputClass('ho_ten')}
              data-has-error={hasErrAttr('ho_ten')}
              aria-invalid={touched.ho_ten && !!errors.ho_ten}
            />
            {touched.ho_ten && errors.ho_ten && <div className={styles.errorMsg || ''}>{errors.ho_ten}</div>}

            <label>Số điện thoại *</label>
            <input
              name="so_dien_thoai"
              value={form.so_dien_thoai}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="09xx... hoặc +84..."
              className={inputClass('so_dien_thoai')}
              data-has-error={hasErrAttr('so_dien_thoai')}
              aria-invalid={touched.so_dien_thoai && !!errors.so_dien_thoai}
              inputMode="tel"
              autoComplete="tel"
            />
            {touched.so_dien_thoai && errors.so_dien_thoai && <div className={styles.errorMsg || ''}>{errors.so_dien_thoai}</div>}

            <label>Tỉnh/Thành phố</label>
            <input name="tinh_thanh" value={form.tinh_thanh} onChange={onChange} onBlur={onBlur} className={styles.input || ''} />

            <label>Quận/Huyện *</label>
            <select
              name="quan_huyen"
              value={form.quan_huyen}
              onChange={(e) => {
                const v = e.target.value;
                setForm(f => ({ ...f, quan_huyen: v, phuong_xa: '' }));
                setTouched(t => ({ ...t, quan_huyen: true, phuong_xa: false }));
                setErrors(prev => ({ ...prev, quan_huyen: validateField('quan_huyen', v), phuong_xa: '' }));
              }}
              onBlur={onBlur}
              className={inputClass('quan_huyen')}
              data-has-error={hasErrAttr('quan_huyen')}
              aria-invalid={touched.quan_huyen && !!errors.quan_huyen}
            >
              {HUE_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {touched.quan_huyen && errors.quan_huyen && <div className={styles.errorMsg || ''}>{errors.quan_huyen}</div>}

            <label>Phường/Xã *</label>
            <input
              name="phuong_xa"
              value={form.phuong_xa}
              onChange={onChange}
              onBlur={onBlur}
              list="wards"
              placeholder="Chọn/nhập phường xã"
              className={inputClass('phuong_xa')}
              data-has-error={hasErrAttr('phuong_xa')}
              aria-invalid={touched.phuong_xa && !!errors.phuong_xa}
            />
            <datalist id="wards">{(HUE_WARDS_BY_DISTRICT[form.quan_huyen] || []).map(w => <option key={w} value={w} />)}</datalist>
            {touched.phuong_xa && errors.phuong_xa && <div className={styles.errorMsg || ''}>{errors.phuong_xa}</div>}

            <label>Số nhà, đường (hoặc nhập địa chỉ đầy đủ)</label>
            <input
              name="so_nha"
              value={form.so_nha}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="12 Nguyễn Huệ..."
              className={inputClass('so_nha')}
              data-has-error={hasErrAttr('so_nha')}
              aria-invalid={touched.so_nha && !!errors.so_nha}
            />
            {touched.so_nha && errors.so_nha && <div className={styles.errorMsg || ''}>{errors.so_nha}</div>}

            <label>Địa chỉ đầy đủ (tùy chọn)</label>
            <input
              name="dia_chi_day_du"
              value={form.dia_chi_day_du}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Tự động ghép nếu để trống"
              className={inputClass('dia_chi_day_du')}
              data-has-error={hasErrAttr('dia_chi_day_du')}
              aria-invalid={touched.dia_chi_day_du && !!errors.dia_chi_day_du}
            />
            {touched.dia_chi_day_du && errors.dia_chi_day_du && <div className={styles.errorMsg || ''}>{errors.dia_chi_day_du}</div>}

            <label>Ghi chú</label>
            <textarea name="ghi_chu" value={form.ghi_chu} onChange={onChange} onBlur={onBlur} placeholder="Gọi trước khi giao..." className={styles.textarea || ''} />

            {!hasSavedAddress && (
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                <input type="checkbox" checked={autoSaveAddress} onChange={(e) => setAutoSaveAddress(e.target.checked)} />
                Lưu làm địa chỉ mặc định cho lần sau
              </label>
            )}

            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)}>Hủy</button>
              <button onClick={submitCheckout} className={styles.primary}>Xác nhận thanh toán</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Cart;
