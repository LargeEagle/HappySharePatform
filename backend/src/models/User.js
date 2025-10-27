const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '請提供用戶名'],
    unique: true,
    trim: true,
    minlength: [3, '用戶名至少需要3個字符'],
    maxlength: [30, '用戶名不能超過30個字符']
  },
  email: {
    type: String,
    required: [true, '請提供電子郵件'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, '請提供有效的電子郵件地址']
  },
  password: {
    type: String,
    required: [true, '請提供密碼'],
    minlength: [6, '密碼至少需要6個字符'],
    select: false // 查詢時默認不返回密碼
  },
  name: {
    type: String,
    trim: true,
    maxlength: [50, '名字不能超過50個字符']
  },
  bio: {
    type: String,
    maxlength: [500, '個人簡介不能超過500個字符'],
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://i.pravatar.cc/150?img=1'
  },
  postsCount: {
    type: Number,
    default: 0
  },
  followersCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 密碼加密中間件
userSchema.pre('save', async function(next) {
  // 只在密碼被修改時才加密
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 驗證密碼方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 返回公開用戶信息
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    name: this.name,
    bio: this.bio,
    avatar: this.avatar,
    postsCount: this.postsCount,
    followersCount: this.followersCount,
    followingCount: this.followingCount,
    createdAt: this.createdAt
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
