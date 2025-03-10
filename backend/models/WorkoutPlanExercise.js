const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkoutPlanExercise = sequelize.define('WorkoutPlanExercise', {
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
  exercise_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Exercises',
      key: 'id'
    }
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
});

module.exports = WorkoutPlanExercise; 