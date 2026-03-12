const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController'); // ✅ kiểm tra đường dẫn đúng

// ✅ Danh sách các route
router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.get('/dish/:dish_id', commentController.getCommentsByDishId); // ✅ lỗi nằm ở đây nếu commentController bị thiếu hàm
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
