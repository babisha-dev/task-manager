const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  validateProfileUpdate, validatePasswordChange, handleValidationErrors
} = require('../middleware/validation');
const {
  getProfile, updateProfile, changePassword, deleteAccount
} = require('../controllers/userController');

router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(validateProfileUpdate, handleValidationErrors, updateProfile);

router.put('/change-password', validatePasswordChange, handleValidationErrors, changePassword);
router.delete('/account', deleteAccount);

module.exports = router;
