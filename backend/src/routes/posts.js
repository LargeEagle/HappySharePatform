const express = require('express');
const { postController } = require('../controllers');
const { authenticate, optionalAuthenticate } = require('../middlewares');

const router = express.Router();

// 獲取所有文章（公開，但如果已登入會顯示點讚/收藏狀態）
router.get('/', optionalAuthenticate, postController.getPosts);

// 獲取單篇文章（公開，但如果已登入會顯示點讚/收藏狀態）
router.get('/:id', optionalAuthenticate, postController.getPost);

// 創建文章（需要認證）
router.post('/', authenticate, postController.createPost);

// 更新文章（需要認證）
router.put('/:id', authenticate, postController.updatePost);

// 刪除文章（需要認證）
router.delete('/:id', authenticate, postController.deletePost);

// 點讚/取消點讚（需要認證）
router.post('/:id/like', authenticate, postController.toggleLike);

// 收藏/取消收藏（需要認證）
router.post('/:id/bookmark', authenticate, postController.toggleBookmark);

module.exports = router;
