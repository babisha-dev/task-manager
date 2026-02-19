
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len:      { args: [3, 100], msg: 'Title must be between 3 and 100 characters' },
      notEmpty: { msg: 'Title is required' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: { args: [0, 500], msg: 'Description cannot exceed 500 characters' },
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending',
    validate: {
      isIn: {
        args: [['pending', 'in-progress', 'completed']],
        msg: 'Invalid status value',
      },
    },
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    validate: {
      isIn: {
        args: [['low', 'medium', 'high']],
        msg: 'Invalid priority value',
      },
    },
  },
  dueDate: {
    type: DataTypes.DATEONLY,  // DATE column in MySQL (no time)
    allowNull: true,
    validate: {
      isDate: { msg: 'Invalid date format' },
    },
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'tasks',
  indexes: [
    { fields: ['userId', 'status'] },
    { fields: ['userId', 'priority'] },
    { fields: ['userId', 'createdAt'] },
  ],
  hooks: {
    beforeSave: (task) => {
      if (task.status === 'completed' && !task.completedAt) {
        task.completedAt = new Date();
        task.isCompleted = true;
      } else if (task.status !== 'completed') {
        task.completedAt = null;
        task.isCompleted  = false;
      }
    },
  },
});

module.exports = Task;
