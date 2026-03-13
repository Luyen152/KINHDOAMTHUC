// layout/Header.js
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/header.module.css';
import SearchBox from '../templates/SearchBox';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Header() {
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const dropdownRef = useRef(null);
  const headerRef = useRef(null);
  const router = useRouter();

  const isAdmin = !!(user && (user.role === 1 || user.role === 'admin'));

  const updateCartCountFromAPI = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/donhang/dem/${userId}`);
      const data = await res.json();
      setCartCount(data.count || 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        if (userData?.id) {
          updateCartCountFromAPI(userData.id);
        }
      } catch {}
    }

    fetch(`${API_URL}/api/menus`)
      .then((res) => res.json())
      .then((data) => setMenus(Array.isArray(data) ? data : []))
      .catch(() => setMenus([]));

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    };

    const handleScroll = () => {
      const header = headerRef.current;
      if (header) header.classList.toggle(styles.scrolled, window.scrollY > 10);
    };

    const handleCartUpdated = () => {
      const userData = JSON.parse(localStorage.getItem('loggedInUser') || 'null');

      if (userData?.id) {
        updateCartCountFromAPI(userData.id);
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', handleCartUpdated);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    setCartCount(0);
    setDropdownVisible(false);
    router.push('/login');
  };

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles['menu-toggle']} onClick={() => setMenuOpen(!menuOpen)}>
        <i className="bi bi-list"></i>
      </div>

      <div className={styles.logo}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Image src="/img/Asset-6.png" alt="Logo Website" width={120} height={50} />
        </Link>
      </div>

      <nav className={`${styles.menu} ${menuOpen ? styles.active : ''}`}>
        <ul className={styles['main-menu']}>
          {menus.map((menu) =>
            menu.title !== 'Giỏ hàng' && menu.title !== 'Tìm kiếm' ? (
              <li key={menu.id}>
                <Link href={menu.url} className={styles['nav-link']}>
                  {menu.title.toUpperCase()}
                </Link>
              </li>
            ) : null
          )}

          <li>
            <SearchBox />
          </li>

          <li>
            <Link href="/gio-hang" className={styles['nav-link']}>
              <i className="bi bi-cart3"></i>
              <span className={styles['cart-count']}>{cartCount}</span>
            </Link>
          </li>

          {user ? (
            <li className={`${styles['nav-item']} ${styles['user-menu']}`} ref={dropdownRef}>
              <span
                className={styles['nav-link']}
                onClick={() => setDropdownVisible(!dropdownVisible)}
                style={{ cursor: 'pointer' }}
              >
                {user.name} <i className="bi bi-caret-down-fill"></i>
              </span>

              {dropdownVisible && (
                <ul className={styles['dropdown-menu']}>
                  {isAdmin && (
                    <li>
                      <Link href="/admin" className={styles['dropdown-item']}>
                        Vào trang quản trị
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link href="/tai-khoan" className={styles['dropdown-item']}>
                      Thông tin cá nhân
                    </Link>
                  </li>

                  <li>
                    <span className={styles['dropdown-item']} onClick={handleLogout}>
                      Đăng xuất
                    </span>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <li className={styles['nav-item']}>
              <Link href="/login" className={styles['nav-link']}>
                Đăng nhập <i className="bi bi-person-circle"></i>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}