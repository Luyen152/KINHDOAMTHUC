import styles from '../styles/kinhdo.module.css';

export default function KinhDoIntro() {
  return (
    <section className={styles['intro-section']}>
      <div className={styles['intro-text']}>
        <h1>Nét văn hóa đặc trưng của vùng đất Cố đô</h1>
        <p>
          Những món ăn của Huế, món nào cũng có một nét gì đó rất riêng, đó là nét quyến rũ rất “Huế”, không lẫn vào đâu được.
        </p>
        <p>
          Là một vùng đất nằm nép mình sau dãy Bạch Mã hùng vĩ, Huế nổi tiếng với những giá trị văn hoá có tuổi đời hơn 200 năm...
        </p>
      </div>
      <div className={styles['intro-grid']}>
        <img src="/img/dactrung1.jpg" alt="Hình 1" />
        <img src="/img/contact.jpg" alt="Logo Huế" className={styles.logo} />
        <img src="/img/dactrung2.jpg" alt="Bún bò Huế" className={styles['full-width']} />
      </div>
    </section>
  );
}
