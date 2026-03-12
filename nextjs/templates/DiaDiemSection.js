// components/DiaDiemSection.js
import styles from '../styles/homepage.module.css';

export default function DiaDiemSection() {
  return (
    <section className={styles['dia-diem-section']}>
      <div className={styles.container}>
        <h2 className={styles['section-title']}>ĐỊA ĐIỂM</h2>
        <h3 className={styles['section-subtitle']}>Quán ngon dành cho bạn</h3>
        <p className={styles['section-description']}>
          Du khách đến Huế thường phân vân không biết ghé quán nào...
        </p>
        <a href="#" className={styles['section-button']}>CHI TIẾT</a>
      </div>
    </section>
  );
}
