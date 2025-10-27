const { Post, User, Like, Bookmark, Comment } = require('../models');

/**
 * @route   GET /api/posts
 * @desc    獲取所有文章列表
 * @access  Public
 */
const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, authorId } = req.query;
    const skip = (page - 1) * limit;

    // 構建查詢條件
    const query = {};
    if (authorId) {
      query.author = authorId;
    }

    // 獲取文章
    const posts = await Post.find(query)
      .populate('author', 'username name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // 如果用戶已登入，檢查點讚和收藏狀態
    if (req.userId) {
      const postIds = posts.map(p => p._id);
      
      const [likes, bookmarks] = await Promise.all([
        Like.find({
          user: req.userId,
          targetType: 'Post',
          targetId: { $in: postIds }
        }),
        Bookmark.find({
          user: req.userId,
          post: { $in: postIds }
        })
      ]);

      const likedPostIds = new Set(likes.map(l => l.targetId.toString()));
      const bookmarkedPostIds = new Set(bookmarks.map(b => b.post.toString()));

      posts.forEach(post => {
        post._doc.isLiked = likedPostIds.has(post._id.toString());
        post._doc.isBookmarked = bookmarkedPostIds.has(post._id.toString());
      });
    }

    // 獲取總數
    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/posts/:id
 * @desc    獲取單篇文章詳情
 * @access  Public
 */
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 如果用戶已登入，檢查點讚和收藏狀態
    if (req.userId) {
      const [like, bookmark] = await Promise.all([
        Like.findOne({
          user: req.userId,
          targetType: 'Post',
          targetId: post._id
        }),
        Bookmark.findOne({
          user: req.userId,
          post: post._id
        })
      ]);

      post._doc.isLiked = !!like;
      post._doc.isBookmarked = !!bookmark;
    }

    res.json({
      success: true,
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/posts
 * @desc    創建新文章
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: '請提供標題和內容'
      });
    }

    const post = await Post.create({
      title,
      content,
      image,
      author: req.userId
    });

    // 更新用戶的文章數量
    await User.findByIdAndUpdate(req.userId, {
      $inc: { postsCount: 1 }
    });

    // 填充作者信息
    await post.populate('author', 'username name avatar');

    res.status(201).json({
      success: true,
      message: '文章創建成功',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/posts/:id
 * @desc    更新文章
 * @access  Private (只能更新自己的文章)
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;

    // 查找文章
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 檢查是否為作者
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '您只能更新自己的文章'
      });
    }

    // 更新字段
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (image !== undefined) post.image = image;

    await post.save();
    await post.populate('author', 'username name avatar');

    res.json({
      success: true,
      message: '文章更新成功',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/posts/:id
 * @desc    刪除文章
 * @access  Private (只能刪除自己的文章)
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 檢查是否為作者
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '您只能刪除自己的文章'
      });
    }

    // 刪除相關的點讚、收藏和評論
    await Promise.all([
      Like.deleteMany({ targetType: 'Post', targetId: id }),
      Bookmark.deleteMany({ post: id }),
      Comment.deleteMany({ post: id })
    ]);

    // 刪除文章
    await post.deleteOne();

    // 更新用戶的文章數量
    await User.findByIdAndUpdate(req.userId, {
      $inc: { postsCount: -1 }
    });

    res.json({
      success: true,
      message: '文章刪除成功'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/posts/:id/like
 * @desc    點讚/取消點讚文章
 * @access  Private
 */
const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 檢查是否已點讚
    const existingLike = await Like.findOne({
      user: req.userId,
      targetType: 'Post',
      targetId: id
    });

    let isLiked;

    if (existingLike) {
      // 取消點讚
      await existingLike.deleteOne();
      await Post.findByIdAndUpdate(id, {
        $inc: { likesCount: -1 }
      });
      isLiked = false;
    } else {
      // 添加點讚
      await Like.create({
        user: req.userId,
        targetType: 'Post',
        targetId: id
      });
      await Post.findByIdAndUpdate(id, {
        $inc: { likesCount: 1 }
      });
      isLiked = true;
    }

    res.json({
      success: true,
      message: isLiked ? '點讚成功' : '取消點讚成功',
      data: {
        isLiked,
        likesCount: post.likesCount + (isLiked ? 1 : -1)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/posts/:id/bookmark
 * @desc    收藏/取消收藏文章
 * @access  Private
 */
const toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 檢查是否已收藏
    const existingBookmark = await Bookmark.findOne({
      user: req.userId,
      post: id
    });

    let isBookmarked;

    if (existingBookmark) {
      // 取消收藏
      await existingBookmark.deleteOne();
      await Post.findByIdAndUpdate(id, {
        $inc: { bookmarksCount: -1 }
      });
      isBookmarked = false;
    } else {
      // 添加收藏
      await Bookmark.create({
        user: req.userId,
        post: id
      });
      await Post.findByIdAndUpdate(id, {
        $inc: { bookmarksCount: 1 }
      });
      isBookmarked = true;
    }

    res.json({
      success: true,
      message: isBookmarked ? '收藏成功' : '取消收藏成功',
      data: {
        isBookmarked,
        bookmarksCount: post.bookmarksCount + (isBookmarked ? 1 : -1)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark
};
