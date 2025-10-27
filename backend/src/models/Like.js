const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 支援對文章或評論的點讚
  targetType: {
    type: String,
    enum: ['Post', 'Comment'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 複合唯一索引：確保同一用戶不能對同一目標點讚多次
likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

// 查詢優化索引
likeSchema.index({ targetType: 1, targetId: 1 });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
