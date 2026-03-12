import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/detail.module.css';

export default function CommentForm({ onSubmit, currentUser, dishId }) {
  const [starToggle, setStarToggle] = useState(Array(5).fill(true));
  const [commentText, setCommentText] = useState('');

  const handleStarClick = (idx) => {
    setStarToggle(prev => prev.map((_, i) => i <= idx ? false : true));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rating = starToggle.filter(t => !t).length;
    const content = commentText.trim();

    if (rating < 1 || !content) return;

    if (!currentUser || !currentUser.id) {
      if (confirm('Bạn cần đăng nhập để bình luận.')) {
        window.location.href = `/login?returnUrl=${window.location.pathname}`;
      }
      return;
    }

    const newComment = {
      dish_id: dishId,
      user_id: currentUser.id,
      user_name: currentUser.name,
      content,
      rating
    };

    try {
      await onSubmit(newComment); // chờ kết quả gửi bình luận
      setCommentText('');
      setStarToggle(Array(5).fill(true));
    } catch (error) {
      console.error('❌ Lỗi gửi bình luận trong CommentForm:', error);
      alert('Không gửi được bình luận.');
    }
  };

  return (
    <form className={styles['comment-form']} onSubmit={handleSubmit}>
      <div className={styles['user-info']}>
        <Image src="/img/anhnen.jpg" alt="Bạn" width={40} height={40} className={styles['comment-avatar']} />
        <span className={styles.username}>{currentUser?.name || 'Bạn'}</span>
      </div>

      <div className={styles['star-input']}>
        <p className={styles['star-input-label']}>Chấm sao:</p>
        <div className={styles['star-rating']}>
          {starToggle.map((toggled, i) => (
            <span
              key={i}
              onClick={() => handleStarClick(i)}
              className={toggled ? styles['star-grey'] : ''}
              style={{ cursor: 'pointer' }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <textarea
        className={styles['comment-textarea']}
        placeholder="Viết bình luận của bạn..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        required
      />

      <button className={styles['comment-submit']} type="submit">
        Gửi bình luận
      </button>
    </form>
  );
}
