/**
 * 錯誤處理中間件
 */
const errorHandler = (err, req, res, next) => {
  console.error('錯誤:', err);

  // Mongoose 驗證錯誤
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: '數據驗證失敗',
      errors
    });
  }

  // Mongoose 重複鍵錯誤
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} 已存在`
    });
  }

  // Mongoose CastError (無效的 ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: '無效的 ID 格式'
    });
  }

  // JWT 錯誤
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '無效的認證令牌'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: '令牌已過期'
    });
  }

  // 默認錯誤
  const statusCode = err.statusCode || 500;
  const message = err.message || '服務器內部錯誤';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * 404 處理中間件
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `找不到路由: ${req.originalUrl}`
  });
};

module.exports = {
  errorHandler,
  notFound
};
