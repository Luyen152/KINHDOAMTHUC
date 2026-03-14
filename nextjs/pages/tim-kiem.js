import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import styles from '../styles/header.module.css';

export default function TimKiemPage() {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState([]);

  // === Ảnh dưới Header ===
  const promoImages = [
    '/img/find.jpg'
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        const res = await fetch(
          `https://kinhdoamthuc.onrender.com/api/products/search?keyword=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      }
    };
    fetchData();
  }, [query]);

  return (
    <>
      <Header />

      {/* Dải ảnh ngay dưới Header */}
      <section className={styles['hero-strip']}>
        <div className={styles['hero-scroller']}>
          {promoImages.map((src, i) => (
            <img key={i} src={src} alt={`Banner ${i + 1}`} className={styles['hero-img']} loading="lazy" />
          ))}
        </div>
      </section>

      <div className="p-6">
        <h2 className={`${styles.searchTitle} text-2xl font-bold text-gray-800 mb-6`}>
          🍽️ Các món ăn liên quan đến từ khóa: "<span className="keyword">{query}</span>"
        </h2>


        <div className={styles['search-results-wrapper']}>
          <div className={styles['search-results-grid']}>
            {results.map((item) => (
              <div
                key={item.id}
                className={styles['search-item']}
                onClick={() => router.push(`/product-detail/${item.slug}`)}
              >
                <img src={`/img/${item.image}`} alt={item.name} className={styles['search-item-img']} />
                <div className={styles['search-item-info']}>
                  <h4>{item.name}</h4>
                  <p>{Number(item.gia).toLocaleString('vi-VN')}₫</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
