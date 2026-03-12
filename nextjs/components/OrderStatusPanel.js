// // nextjs/components/OrderStatusPanel.js
// import { useEffect, useMemo, useState } from 'react';
// import {
//   getLoggedInUser, getLastOrder, setLastOrder, clearLastOrder,
//   getCart, deleteCartOrder, cancelOrderWithin15m, confirmOrderDelivered
// } from '../lib/api/save';

// const MIN15 = 15 * 60 * 1000;

// export default function OrderStatusPanel() {
//   const [user, setUser] = useState(null);
//   const [cart, setCart] = useState(null);
//   const [lastOrder, setLO] = useState(null);
//   const [tick, setTick] = useState(Date.now());
//   const [msg, setMsg] = useState('');

//   useEffect(() => { setUser(getLoggedInUser() || null); }, []);
//   useEffect(() => {
//     if (!user?.id) return;
//     (async () => {
//       try { setCart(await getCart(user.id)); } catch {}
//       setLO(getLastOrder());
//     })();
//   }, [user?.id]);
//   useEffect(() => {
//     const t = setInterval(() => setTick(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const remainingMs = useMemo(() => {
//     if (!lastOrder?.placedAt) return 0;
//     return Math.max(0, MIN15 - (Date.now() - Number(lastOrder.placedAt)));
//   }, [lastOrder?.placedAt, tick]);

//   const remainingText = useMemo(() => {
//     const s = Math.ceil(remainingMs / 1000);
//     return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
//   }, [remainingMs]);

//   const canCancel =
//     lastOrder && remainingMs > 0 && ['Đã xác nhận','Đã thanh toán'].includes(lastOrder.status);

//   // Cho phép xác nhận đã nhận nếu chưa bị hủy & chưa "Đã nhận"
//   const canConfirmReceived =
//     lastOrder && !['Đã hủy','Đã nhận'].includes(lastOrder.status);

//   const handleCancel = async () => {
//     if (!user?.id || !lastOrder?.id) return;
//     if (!confirm('Bạn chắc muốn hủy đơn?')) return;
//     setMsg('');
//     try {
//       const r = await cancelOrderWithin15m(lastOrder.id, user.id);
//       setMsg('✅ ' + (r?.message || 'Đã hủy đơn.'));
//       setLastOrder({ ...lastOrder, status: 'Đã hủy' });
//       setLO(getLastOrder());
//     } catch (e) {
//       setMsg('❌ ' + (e?.response?.data?.error || e.message));
//     }
//   };

//   // Xác nhận KHÁCH ĐÃ NHẬN HÀNG -> trạng thái "Đã nhận"
//   const handleConfirmDelivered = async () => {
//     if (!user?.id || !lastOrder?.id) return;
//     setMsg('');
//     try {
//       await confirmOrderDelivered(lastOrder.id, user.id); // hàm này sẽ gọi /api/donhang/cap-nhat-trang-thai
//       setMsg('✅ Cảm ơn! Đơn đã được đánh dấu ĐÃ NHẬN.');
//       setLastOrder({ ...lastOrder, status: 'Đã nhận' });
//       setLO(getLastOrder());
//     } catch (e) {
//       setMsg('❌ ' + (e?.response?.data?.error || e.message));
//     }
//   };

//   const handleDeleteCart = async () => {
//     if (!user?.id || !cart?.id) return;
//     if (!confirm('Xóa toàn bộ giỏ hàng?')) return;
//     setMsg('');
//     try {
//       const r = await deleteCartOrder(cart.id, user.id);
//       setMsg('✅ ' + (r?.message || 'Đã xóa giỏ'));
//       setCart({ chi_tiet: [], tong_tien: 0, trang_thai: 'Đang xử lý' });
//     } catch (e) {
//       setMsg('❌ ' + (e?.response?.data?.error || e.message));
//     }
//   };

//   return (
//     <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
//       <h3>Trạng thái đơn hàng</h3>

//       <div style={{ marginBottom: 12, padding: 12, border: '1px dashed #ccc', borderRadius: 8 }}>
//         <strong>Giỏ hiện tại:</strong>{' '}
//         {cart?.chi_tiet?.length
//           ? `Có ${cart.chi_tiet.length} món • Tổng: ${Number(cart.tong_tien||0).toLocaleString('vi-VN')}₫`
//           : 'Chưa có món nào trong giỏ'}
//         {cart?.chi_tiet?.length ? (
//           <div style={{ marginTop: 8 }}>
//             <button onClick={handleDeleteCart}>Xóa cả giỏ</button>
//           </div>
//         ) : null}
//       </div>

//       <div style={{ marginBottom: 12, padding: 12, border: '1px dashed #ccc', borderRadius: 8 }}>
//         <strong>Đơn gần nhất:</strong>{' '}
//         {lastOrder ? (
//           <>
//             <div>Mã đơn: <code>{lastOrder.id}</code></div>
//             <div>Trạng thái: <b>{lastOrder.status}</b></div>
//             {lastOrder.dia_chi && <div>Giao đến: {lastOrder.dia_chi}</div>}

//             {canCancel ? (
//               <div style={{ marginTop: 8 }}>
//                 <span>Hủy trong: <b>{remainingText}</b></span>{' '}
//                 <button onClick={handleCancel}>Hủy đơn</button>
//               </div>
//             ) : (
//               <div style={{ marginTop: 8, color: '#999' }}>
//                 {lastOrder.status === 'Đã hủy' ? 'Đơn đã hủy.' : 'Hết thời gian hủy.'}
//               </div>
//             )}

//             {/* Nút xác nhận KHÁCH ĐÃ NHẬN */}
//             {canConfirmReceived && (
//               <div style={{ marginTop: 8 }}>
//                 <button onClick={handleConfirmDelivered}>Tôi đã nhận hàng</button>
//               </div>
//             )}

