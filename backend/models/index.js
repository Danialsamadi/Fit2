const User = require('./User');
const Exercise = require('./Exercise');
const WorkoutPlan = require('./WorkoutPlan');
const WorkoutPlanExercise = require('./WorkoutPlanExercise');
const WorkoutCompletion = require('./WorkoutCompletion');

// Define relationships
User.hasMany(User, { as: 'clients', foreignKey: 'coach_id' });
User.belongsTo(User, { as: 'coach', foreignKey: 'coach_id' });

User.hasMany(WorkoutPlan, { as: 'coachPlans', foreignKey: 'coach_id' });
WorkoutPlan.belongsTo(User, { as: 'coach', foreignKey: 'coach_id' });

User.hasMany(WorkoutPlan, { as: 'clientPlans', foreignKey: 'client_id' });
WorkoutPlan.belongsTo(User, { as: 'client', foreignKey: 'client_id' });

WorkoutPlan.belongsToMany(Exercise, { through: WorkoutPlanExercise, foreignKey: 'workout_plan_id' });
Exercise.belongsToMany(WorkoutPlan, { through: WorkoutPlanExercise, foreignKey: 'exercise_id' });

// Workout Completion relationships
WorkoutPlan.hasMany(WorkoutCompletion, { foreignKey: 'workout_plan_id' });
WorkoutCompletion.belongsTo(WorkoutPlan, { foreignKey: 'workout_plan_id' });

User.hasMany(WorkoutCompletion, { foreignKey: 'client_id' });
WorkoutCompletion.belongsTo(User, { as: 'client', foreignKey: 'client_id' });

module.exports = {
  User,
  Exercise,
  WorkoutPlan,
  WorkoutPlanExercise,
  WorkoutCompletion
}; 