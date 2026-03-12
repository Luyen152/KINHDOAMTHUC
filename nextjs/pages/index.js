import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Hero from '../templates/Hero';
import IntroSection from '../templates/IntroSection';
import MonAnHueSection from '../templates/MonAnHueSection';
import DacTrungSection from '../components/DacTrungSection';
import DiaDiemSection from '../templates/DiaDiemSection';

export default function HomePage() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [leftBanner, setLeftBanner] = useState(null);
  const [rightBanner, setRightBanner] = useState(null);
  const [monAnBgImage, setMonAnBgImage] = useState('');
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bannerRes, dishRes] = await Promise.all([
          fetch('http://localhost:5000/banners'),
          fetch('http://localhost:5000/dishes')
        ]);

        const banners = await bannerRes.json();
        const dishesData = await dishRes.json();
        setDishes(dishesData); // Lấy tất cả món ăn

        // setDishes(dishesData.slice(0, 4)); // Lấy 4 món ăn

        // Hero section
        const hero = banners
          .filter(item => item.position === 0 && item.sort_order >= 1 && item.sort_order <= 4)
          .sort((a, b) => a.sort_order - b.sort_order);
        setHeroSlides(hero);

        // Intro section
        const intro = banners
          .filter(item => item.position === 1)
          .sort((a, b) => a.sort_order - b.sort_order);
        setLeftBanner(intro[0] || null);
        setRightBanner(intro[1] || null);

        // Món ăn Huế background
        const monAn = banners.find(item => item.title === 'MÓN ĂN HUẾ');
        if (monAn && monAn.image) {
          setMonAnBgImage(`http://localhost:5000/images/${monAn.image}`);
        }

      } catch (err) {
        console.error('❌ Lỗi khi fetch dữ liệu:', err);
      }
    };

    fetchAll();
  }, []);

  return (
    <>
      <Head>
        <title>Ẩm Thực Huế</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      <Script src="/js/script.js" strategy="afterInteractive" />

      <Header />
      <Hero slides={heroSlides} />
      <IntroSection leftBanner={leftBanner} rightBanner={rightBanner} />
      <MonAnHueSection bgImage={monAnBgImage} />
      <DacTrungSection dishes={dishes} /> {/* 🟢 Truyền props */}
      <DiaDiemSection />
      <Footer />
    </>
  );
}
