import { useRef, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Cart from '../templates/Cart';

export default function GioHangPage() {
  const cartRef = useRef();               
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Head>
        <title>Giỏ hàng | Kinh Đô Ẩm Thực</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
        integrity="sha384-ENjdO4Dr2bkBIFxQpeoVZEVkRjQAnYhEzUWZm3N1YkGZ1yMGGZ1G0E70gN3gmRMo"
        crossOrigin="anonymous"
      />

      <Header />

      {/* 🖼 Banner dưới header */}
      <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
        <img 
          src="/img/cart.jpg" 
          alt="Banner giỏ hàng" 
          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} 
        />
      </div>

      <main style={{ flex: 1 }}>
        <Cart
          ref={cartRef}
          onUserLoaded={setUser}
          onCartLoaded={setCartItems}
        />

        {/* ❌ Đã xóa phần ThanhToanHoaDon */}
      </main>

      <Footer />
    </div>
  );
}
