const express = require('express');
const {
  getClientCompletions,
  getPlanCompletions,
  createCompletion,
  updateCompletion,
  deleteCompletion
} = require('../controllers/workoutCompletionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Client completions routes
router.route('/client')
  .get(getClientCompletions); // Get logged-in client's completions

router.route('/client/:clientId')
  .get(authorize('coach'), getClientCompletions); // Get specific client's completions (coach only)

// Plan completions routes
router.route('/plan/:planId')
  .get(getPlanCompletions); // Get completions for a specific plan

// Completion CRUD routes
router.route('/')
  .post(authorize('client'), createCompletion); // Create completion (client only)

router.route('/:id')
  .put(authorize('client'), updateCompletion) // Update completion (client only)
  .delete(authorize('client'), deleteCompletion); // Delete completion (client only)

module.exports = router; 