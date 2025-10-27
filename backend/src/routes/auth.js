const express = require('express');
const { authController } = require('../controllers');
const { authenticate } = require('../middlewares');

const router = express.Router();

// 註冊
router.post('/register', authController.register);

// 登入
router.post('/login', authController.login);

// 獲取當前用戶信息（需要認證）
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
