import Image from 'next/image';
import styles from '../styles/detail.module.css';

export default function CommentList({ comments, currentUser, onDelete }) {
  return (
    <>
      {comments.map(c => (
        <div key={c.id} className={styles.comment}>
          <Image src={c.avatar} alt={c.author} width={50} height={50} className={styles['comment-avatar']} />
          <div className={styles['comment-content']}>
            <div className={styles['comment-author']}>
              {c.author}
              {currentUser?.name === c.author && (
                <button onClick={() => onDelete(c.id)} style={{ marginLeft: 10, color: 'red', cursor: 'pointer' }}>
                  Xoá
                </button>
              )}
            </div>
            <div className={styles['comment-stars']}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < c.rating ? '' : styles['star-grey']}>★</span>
              ))}
            </div>
            <p className={styles['comment-text']}>{c.text}</p>
          </div>
        </div>
      ))}
    </>
  );
}
