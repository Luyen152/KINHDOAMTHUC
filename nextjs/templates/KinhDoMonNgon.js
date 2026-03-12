import styles from '../styles/kinhdo.module.css';

const monan = Array.from({ length: 12 }, (_, i) => `/img/monngon${i + 1}.jpg`);

export default function KinhDoMonNgon() {
  return (
    <section className={styles['monan-fullwidth']}>
      <div className={styles['monan-row']}>
        {monan.map((src, index) => (
          <div className={styles['monan-card']} key={index}>
            <img src={src} alt={`Món ngon ${index + 1}`} />
            <div className={styles['text-overlay']}></div>
          </div>
        ))}
      </div>
    </section>
  );
}
