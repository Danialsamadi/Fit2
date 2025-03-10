const { Exercise } = require('../models');

// Get all exercises
exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll();

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single exercise
exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new exercise
exports.createExercise = async (req, res) => {
  try {
    // Only coaches can create exercises
    if (req.user.role !== 'coach') {
      return res.status(403).json({
        success: false,
        message: 'Only coaches can create exercises'
      });
    }

    const { name, description } = req.body;

    const exercise = await Exercise.create({
      name,
      description
    });

    res.status(201).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 