const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  typeOfWorkout: { type: String, required: true },
  countValue: { type: Number, required: true },
  completedCountValue: { type: Number, required: true },
  timeTaken: { type: String, required: true },
  dateTime: { type: String, required: true },
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
