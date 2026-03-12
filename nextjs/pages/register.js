// 📁 pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import styles from '../styles/login.module.css';
import { registerUser } from '../lib/api/user';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    try {
      const res = await registerUser({
        name: username,
        email,
        password,
        avatar: 'images/default-avatar.jpg',
        role: 0
      });
      alert(res.data.message || 'Đăng ký thành công!');
      router.push('/login');
    } catch (err) {
      alert(err?.response?.data?.message || 'Lỗi khi đăng ký');
      console.error('Đăng ký lỗi:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Đăng ký - Ẩm Thực Huế</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script />
      <main>
        <div className={styles.loginFormWrapper}>
          <form onSubmit={handleRegister} className={styles.loginContainer}>
            <h2 className={styles.loginTitle}>Đăng Ký</h2>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Tên người dùng"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
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
            <div className={styles.formGroup} style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputField}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', userSelect: 'none', fontSize: '18px', color: '#555' }}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </span>
            </div>
            <div className={styles.formGroup} style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.inputField}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', userSelect: 'none', fontSize: '18px', color: '#555' }}
              >
                {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
              </span>
            </div>
            <button type="submit" className={styles.btnLogin}>Tạo Tài Khoản</button>
            <div className={styles.smallLinks}>
              <a href="/login">Quay về đăng nhập</a>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
