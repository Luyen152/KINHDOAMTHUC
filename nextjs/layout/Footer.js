// components/Footer.js
import Image from 'next/image';
import styles from '../styles/footer.module.css'; // import CSS module

// Nếu bạn chưa thêm Bootstrap Icons, bạn cần import ở _app.js hoặc ở đây nếu chỉ dùng cho footer
// Ví dụ import Bootstrap Icons CSS trong _app.js:
// import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
        <div className={`${styles['footer-column']} ${styles['logo-column']}`}>
          <Image
            src="/img/Asset-6.png"
            alt="Logo Huế"
            width={120}
            height={60}
            className={styles['footer-logo']}
          />
          <p>
            Huế nổi tiếng với ẩm thực cung đình cao sang và mỹ vị, tuy nhiên các gánh hàng rong, các món ăn bình dân cũng
            có sức hấp dẫn khó cưỡng.
          </p>
          <div className={styles['footer-socials']}>
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-twitter"></i></a>
            <a href="#"><i className="bi bi-google"></i></a>
          </div>
        </div>
        <div className={styles['footer-column']}>
          <h4>LIÊN KẾT NHANH</h4>
          <ul>
            <li><a href="#">Kinh đô ẩm thực</a></li>
            <li><a href="#">Món ăn Huế</a></li>
          </ul>
        </div>
        <div className={styles['footer-column']}>
          <h4>LIÊN HỆ</h4>
          <p>Chịu trách nhiệm chính: Ông Nguyễn Văn Phúc – Giám đốc Sở Du lịch</p>
          <p>
            Địa chỉ: Tầng 4, tòa nhà 4 tầng, Khu Hành chính công, đường Võ Nguyên Giáp, phường Xuân Phú, thành phố Huế.
          </p>
          <p>Điện thoại: 0387852022</p>
          <p>Email: NguyenLuyen@thuathienhue.gov.vn</p>
        </div>
        <div className={styles['footer-column']}>
          <h4>EMAIL</h4>
          <form className={styles['footer-email']}>
            <input type="email" placeholder="Your email" />
            <button type="submit">SUBMIT</button>
          </form>
        </div>
      </div>
      <div className={styles['footer-bottom']}>
        <p>
          Bản quyền © 2025 Bảo lưu mọi quyền | Mẫu này do Phần mềm <span>Nguyễn Văn Luyện</span> thực hiện
        </p>
      </div>
    </footer>
  );
}
