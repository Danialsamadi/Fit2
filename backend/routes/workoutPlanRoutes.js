const express = require('express');
const {
  getCoachWorkoutPlans,
  getClientWorkoutPlans,
  getWorkoutPlan,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan
} = require('../controllers/workoutPlanController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('coach'), getCoachWorkoutPlans)
  .post(authorize('coach'), createWorkoutPlan);

router.route('/client')
  .get(authorize('client'), getClientWorkoutPlans);

router.route('/client/:clientId')
  .get(authorize('coach'), getClientWorkoutPlans);

router.route('/:id')
  .get(getWorkoutPlan)
  .put(authorize('coach'), updateWorkoutPlan)
  .delete(authorize('coach'), deleteWorkoutPlan);

module.exports = router; 