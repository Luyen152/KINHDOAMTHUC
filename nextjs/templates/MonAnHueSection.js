// templates/MonAnHueSection.js
import styles from '../styles/homepage.module.css';

export default function MonAnHueSection({ bgImage }) {
  return (
    <section
      className={styles['monan-hue-section']}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '600px',
        position: 'relative',
        transition: 'background-image 0.5s ease-in-out',
      }}
    >
      <div className={styles['monan-hue-overlay']}>
        <h2 className={styles['sub-title']}>MÓN ĂN HUẾ</h2>
        <h1 className={styles['main-title-2']}>
          Nét văn hóa đặc trưng <br /> của vùng đất Cố đô
        </h1>
        <p className={styles.description}>
          Những món ăn của Huế, món nào cũng có một nét gì đó rất riêng...
        </p>
        <a href="#" className={styles['btn-xemthem']}>XEM NHIỀU HƠN</a>
      </div>
    </section>
  );
}
