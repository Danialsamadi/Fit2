const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkoutPlan = sequelize.define('WorkoutPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  coach_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General Workout'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = WorkoutPlan; 