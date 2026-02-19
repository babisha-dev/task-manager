

const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

User.hasMany(Task, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'CASCADE',  
  as: 'tasks',
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});


const syncDatabase = async (options = {}) => {
  await sequelize.sync({ alter: true, ...options });
  console.log('✅ MySQL tables synced');
};

module.exports = { sequelize, User, Task, syncDatabase };
