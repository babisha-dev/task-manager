

const { User } = require('../models');
const { generateToken } = require('../middleware/auth');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      data: { user: user.getPublicProfile(), token },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: { include: ['password'] },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: user.getPublicProfile(), token },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.status(200).json({ success: true, data: user.getPublicProfile() });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
