const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * 認證中間件：驗證 JWT Token
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. 獲取 token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供認證令牌'
      });
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前綴

    // 2. 驗證 token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: '令牌已過期，請重新登入'
        });
      }
      return res.status(401).json({
        success: false,
        message: '無效的認證令牌'
      });
    }

    // 3. 查找用戶
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用戶不存在'
      });
    }

    // 4. 將用戶信息添加到請求對象
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    console.error('認證錯誤:', error);
    res.status(500).json({
      success: false,
      message: '認證過程發生錯誤'
    });
  }
};

/**
 * 可選認證中間件：token 存在則驗證，不存在則繼續
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = user;
        req.userId = user._id;
      }
    } catch (error) {
      // Token 無效或過期，但不中斷請求
      console.log('可選認證失敗，繼續處理請求');
    }
    
    next();
  } catch (error) {
    next();
  }
};

/**
 * 生成 JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  generateToken
};
