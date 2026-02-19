
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ success: false, message: messages[0], errors: messages });
  }

  if (err.name === 'JsonWebTokenError')  return res.status(401).json({ success: false, message: 'Invalid token' });
  if (err.name === 'TokenExpiredError')  return res.status(401).json({ success: false, message: 'Token expired' });

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ success: false, message: 'Database error' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
