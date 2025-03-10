const express = require('express');
const { getExercises, getExercise, createExercise } = require('../controllers/exerciseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getExercises)
  .post(authorize('coach'), createExercise);

router.route('/:id')
  .get(getExercise);

module.exports = router; 