// templates/IntroSection.js
import Image from 'next/image';
import styles from '../styles/homepage.module.css';

export default function IntroSection({ leftBanner, rightBanner }) {
  return (
    <section className={styles['intro-section']}>
      {leftBanner && (
        <div className={`${styles['intro-image']} ${styles.left}`}>
          <Image
            src={`http://localhost:5000/images/${leftBanner.image}`}
            alt={leftBanner.title}
            width={400}
            height={300}
            unoptimized={true}
          />
        </div>
      )}

      <div className={styles['intro-content']}>
        <h2 className={styles['section-title']}>Kinh đô ẩm thực</h2>
        <p className={styles['section-description']}>
          Trong số gần 3.000 món ăn của cả nước, thì món ăn Huế đã chiếm hơn 65%...
        </p>
        <p className={styles['section-description']}>
          Được tiếng là thanh lịch, người Huế lại tỏ ra sành điệu trong ăn uống...
        </p>
        <a href="/kinhdo" className={styles['btn-xemthem-2']}>XEM THÊM</a>
      </div>

      {rightBanner && (
        <div className={`${styles['intro-image']} ${styles.right}`}>
          <Image
            src={`http://localhost:5000/images/${rightBanner.image}`}
            alt={rightBanner.title}
            width={400}
            height={300}
            unoptimized={true}
          />
        </div>
      )}
    </section>
  );
}