//             <div style={{ marginTop: 8 }}>
//               <button onClick={() => { clearLastOrder(); setLO(null); }}>Quên đơn này</button>
//             </div>
//           </>
//         ) : 'Không có đơn gần đây.'}
//       </div>

//       {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
//     </div>
//   );
// }








// nextjs/components/OrderStatusPanel.js
'use client';
import { useEffect, useMemo, useState } from 'react';
import styles from '../styles/OrderStatusPanel.module.css';
import {
  getLoggedInUser, getLastOrder, setLastOrder, clearLastOrder,
  getCart, deleteCartOrder, cancelOrderWithin15m, confirmOrderDelivered
} from '../lib/api/save';

const MIN15 = 15 * 60 * 1000;

export default function OrderStatusPanel() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [lastOrder, setLO] = useState(null);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [, forceTick] = useState(0);

  useEffect(() => setMounted(true), []);
  useEffect(() => { setUser(getLoggedInUser() || null); }, []);
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try { setCart(await getCart(user.id)); } catch {}
      setLO(getLastOrder());
    })();
  }, [user?.id]);
  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => forceTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, [mounted]);

  const remainingMs = useMemo(() => {
    if (!mounted || !lastOrder?.placedAt) return 0;
    return Math.max(0, MIN15 - (Date.now() - Number(lastOrder.placedAt)));
  }, [mounted, lastOrder?.placedAt]);

  const remainingText = useMemo(() => {
    const s = Math.ceil(remainingMs / 1000);
    return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  }, [remainingMs]);

  const canCancel =
    lastOrder && remainingMs > 0 && ['Đã xác nhận','Đã thanh toán'].includes(lastOrder.status);
  const canConfirmReceived =
    lastOrder && !['Đã hủy','Đã nhận'].includes(lastOrder.status);

  // ✅ CÓ HÀM handleConfirmDelivered
  const handleConfirmDelivered = async () => {
    if (!user?.id || !lastOrder?.id) return;
    setMsg('');
    try {
      await confirmOrderDelivered(lastOrder.id, user.id);
      setOk(true);
      setMsg('✅ Cảm ơn! Đơn đã được đánh dấu ĐÃ NHẬN.');
      setLastOrder({ ...lastOrder, status: 'Đã nhận' });
      setLO(getLastOrder());
    } catch (e) {
      setOk(false);
      setMsg('❌ ' + (e?.response?.data?.error || e.message));
    }
  };

  const handleCancel = async () => {
    if (!user?.id || !lastOrder?.id) return;
    if (!confirm('Bạn chắc muốn hủy đơn?')) return;
    setMsg('');
    try {
      const r = await cancelOrderWithin15m(lastOrder.id, user.id);
      setOk(true);
      setMsg('✅ ' + (r?.message || 'Đã hủy đơn.'));
      setLastOrder({ ...lastOrder, status: 'Đã hủy' });
      setLO(getLastOrder());
    } catch (e) {
      setOk(false);
      setMsg('❌ ' + (e?.response?.data?.error || e.message));
    }
  };

  const handleDeleteCart = async () => {
    if (!user?.id || !cart?.id) return;
    if (!confirm('Xóa toàn bộ giỏ hàng?')) return;
    setMsg('');
    try {
      const r = await deleteCartOrder(cart.id, user.id);
      setOk(true);
      setMsg('✅ ' + (r?.message || 'Đã xóa giỏ'));
      setCart({ chi_tiet: [], tong_tien: 0, trang_thai: 'Đang xử lý' });
    } catch (e) {
      setOk(false);
      setMsg('❌ ' + (e?.response?.data?.error || e.message));
    }
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Trạng thái đơn hàng</h3>

      <div className={styles.section}>
        <strong>Giỏ hiện tại:</strong>{' '}
        {cart?.chi_tiet?.length
          ? `Có ${cart.chi_tiet.length} món • Tổng: ${Number(cart.tong_tien||0).toLocaleString('vi-VN')}₫`
          : <span className={styles.muted}>Chưa có món nào trong giỏ</span>}
        {cart?.chi_tiet?.length ? (
          <div className={styles.inlineRow}>
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDeleteCart}>
              Xóa cả giỏ
            </button>
          </div>
        ) : null}
      </div>

      <div className={styles.section}>
        <strong>Đơn gần nhất:</strong>{' '}
        {lastOrder ? (
          <>
            <div>Mã đơn: <span className={styles.code}>{lastOrder.id}</span></div>
            <div>Trạng thái: <b>{lastOrder.status}</b></div>
            {lastOrder.dia_chi && <div>Giao đến: {lastOrder.dia_chi}</div>}

            {canCancel ? (
              <div className={styles.inlineRow}>
                <span>Hủy trong:{' '}
                  <span className={styles.badge} suppressHydrationWarning>
                    {mounted ? remainingText : '--:--'}
                  </span>
                </span>
                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleCancel}>
                  Hủy đơn
                </button>
              </div>
            ) : (
              <div className={`${styles.inlineRow} ${styles.muted}`}>
                {lastOrder.status === 'Đã hủy' ? 'Đơn đã hủy.' : 'Hết thời gian hủy.'}
              </div>
            )}

            {canConfirmReceived && (
              <div className={styles.inlineRow}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleConfirmDelivered}>
                  Tôi đã nhận hàng
                </button>
              </div>
            )}

            <div className={styles.inlineRow}>
              <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => { clearLastOrder(); setLO(null); }}>
                Quên đơn này
              </button>
            </div>
          </>
        ) : 'Không có đơn gần đây.'}
      </div>

      {msg && <div className={`${styles.msg} ${ok ? styles.msgOk : styles.msgErr}`}>{msg}</div>}
    </div>
  );
}
