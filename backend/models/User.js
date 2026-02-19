
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: { args: [2, 50], msg: 'Name must be between 2 and 50 characters' },
      notEmpty: { msg: 'Name is required' },
    },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: { msg: 'Email already exists' },
    validate: {
      isEmail: { msg: 'Please provide a valid email' },
      notEmpty: { msg: 'Email is required' },
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: { args: [6, 255], msg: 'Password must be at least 6 characters' },
    },
  },
  avatar: {
    type: DataTypes.STRING(500),
    defaultValue: 'https://via.placeholder.com/150',
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  hooks: {
    // Hash password before create or update
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Instance method: compare passwords
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method: return safe public profile (no password)
User.prototype.getPublicProfile = function () {
  return {
    id:        this.id,
    name:      this.name,
    email:     this.email,
    avatar:    this.avatar,
    role:      this.role,
    createdAt: this.createdAt,
  };
};

module.exports = User;
