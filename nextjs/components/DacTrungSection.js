import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/homepage.module.css';

export default function DacTrungSection({ dishes }) {
  return (
    <section className={styles.dactrung}>
      <h2 className={styles.title}>Đặc trưng ẩm thực</h2>
      <p className={styles.subtitle}>Một số món ăn tiêu biểu nhất trong văn hóa ẩm thực Huế</p>
      <div className={styles.grid}>
        {dishes.map((item, index) => (
          <Link href={`/product-detail/${item.slug}`} key={index} className={styles.card}>
            <div>
              <Image
                src={`http://localhost:5000/images/${item.image}`}
                alt={item.name}
                width={300}
                height={200}
                className={styles.image}
                unoptimized
              />
              <p className={styles.text}>{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
