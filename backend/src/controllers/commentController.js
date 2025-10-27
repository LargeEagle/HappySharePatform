const { Comment, Post, Like } = require('../models');

/**
 * @route   GET /api/posts/:postId/comments
 * @desc    獲取文章的所有評論
 * @access  Public
 */
const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // 檢查文章是否存在
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 獲取評論
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username name avatar')
      .sort({ createdAt: -1 });

    // 如果用戶已登入，檢查點讚狀態
    if (req.userId) {
      const commentIds = comments.map(c => c._id);
      const likes = await Like.find({
        user: req.userId,
        targetType: 'Comment',
        targetId: { $in: commentIds }
      });

      const likedCommentIds = new Set(likes.map(l => l.targetId.toString()));

      comments.forEach(comment => {
        comment._doc.isLiked = likedCommentIds.has(comment._id.toString());
      });
    }

    res.json({
      success: true,
      data: {
        comments,
        total: comments.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/posts/:postId/comments
 * @desc    創建評論
 * @access  Private
 */
const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: '請提供評論內容'
      });
    }

    // 檢查文章是否存在
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 創建評論
    const comment = await Comment.create({
      content,
      author: req.userId,
      post: postId
    });

    // 更新文章的評論數量
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 }
    });

    // 填充作者信息
    await comment.populate('author', 'username name avatar');

    res.status(201).json({
      success: true,
      message: '評論創建成功',
      data: {
        comment
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/comments/:id
 * @desc    刪除評論
 * @access  Private (只能刪除自己的評論)
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '評論不存在'
      });
    }

    // 檢查是否為作者
    if (comment.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '您只能刪除自己的評論'
      });
    }

    // 刪除相關的點讚
    await Like.deleteMany({
      targetType: 'Comment',
      targetId: id
    });

    // 更新文章的評論數量
    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 }
    });

    // 刪除評論
    await comment.deleteOne();

    res.json({
      success: true,
      message: '評論刪除成功'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/comments/:id/like
 * @desc    點讚/取消點讚評論
 * @access  Private
 */
const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '評論不存在'
      });
    }

    // 檢查是否已點讚
    const existingLike = await Like.findOne({
      user: req.userId,
      targetType: 'Comment',
      targetId: id
    });

    let isLiked;

    if (existingLike) {
      // 取消點讚
      await existingLike.deleteOne();
      await Comment.findByIdAndUpdate(id, {
        $inc: { likesCount: -1 }
      });
      isLiked = false;
    } else {
      // 添加點讚
      await Like.create({
        user: req.userId,
        targetType: 'Comment',
        targetId: id
      });
      await Comment.findByIdAndUpdate(id, {
        $inc: { likesCount: 1 }
      });
      isLiked = true;
    }

    res.json({
      success: true,
      message: isLiked ? '點讚成功' : '取消點讚成功',
      data: {
        isLiked,
        likesCount: comment.likesCount + (isLiked ? 1 : -1)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  toggleLike
};
