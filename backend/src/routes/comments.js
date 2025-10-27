const express = require('express');
const { commentController } = require('../controllers');
const { authenticate, optionalAuthenticate } = require('../middlewares');

const router = express.Router();

// 獲取文章的評論（公開，但如果已登入會顯示點讚狀態）
router.get('/posts/:postId/comments', optionalAuthenticate, commentController.getComments);

// 創建評論（需要認證）
router.post('/posts/:postId/comments', authenticate, commentController.createComment);

// 刪除評論（需要認證）
router.delete('/:id', authenticate, commentController.deleteComment);

// 點讚/取消點讚評論（需要認證）
router.post('/:id/like', authenticate, commentController.toggleLike);

module.exports = router;
