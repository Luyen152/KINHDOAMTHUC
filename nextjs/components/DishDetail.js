// components/DishDetail.js
import styles from '../styles/detail.module.css';

export default function DishDetail({ dish }) {
  return (
    <>
      <p className={styles.date}>
        <em>Ngày đăng: {new Date(dish.created_at).toLocaleDateString('vi-VN')}</em>
      </p>
      <p className={styles.intro}>{dish.mo_ta}</p>

      <div className={styles['image-wrapper']}>
        <img
          src={`http://localhost:5000/images/${dish.image || 'monngon8.jpg'}`}
          alt={dish.name}
          width={600}
          height={400}
          className={styles['detail-image']}
        />
      </div>

      <div className={styles['food-content']}>
        <h3>Thông tin món ăn:</h3>
        <ul>
          <li><strong>Vùng miền:</strong> {dish.region}</li>
          <li><strong>Độ khó:</strong> {dish.difficulty}/5</li>
          <li><strong>Khẩu phần:</strong> {dish.servings} người</li>
          <li><strong>Nổi bật:</strong> {dish.is_featured ? 'Có' : 'Không'}</li>
        </ul>
      </div>
    </>
  );
}
