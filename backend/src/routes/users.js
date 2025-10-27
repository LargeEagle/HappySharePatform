const express = require('express');
const { userController } = require('../controllers');
const { authenticate } = require('../middlewares');

const router = express.Router();

// 獲取用戶資料（公開）
router.get('/:id', userController.getUserProfile);

// 更新用戶資料（需要認證）
router.put('/:id', authenticate, userController.updateUserProfile);

// 獲取用戶的文章（公開）
router.get('/:id/posts', userController.getUserPosts);

// 上傳頭像（需要認證）
router.post('/avatar', authenticate, userController.uploadAvatar);

module.exports = router;
