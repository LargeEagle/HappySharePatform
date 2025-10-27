const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { authRoutes, userRoutes, postRoutes, commentRoutes } = require('./routes');
const { errorHandler, notFound } = require('./middlewares');

// 載入環境變數
dotenv.config();

// 連接數據庫
connectDB();

// 創建Express應用
const app = express();

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 基礎路由
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '歡迎使用社交媒體平台 API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts',
      comments: '/api/comments'
    }
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// 404 處理
app.use(notFound);

// 錯誤處理中間件
app.use(errorHandler);

// 啟動服務器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 服務器運行在端口 ${PORT}`);
  console.log(`📝 環境: ${process.env.NODE_ENV || 'development'}`);
});