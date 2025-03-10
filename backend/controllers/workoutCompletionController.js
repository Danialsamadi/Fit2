const { WorkoutCompletion, WorkoutPlan, User } = require('../models');

// Get all workout completions for a client
exports.getClientCompletions = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get client ID (either the logged-in client or a client of the coach)
    const clientId = req.user.role === 'client' ? req.user.id : req.params.clientId;

    // If coach is trying to access client's completions, verify the client belongs to them
    if (req.user.role === 'coach' && req.params.clientId) {
      const client = await User.findOne({
        where: { 
          id: clientId,
          coach_id: req.user.id
        }
      });

      if (!client) {
        return res.status(403).json({
          success: false,
          message: 'This client is not assigned to you'
        });
      }
    }

    // Get completions
    const completions = await WorkoutCompletion.findAll({
      where: { client_id: clientId },
      include: [
        {
          model: WorkoutPlan,
          attributes: ['id', 'date', 'topic', 'description'],
          include: [
            {
              model: User,
              as: 'coach',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['completion_date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: completions.length,
      data: completions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all workout completions for a workout plan
exports.getPlanCompletions = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { planId } = req.params;

    // Find the workout plan
    const workoutPlan = await WorkoutPlan.findByPk(planId);

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }

    // Check if user has access to this plan
    if (
      req.user.role === 'coach' && workoutPlan.coach_id !== req.user.id ||
      req.user.role === 'client' && workoutPlan.client_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this workout plan'
      });
    }

    // Get completions
    const completions = await WorkoutCompletion.findAll({
      where: { workout_plan_id: planId },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['completion_date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: completions.length,
      data: completions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a workout completion
exports.createCompletion = async (req, res) => {
  try {
    // Ensure the user is a client
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can mark workout plans as completed'
      });
    }

    const { workout_plan_id, completed, feedback, difficulty_rating } = req.body;

    // Validate required fields
    if (!workout_plan_id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide workout_plan_id'
      });
    }

    // Check if workout plan exists and belongs to this client
    const workoutPlan = await WorkoutPlan.findOne({
      where: { 
        id: workout_plan_id,
        client_id: req.user.id
      }
    });

    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found or not assigned to you'
      });
    }

    // Check if completion already exists for this plan
    const existingCompletion = await WorkoutCompletion.findOne({
      where: { 
        workout_plan_id,
        client_id: req.user.id
      }
    });

    if (existingCompletion) {
      // Update existing completion
      await existingCompletion.update({
        completed: completed !== undefined ? completed : existingCompletion.completed,
        feedback: feedback !== undefined ? feedback : existingCompletion.feedback,
        difficulty_rating: difficulty_rating !== undefined ? difficulty_rating : existingCompletion.difficulty_rating,
        completion_date: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'Workout completion updated',
        data: existingCompletion
      });
    }

    // Create new completion
    const completion = await WorkoutCompletion.create({
      workout_plan_id,
      client_id: req.user.id,
      completed: completed !== undefined ? completed : true,
      feedback,
      difficulty_rating
    });

    res.status(201).json({
      success: true,
      data: completion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update a workout completion
exports.updateCompletion = async (req, res) => {
  try {
    // Ensure the user is a client
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can update workout completions'
      });
    }

    const { completed, feedback, difficulty_rating } = req.body;

    // Find the completion
    const completion = await WorkoutCompletion.findOne({
      where: { 
        id: req.params.id,
        client_id: req.user.id
      }
    });

    if (!completion) {
      return res.status(404).json({
        success: false,
        message: 'Workout completion not found or not created by you'
      });
    }

    // Update completion
    await completion.update({
      completed: completed !== undefined ? completed : completion.completed,
      feedback: feedback !== undefined ? feedback : completion.feedback,
      difficulty_rating: difficulty_rating !== undefined ? difficulty_rating : completion.difficulty_rating,
      completion_date: new Date()
    });

    res.status(200).json({
      success: true,
      data: completion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a workout completion
exports.deleteCompletion = async (req, res) => {
  try {
    // Ensure the user is a client
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can delete workout completions'
      });
    }

    // Find the completion
    const completion = await WorkoutCompletion.findOne({
      where: { 
        id: req.params.id,
        client_id: req.user.id
      }
    });

    if (!completion) {
      return res.status(404).json({
        success: false,
        message: 'Workout completion not found or not created by you'
      });
    }

    // Delete completion
    await completion.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 