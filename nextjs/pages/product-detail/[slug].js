import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import Sidebar from '../../components/Sidebar';
import DishDetail from '../../components/DishDetail';
import CommentList from '../../components/CommentList';
import CommentForm from '../../components/CommentForm';
import styles from '../../styles/detail.module.css';

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const currentUser = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('loggedInUser'))
    : null;

  // 🔁 Fetch món ăn theo slug
  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchDish = async () => {
      try {
        const res = await fetch(`http://localhost:5000/dishes/slug/${slug}`);
        const data = await res.json();
        if (data && data.id) {
          setDish(data);
        } else {
          console.warn('❗ Không tìm thấy món ăn với slug:', slug);
          setDish(null);
        }
      } catch (err) {
        console.error('❌ Lỗi khi fetch món ăn:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [router.isReady, slug]);

  // 🧾 Fetch bình luận
  useEffect(() => {
    if (!dish?.id) return;

    const loadComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/comments/dish/${dish.id}`);
        const data = await res.json();

        const formatted = data.map(c => ({
          id: c.id,
          author: c.user_name,
          avatar: '/img/anhnen.jpg',
          text: c.content,
          rating: c.rating
        }));

        setComments(formatted);
      } catch (err) {
        console.error('❌ Lỗi khi load bình luận:', err);
      }
    };

    loadComments();
  }, [dish]);

  // ➕ Thêm bình luận
  const handleAddComment = async (newComment) => {
    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      });

      if (!res.ok) throw new Error('Gửi thất bại');

      const created = await res.json();

      setComments(prev => [{
        id: created.id,
        author: created.user_name,
        avatar: '/img/anhnen.jpg',
        text: created.content,
        rating: created.rating
      }, ...prev]);
    } catch (error) {
      console.error('❌ Lỗi gửi bình luận:', error);
      alert('Không gửi được bình luận.');
    }
  };

  // 🗑️ Xoá bình luận
  const handleDeleteComment = async (id) => {
    if (!confirm('Bạn chắc chắn muốn xoá bình luận này?')) return;
    try {
      await fetch(`http://localhost:5000/api/comments/${id}`, { method: 'DELETE' });
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Lỗi khi xoá bình luận');
    }
  };

  // ✅ Thêm vào giỏ hàng và phát sự kiện cập nhật
  const handleAddToCart = async (dish) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      router.push('/login');
      return;
    }

    const data = {
      id_nguoi_dung: currentUser.id,
      id_mon_an: dish.id,
      so_luong: 1,
      size: 'vừa'
    };

    try {
      const res = await fetch('http://localhost:5000/api/donhang/them-mon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Đã thêm vào giỏ hàng!');
        // 📢 Gửi sự kiện để Header cập nhật số lượng
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        throw new Error(result.error || 'Thêm thất bại');
      }
    } catch (err) {
      console.error('❌ Lỗi khi thêm vào giỏ:', err);
      alert('Không thể thêm vào giỏ hàng.');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Đang tải dữ liệu...</p>;
  if (!dish) return <p style={{ padding: '2rem' }}>Không tìm thấy món ăn.</p>;

  return (
    <>
      <Header />
      <section className={styles.hero}>
        <div
          className={styles['hero-banner']}
          style={{ backgroundImage: `url(http://localhost:5000/images/${dish.image || 'monngon8.jpg'})` }}
        >
          <div className={styles['hero-overlay']}>
            <h1 className={styles['hero-title']}>{dish.name}</h1>
          </div>
        </div>
      </section>

      <div className={styles['detail-container']}>
        <div className={styles['detail-main']}>
          <DishDetail dish={dish} />
          <p><strong>Giá:</strong> {dish.gia?.toLocaleString()} VND</p>
          <button
            onClick={() => handleAddToCart(dish)}
            style={{
              backgroundColor: '#f9c02d',
              padding: '10px 20px',
              border: 'none',
              fontWeight: 'bold',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '1rem 0'
            }}
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
        <Sidebar />
      </div>

      <section className={styles['comments-section']}>
        <h2 className={styles['comments-title']}>Bình luận</h2>
        <CommentList
          comments={comments}
          currentUser={currentUser}
          onDelete={handleDeleteComment}
        />
        <CommentForm
          currentUser={currentUser}
          dishId={dish.id}
          onSubmit={handleAddComment}
        />
      </section>
      <Footer />
    </>
  );
}
