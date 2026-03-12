import styles from '../styles/kinhdo.module.css';

export default function KinhDoFoodIntro() {
  return (
    <section className={styles['food-intro']}>
      <div className={styles['food-content']}>
        <h3 className={styles.subtitle}>Quán ngon</h3>
        <h2 className={styles.title}>DÀNH CHO BẠN</h2>
        <p className={styles.desc}>
          Du khách đến Huế thường phân vân không biết ghé quán bún nào, quán bánh nào, ở đâu hay ngay cả người dân Huế
        </p>
        <p className={styles['sub-desc']}>
          Khám phá Huế xin gửi đến quý độc giả một số địa chỉ đã thu hút rất đông thực khách và có tiếng ở Huế
        </p>
      </div>
    </section>
  );
}
