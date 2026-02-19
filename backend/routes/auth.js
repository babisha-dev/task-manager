const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation');
const { register, login, getMe, logout } = require('../controllers/authController');

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login',    validateLogin,    handleValidationErrors, login);
router.get('/me',        protect, getMe);
router.post('/logout',   protect, logout);

module.exports = router;
