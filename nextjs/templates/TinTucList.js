// templates/TinTucList.js
import Image from 'next/image';
import styles from '../styles/tintuc.module.css';

const tinTucData = [
  {
    title: 'Lễ hội Ẩm thực Huế 2025 sắp diễn ra',
    description:
      'Sự kiện được tổ chức vào tháng 7 tại quảng trường Ngọ Môn, quy tụ hơn 100 gian hàng ẩm thực và các đầu bếp nổi tiếng trên cả nước.',
    image: '/img/2.jpg',
  },
  {
    title: 'Huế mở tuyến phố đi bộ mới gần Hoàng Thành',
    description:
      'Phố đi bộ mới sẽ mở cửa từ 18h đến 23h cuối tuần, kết hợp trình diễn nghệ thuật đường phố và món ăn đặc trưng xứ Huế.',
    image: '/img/9.jpg',
  },
  {
    title: 'Ẩm thực Huế vào top 10 đặc sản châu Á',
    description:
      'Trang du lịch TasteAtlas vừa công bố danh sách những món ăn đặc trưng, trong đó món bún bò Huế và bánh bèo được đánh giá cao.',
    image: '/img/10.jpg',
  },
];

export default function TinTucList() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.mainTitle}>Tin tức nổi bật</h2>

      {tinTucData.map((item, index) => (
        <div
          key={index}
          className={`${styles.section} ${index % 2 !== 0 ? styles.reverse : ''}`}
        >
          <div className={styles.imageContainer}>
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={300}
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
