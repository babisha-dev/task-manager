

const { Op, fn, col, literal } = require('sequelize');
const { Task } = require('../models');

// GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const {
      status, priority, search,
      sortBy  = 'createdAt',
      order   = 'DESC',
      page    = 1,
      limit   = 10,
    } = req.query;

    const where = { userId: req.user.id };

    if (status)   where.status   = status;
    if (priority) where.priority = priority;

    if (search) {
      where[Op.or] = [
        { title:       { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
      limit:  parseInt(limit),
      offset,
    });

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page:  parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    await task.update(req.body);
    res.status(200).json({ success: true, message: 'Task updated', data: task });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    await task.destroy();
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/stats
exports.getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Raw MySQL GROUP BY query via Sequelize
    const statusCounts = await Task.findAll({
      where: { userId },
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    const priorityCounts = await Task.findAll({
      where: { userId },
      attributes: ['priority', [fn('COUNT', col('id')), 'count']],
      group: ['priority'],
      raw: true,
    });

    const total = await Task.count({ where: { userId } });

    // Build response objects
    const byStatus = { pending: 0, 'in-progress': 0, completed: 0 };
    statusCounts.forEach(r => { byStatus[r.status] = parseInt(r.count); });

    const byPriority = { low: 0, medium: 0, high: 0 };
    priorityCounts.forEach(r => { byPriority[r.priority] = parseInt(r.count); });

    res.status(200).json({
      success: true,
      data: { total, byStatus, byPriority },
    });
  } catch (err) {
    next(err);
  }
};
