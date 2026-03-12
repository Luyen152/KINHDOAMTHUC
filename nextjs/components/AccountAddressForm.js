import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/AccountAddressForm.module.css';
import {
  getMyAddress,
  putMyAddress,
  getLoggedInUser,
} from '../lib/api/save';

const VN_PHONE_REGEX = /^(?:0|\+84)(?:3|5|7|8|9)\d{8}$/;
const ADDRESS_SAVED_EVENT = 'address:saved';

export default function AccountAddressForm() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    tinh_thanh: 'Thừa Thiên Huế',
    quan_huyen: 'Thành phố Huế',
    phuong_xa: '',
    so_nha: '',
    dia_chi_day_du: '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(true);

  useEffect(() => {
    setUser(getLoggedInUser() || null);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const { address } = await getMyAddress(user.id);
        if (address) {
          setForm((f) => ({
            ...f,
            ...address,
            tinh_thanh: address.tinh_thanh || 'Thừa Thiên Huế',
            quan_huyen: address.quan_huyen || 'Thành phố Huế',
          }));
        }
      } catch {}
    })();
  }, [user?.id]);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!user?.id) return alert('Vui lòng đăng nhập');

    const phone = String(form.so_dien_thoai || '').trim();
    if (!VN_PHONE_REGEX.test(phone)) return alert('SĐT không hợp lệ');

    const diaChiFull =
      form.dia_chi_day_du?.trim() ||
      [form.so_nha, form.phuong_xa, form.quan_huyen, form.tinh_thanh]
        .filter(Boolean)
        .join(', ');

    setSaving(true);
    setMsg('');
    try {
      await putMyAddress({
        ...form,
        dia_chi_day_du: diaChiFull,
        id_nguoi_dung: user.id,
      });

      setOk(true);
      setMsg('✅ Đã lưu địa chỉ mặc định');
      setForm((f) => ({ ...f, dia_chi_day_du: diaChiFull }));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent(ADDRESS_SAVED_EVENT, {
            detail: { address: { ...form, dia_chi_day_du: diaChiFull } },
          })
        );
      }
    } catch (e) {
      setOk(false);
      setMsg('❌ ' + (e?.message || 'Lưu thất bại'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.title}>Thông tin người nhận</h3>
      <div className={styles.grid}>
        <input className={styles.input} value={form.ho_ten} onChange={(e) => setF('ho_ten', e.target.value)} placeholder="Họ tên" />
        <input className={styles.input} value={form.so_dien_thoai} onChange={(e) => setF('so_dien_thoai', e.target.value)} placeholder="SĐT" inputMode="tel" />
        <input className={styles.input} value={form.tinh_thanh} onChange={(e) => setF('tinh_thanh', e.target.value)} placeholder="Tỉnh/Thành" />
        <input className={styles.input} value={form.quan_huyen} onChange={(e) => setF('quan_huyen', e.target.value)} placeholder="Quận/Huyện" />
        <input className={styles.input} value={form.phuong_xa} onChange={(e) => setF('phuong_xa', e.target.value)} placeholder="Phường/Xã" />
        <input className={styles.input} value={form.so_nha} onChange={(e) => setF('so_nha', e.target.value)} placeholder="Số nhà/đường" />
        <input className={styles.input} value={form.dia_chi_day_du} onChange={(e) => setF('dia_chi_day_du', e.target.value)} placeholder="Địa chỉ đầy đủ (tuỳ chọn)" />
      </div>
      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave} disabled={saving || !user?.id}>
          {saving ? 'Đang lưu...' : 'Lưu địa chỉ'}
        </button>
        <Link href="/" className={`${styles.btn} ${styles.btnGhost}`}>
          Quay lại trang chủ
        </Link>
        {msg && (
          <span className={`${styles.msg} ${ok ? styles.msgOk : styles.msgErr}`}>
            {msg}
          </span>
        )}
      </div>
    </div>
  );
}
