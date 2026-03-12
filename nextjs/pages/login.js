// pages/login.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import styles from '../styles/login.module.css';
import { loginUser } from '../lib/api/user';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // ✅ Nếu đã đăng nhập → redirect ngay không cho vào lại trang login
  useEffect(() => {
    const userStr = localStorage.getItem('loggedInUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 1) {
        router.replace('/admin'); // Admin vào quản lý người dùng luôn
      } else {
        router.replace('/'); // Người dùng thường về trang chủ
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const res = await loginUser(email, password);
      const { token, user } = res.data;

      // ✅ Lưu vào localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      alert('Đăng nhập thành công!');

      const returnUrl = router.query.returnUrl;

      if (user.role === 1) {
        // ✅ Admin → vào trang quản lý người dùng
        router.push('/admin');
      } else {
        // ✅ Người dùng thường → về lại returnUrl hoặc trang chủ
        router.push(returnUrl || '/');
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!');
      console.error('❌ Lỗi đăng nhập:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Đăng nhập - Ẩm Thực Huế</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script />
      <main>
        <div className={styles.loginFormWrapper}>
          <form onSubmit={handleSubmit} className={styles.loginContainer}>
            <h2 className={styles.loginTitle}>Đăng Nhập</h2>
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
            <button type="submit" className={styles.btnLogin}>Đăng Nhập Ngay</button>
            <div className={styles.smallLinks}>
              <a href="/register">Đăng ký tài khoản</a>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
