

const { User, Task } = require('../models');

// GET /api/users/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user.getPublicProfile() });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    const updates = {};
    if (name)   updates.name   = name;
    if (email)  updates.email  = email;
    if (avatar) updates.avatar = avatar;

    // Check email uniqueness if changing
    if (email && email !== req.user.email) {
      const taken = await User.findOne({ where: { email } });
      if (taken) return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const user = await User.findByPk(req.user.id);
    await user.update(updates);

    res.status(200).json({ success: true, message: 'Profile updated', data: user.getPublicProfile() });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { include: ['password'] },
    });

    const match = await user.comparePassword(currentPassword);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Trigger beforeUpdate hook which hashes the password
    await user.update({ password: newPassword });

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/account
exports.deleteAccount = async (req, res, next) => {
  try {
    // CASCADE delete via association removes tasks automatically
    await User.destroy({ where: { id: req.user.id } });
    res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
};
