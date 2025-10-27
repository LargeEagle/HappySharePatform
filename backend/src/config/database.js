const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      // useNewUrlParser: true, // Mongoose 6+ 默認啟用
      // useUnifiedTopology: true, // Mongoose 6+ 默認啟用
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB 連接成功: ${conn.connection.host}`);

    // 監聽連接錯誤
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB 連接錯誤:', err);
    });

    // 監聽斷開連接
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB 連接已斷開');
    });

  } catch (error) {
    console.error('❌ MongoDB 初始連接失敗:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
