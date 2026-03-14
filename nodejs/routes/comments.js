const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController'); // ✅ kiểm tra đường dẫn đúng

router.get('/', commentController.getAllComments);
router.get('/dish/:dish_id', commentController.getCommentsByDishId);
router.get('/:id', commentController.getCommentById);
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
