const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '請提供文章標題'],
    trim: true,
    maxlength: [200, '標題不能超過200個字符']
  },
  content: {
    type: String,
    required: [true, '請提供文章內容'],
    maxlength: [10000, '內容不能超過10000個字符']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '文章必須有作者']
  },
  image: {
    type: String,
    default: null
  },
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  bookmarksCount: {
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引優化
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

// 虛擬屬性：獲取評論
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  options: { sort: { createdAt: -1 } }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
