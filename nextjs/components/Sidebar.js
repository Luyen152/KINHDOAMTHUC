// components/Sidebar.js
import Image from 'next/image'
import styles from '../styles/detail.module.css'

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Tin tức mới */}
      <div className={styles['sidebar-section']}>
        <h4 className={styles['sidebar-title']}>Tin tức mới</h4>
        <ul className={styles['sidebar-list']}>
          <li className={styles['sidebar-item']}>
            <Image
              src="/img/monngon8.jpg"
              alt=""
              width={80}
              height={60}
              className={styles['sidebar-thumb']}
            />
            <div>
              <a href="#" className={styles['sidebar-link']}>
                Độc đáo ngày hội 'Huế' – Kinh đô ẩm thực…
              </a>
              <p className={styles['sidebar-date']}>Jun 18, 2022</p>
            </div>
          </li>
          <li className={styles['sidebar-item']}>
            <Image
              src="/img/monngon7.jpg"
              alt=""
              width={80}
              height={60}
              className={styles['sidebar-thumb']}
            />
            <div>
              <a href="#" className={styles['sidebar-link']}>
                Lễ hội ẩm thực tại Festival Huế 2022…
              </a>
              <p className={styles['sidebar-date']}>Jun 18, 2022</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Ẩm thực chay */}
      <div className={styles['sidebar-section']}>
        <h4 className={styles['sidebar-title']}>Ẩm thực chay</h4>
        <ul className={styles['sidebar-list']}>
          <li className={styles['sidebar-item']}>
            <Image
              src="/img/monanngon4.png"
              alt=""
              width={80}
              height={60}
              className={styles['sidebar-thumb']}
            />
            <div>
              <a href="#" className={styles['sidebar-link']}>
                Khám phá nghệ thuật ẩm thực Huế…
              </a>
              <p className={styles['sidebar-date']}>Dec 20, 2024</p>
            </div>
          </li>
          <li className={styles['sidebar-item']}>
            <Image
              src="/img/monngon9.jpg"
              alt=""
              width={80}
              height={60}
              className={styles['sidebar-thumb']}
            />
            <div>
              <a href="#" className={styles['sidebar-link']}>
                Cơm hấp lá sen – Tinh hoa chay…
              </a>
              <p className={styles['sidebar-date']}>Dec 20, 2024</p>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  )
}
