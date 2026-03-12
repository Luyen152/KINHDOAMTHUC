const pool = require('../db');

// ✅ Lấy tất cả bình luận
const getAllComments = async () => {
  const [rows] = await pool.query('SELECT * FROM comments');
  return rows;
};

// ✅ Lấy bình luận theo ID
const getCommentById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
  return rows[0];
};

// ✅ Lấy bình luận theo dish_id
const getCommentsByDishId = async (dishId) => {
  const [rows] = await pool.query(
    'SELECT * FROM comments WHERE dish_id = ? ORDER BY created_at DESC',
    [dishId]
  );
  return rows;
};


// ✅ Tạo mới bình luận
const createComment = async ({ dish_id, user_id, user_name, content, rating }) => {
  const [result] = await pool.query(
    'INSERT INTO comments (dish_id, user_id, user_name, content, rating, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [dish_id, user_id, user_name, content, rating]
  );

  return {
    id: result.insertId,
    dish_id,
    user_id,
    user_name,
    content,
    rating
  };
};

// ✅ Cập nhật bình luận
const updateComment = async (id, { content, rating }) => {
  await pool.query(
    'UPDATE comments SET content = ?, rating = ? WHERE id = ?',
    [content, rating, id]
  );

  const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
  return rows[0];
};

// ✅ Xoá bình luận
const deleteComment = async (id) => {
  await pool.query('DELETE FROM comments WHERE id = ?', [id]);
};

module.exports = {
  getAllComments,
  getCommentById,
  getCommentsByDishId,  // ✅ Hàm gây lỗi do bạn chưa export
  createComment,
  updateComment,
  deleteComment
};
