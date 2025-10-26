const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// 載入環境變數
dotenv.config();

// 創建Express應用
const app = express();

// 中間件
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 基礎路由
app.get('/', (req, res) => {
  res.json({ message: '歡迎使用社交媒體平台 API' });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服務器內部錯誤',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 啟動服務器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服務器運行在端口 ${PORT}`);
});