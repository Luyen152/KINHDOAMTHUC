import styles from '../styles/kinhdo.module.css';

export default function KinhDoHero() {
  return (
    <section className={styles.hero}>
      <div className={styles['hero-content']}>
        <img
          src="/img/address1.png"
          alt="Kinh đô ẩm thực"
          className={styles['bg-img']}
        />
        <div className={styles['text-overlay']}>
          <h2 className={styles['welcome-text']}>KINH ĐÔ ẨM THỰC</h2>
          <p className={styles.description}>
            Cố đô Huế chứa đựng trong mình nhiều di sản văn hóa đặc trưng nổi bật, đặc biệt tiêu biểu là văn hóa ẩm thực
            Huế với trên 1.700 món ăn, bao gồm ẩm thực cung đình, ẩm thực dân gian, ẩm thực chay.
          </p>
        </div>
      </div>
    </section>
  );
}
