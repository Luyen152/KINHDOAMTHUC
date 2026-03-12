// templates/Hero.js
import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/homepage.module.css';

export default function Hero({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const [showFull, setShowFull] = useState(false);

  const hardcodedContent = [
    {
      title: 'Ẩm thực cung đình Huế',
      description: 'Tinh hoa ẩm thực xưa dành cho vua chúa.\nĐược chế biến tinh tế, cầu kỳ, đẹp mắt.'
    },
    {
      title: 'Bún bò Huế',
      description: 'Món ăn trứ danh với vị cay nồng và thơm đặc trưng.\nLà biểu tượng ẩm thực của vùng đất cố đô.'
    },
    {
      title: 'Bánh bèo – Nậm – Lọc',
      description: 'Những món ăn vặt dân dã đậm chất Huế.\nMềm mịn, thơm ngon, đậm đà.'
    },
    {
      title: 'Nem lụi và bánh khoái',
      description: 'Món ăn đường phố hấp dẫn với hương vị khó quên.\nKèm nước lèo đặc biệt kiểu Huế.'
    }
  ];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setShowFull(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setShowFull(false);
  };

  if (!slides.length) return null;

  const currentContent = hardcodedContent[current] || {};
  const shortDesc = currentContent.description?.split('\n')[0] || '';

  return (
    <section className={styles.hero}>
      <div className={styles['hero-carousel']}>
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`${styles['hero-content']} ${index === current ? styles.active : ''}`}
            style={{ display: index === current ? 'flex' : 'none' }}
          >
            <Image
              src={`http://localhost:5000/images/${slide.image}`}
              alt={currentContent.title}
              fill
              className={styles['bg-img']}
              unoptimized
            />
            <div className={styles['text-overlay']}>
              <h2 className={styles['welcome-text']}>Welcome</h2>
              <h1 className={styles['main-title']}>{currentContent.title}</h1>
              <p className={styles.description}>
                {showFull ? currentContent.description : shortDesc}
              </p>
              <button
                className={styles['btn-xemthem']}
                onClick={() => setShowFull(!showFull)}
              >
                {showFull ? 'THU GỌN' : 'XEM THÊM'}
              </button>
            </div>
          </div>
        ))}
        <button className={styles.prev} onClick={prevSlide}>❮</button>
        <button className={styles.next} onClick={nextSlide}>❯</button>
      </div>
    </section>
  );
}
