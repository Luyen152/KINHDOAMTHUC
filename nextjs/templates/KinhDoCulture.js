import styles from '../styles/kinhdo.module.css';

export default function KinhDoCulture() {
  return (
    <section className={styles.amthuchue}>
      <div className={styles.container}>
        <div className={styles.left}>
          <img src="/img/logomini.png" alt="Logo" className={styles.logo} />
        </div>
        <div className={styles.middle}>
          <img src="/img/amthuc1.jpg" alt="Món ăn 1" />
          <img src="/img/amthuc2.jpg" alt="Món ăn 2" />
        </div>
        <div className={styles.right}>
          <h2>Ẩm thực Huế</h2>
          <p>
            Văn hoá Huế là hội tụ và chịu nhiều ảnh hưởng của những luồng văn hoá đến từ những cộng đồng dân cư khác nhau...
          </p>
        </div>
      </div>
      <div className={styles.monngon}>
        <h2>Món ngon</h2>
        <p>Nhằm mục đích giới thiệu quảng bá ẩm thực đặc trưng của xứ Huế...</p>
      </div>
    </section>
  );
}
