const { WorkoutPlan, WorkoutPlanExercise, Exercise, User, sequelize } = require('../models');

// Get all workout plans for a coach
exports.getCoachWorkoutPlans = async (req, res) => {
  try {
    // Ensure the user is a coach
    if (req.user.role !== 'coach') {
      return res.status(403).json({
        success: false,
        message: 'Only coaches can access their workout plans'
      });
    }

    const workoutPlans = await WorkoutPlan.findAll({
      where: { coach_id: req.user.id },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Exercise,
          through: {
            attributes: ['sets', 'reps', 'weight']
          }
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: workoutPlans.length,
      data: workoutPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all workout plans for a client
exports.getClientWorkoutPlans = async (req, res) => {
  try {
    const clientId = req.user.role === 'client' ? req.user.id : req.params.clientId;

    // If coach is trying to access client's plans, verify the client belongs to them
    if (req.user.role === 'coach') {
      const client = await User.findOne({
        where: { id: clientId, coach_id: req.user.id }
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found or not assigned to you'
        });
      }
    }

    const workoutPlans = await WorkoutPlan.findAll({
      where: { client_id: clientId },
      include: [
        {
          model: User,
          as: 'coach',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Exercise,
          through: {
            attributes: ['sets', 'reps', 'weight']
          }
        }
      ],
      order: [['date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: workoutPlans.length,
      data: workoutPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get a single workout plan
exports.getWorkoutPlan = async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'coach',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Exercise,
          through: {
            attributes: ['sets', 'reps', 'weight']
          }
        }
      ]
    });

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }

    // Check if the user has access to this workout plan
    if (
      req.user.role === 'coach' && workoutPlan.coach_id !== req.user.id ||
      req.user.role === 'client' && workoutPlan.client_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this workout plan'
      });
    }

    res.status(200).json({
      success: true,
      data: workoutPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a new workout plan
exports.createWorkoutPlan = async (req, res) => {
  try {
    // Ensure the user is a coach
    if (req.user.role !== 'coach') {
      return res.status(403).json({
        success: false,
        message: 'Only coaches can create workout plans'
      });
    }

    const { client_id, date, topic, description } = req.body;

    // Validate required fields
    if (!client_id || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide client_id and date'
      });
    }

    // Check if client exists and belongs to this coach
    const client = await User.findOne({
      where: { 
        id: client_id,
        coach_id: req.user.id
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found or not assigned to you'
      });
    }

    // Create workout plan
    const workoutPlan = await WorkoutPlan.create({
      coach_id: req.user.id,
      client_id,
      date,
      topic: topic || 'General Workout',
      description
    });

    res.status(201).json({
      success: true,
      data: workoutPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update a workout plan
exports.updateWorkoutPlan = async (req, res) => {
  try {
    // Ensure the user is a coach
    if (req.user.role !== 'coach') {
      return res.status(403).json({
        success: false,
        message: 'Only coaches can update workout plans'
      });
    }

    const { client_id, date, topic, description } = req.body;

    // Find the workout plan
    const workoutPlan = await WorkoutPlan.findOne({
      where: { 
        id: req.params.id,
        coach_id: req.user.id
      }
    });

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found or not created by you'
      });
    }

    // If client_id is provided, check if client exists and belongs to this coach
    if (client_id) {
      const client = await User.findOne({
        where: { 
          id: client_id,
          coach_id: req.user.id
        }
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found or not assigned to you'
        });
      }
    }

    // Update workout plan
    await workoutPlan.update({
      client_id: client_id || workoutPlan.client_id,
      date: date || workoutPlan.date,
      topic: topic !== undefined ? topic : workoutPlan.topic,
      description: description !== undefined ? description : workoutPlan.description
    });

    res.status(200).json({
      success: true,
      data: workoutPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a workout plan
exports.deleteWorkoutPlan = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Ensure the user is a coach
    if (req.user.role !== 'coach') {
      return res.status(403).json({
        success: false,
        message: 'Only coaches can delete workout plans'
      });
    }

    // Check if workout plan exists and belongs to the coach
    const workoutPlan = await WorkoutPlan.findOne({
      where: { id: req.params.id, coach_id: req.user.id }
    });

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found or not created by you'
      });
    }

    // Delete workout plan exercises
    await WorkoutPlanExercise.destroy({
      where: { workout_plan_id: workoutPlan.id },
      transaction: t
    });

    // Delete workout plan
    await workoutPlan.destroy({ transaction: t });

    await t.commit();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 