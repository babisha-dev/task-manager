const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { validateTask, handleValidationErrors } = require('../middleware/validation');
const {
  getTasks, getTask, createTask, updateTask, deleteTask, getTaskStats
} = require('../controllers/taskController');

router.use(protect);  // all task routes require auth

router.get('/stats', getTaskStats);

router.route('/')
  .get(getTasks)
  .post(validateTask, handleValidationErrors, createTask);

router.route('/:id')
  .get(getTask)
  .put(validateTask, handleValidationErrors, updateTask)
  .delete(deleteTask);

module.exports = router;
