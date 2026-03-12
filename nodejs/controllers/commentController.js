const commentService = require('../service/commentService');

// ✅ Lấy tất cả bình luận
exports.getAllComments = async (req, res) => {
  try {
    const comments = await commentService.getAllComments();
    res.status(200).json(comments);
  } catch (error) {
    console.error('Lỗi lấy comments:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ✅ Lấy bình luận theo ID
exports.getCommentById = async (req, res) => {
  try {
    const comment = await commentService.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Không tìm thấy comment' });
    res.status(200).json(comment);
  } catch (error) {
    console.error('Lỗi lấy comment:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ✅ Lấy tất cả bình luận theo dish_id
exports.getCommentsByDishId = async (req, res) => {
  try {
    const dishId = req.params.dish_id;
    const comments = await commentService.getCommentsByDishId(dishId);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Lỗi lấy comment theo dish_id:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ✅ Tạo mới bình luận
exports.createComment = async (req, res) => {
  try {
    const { dish_id, user_id, user_name, content, rating } = req.body;
    if (!dish_id || !user_id || !user_name || !content || rating === undefined) {
      return res.status(400).json({ message: 'Thiếu dữ liệu comment' });
    }

    const newComment = await commentService.createComment({ dish_id, user_id, user_name, content, rating });
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Lỗi tạo comment:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ✅ Cập nhật nội dung bình luận
exports.updateComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { content, rating } = req.body;
    const updated = await commentService.updateComment(id, { content, rating });
    res.status(200).json(updated);
  } catch (error) {
    console.error('Lỗi cập nhật comment:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ✅ Xóa bình luận
exports.deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    await commentService.deleteComment(id);
    res.status(200).json({ message: 'Xóa comment thành công' });
  } catch (error) {
    console.error('Lỗi xóa comment:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
