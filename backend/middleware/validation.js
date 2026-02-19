

const { body, validationResult } = require('express-validator');

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.param, message: e.msg })),
    });
  }
  next();
};

exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Min 6 characters')
    .matches(/\d/).withMessage('Must contain a number'),
];

exports.validateLogin = [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.validateTask = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').optional().trim()
    .isLength({ max: 500 }).withMessage('Max 500 characters'),
  body('status').optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
];

exports.validateProfileUpdate = [
  body('name').optional().trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').optional().trim()
    .isEmail().withMessage('Invalid email').normalizeEmail(),
  body('avatar').optional().trim()
    .isURL().withMessage('Avatar must be a valid URL'),
];

exports.validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('Min 6 characters')
    .matches(/\d/).withMessage('Must contain a number'),
];
