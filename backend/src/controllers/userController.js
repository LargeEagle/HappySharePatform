const { User, Post } = require('../models');

/**
 * @route   GET /api/users/:id
 * @desc    獲取用戶資料
 * @access  Public
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用戶不存在'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    更新用戶資料
 * @access  Private (只能更新自己的資料)
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 檢查是否為本人
    if (id !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '您只能更新自己的資料'
      });
    }

    // 允許更新的字段
    const allowedFields = ['name', 'bio', 'avatar'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: '沒有提供要更新的字段'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用戶不存在'
      });
    }

    res.json({
      success: true,
      message: '資料更新成功',
      data: {
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/:id/posts
 * @desc    獲取用戶的所有文章
 * @access  Public
 */
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 檢查用戶是否存在
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用戶不存在'
      });
    }

    // 獲取用戶的文章
    const posts = await Post.find({ author: id })
      .populate('author', 'username name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        posts,
        total: posts.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/users/avatar
 * @desc    上傳用戶頭像
 * @access  Private
 */
const uploadAvatar = async (req, res, next) => {
  try {
    // 這裡暫時使用隨機頭像 URL
    // 實際應該使用 multer + AWS S3 或其他文件存儲服務
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({
        success: false,
        message: '請提供頭像 URL'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({
      success: true,
      message: '頭像上傳成功',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserPosts,
  uploadAvatar
};
