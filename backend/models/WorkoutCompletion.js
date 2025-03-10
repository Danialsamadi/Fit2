const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkoutCompletion = sequelize.define('WorkoutCompletion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  workout_plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'WorkoutPlans',
      key: 'id'
    }
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  completion_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  difficulty_rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  }
});

module.exports = WorkoutCompletion; 