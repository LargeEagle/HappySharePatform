const { User } = require('../models');
const { generateToken } = require('../middlewares');

/**
 * @route   POST /api/auth/register
 * @desc    註冊新用戶
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;

    // 驗證必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '請提供用戶名、電子郵件和密碼'
      });
    }

    // 檢查用戶是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? '電子郵件已被使用' : '用戶名已被使用'
      });
    }

    // 創建新用戶
    const user = await User.create({
      username,
      email,
      password,
      name: name || username
    });

    // 生成 token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: '註冊成功',
      data: {
        user: user.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    用戶登入
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 驗證必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '請提供電子郵件和密碼'
      });
    }

    // 查找用戶（包含密碼字段）
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '電子郵件或密碼錯誤'
      });
    }

    // 驗證密碼
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '電子郵件或密碼錯誤'
      });
    }

    // 生成 token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: '登入成功',
      data: {
        user: user.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    獲取當前登入用戶信息
 * @access  Private
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

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

module.exports = {
  register,
  login,
  getCurrentUser
};
