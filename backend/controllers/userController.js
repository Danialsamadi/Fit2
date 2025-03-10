const { User } = require('../models');

// Get all clients for a coach
exports.getClients = async (req, res) => {
  try {
    // Ensure the user is a coach
    if (req.user.role !== 'coach') {
      return res.status(403).json({
        success: false,
        message: 'Only coaches can access client lists'
      });
    }

    const clients = await User.findAll({
      where: { coach_id: req.user.id },
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all coaches
exports.getCoaches = async (req, res) => {
  try {
    const coaches = await User.findAll({
      where: { role: 'coach' },
      attributes: ['id', 'name', 'email']
    });

    res.status(200).json({
      success: true,
      count: coaches.length,
      data: coaches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get a specific client
exports.getClient = async (req, res) => {
  try {
    const client = await User.findOne({
      where: { 
        id: req.params.id,
        coach_id: req.user.id 
      },
      attributes: { exclude: ['password'] }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found or not assigned to you'
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add a new client
exports.addClient = async (req, res) => {
  try {
    // Ensure the user is a coach
    if (req.user.role !== 'coach') {
      return res.status(403).json({
        success: false,
        message: 'Only coaches can add clients'
      });
    }

    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const client = await User.create({
      name,
      email,
      password,
      role: 'client',
      coach_id: req.user.id
    });

    res.status(201).json({
      success: true,
      data: {
        id: client.id,
        name: client.name,
        email: client.email,
        role: client.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    // Find the user
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user
    await user.update({
      name: name || user.name
    });

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        coach_id: user.coach_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 