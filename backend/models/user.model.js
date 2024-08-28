const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  workouts: [{
    typeOfWorkout: String,
    countValue: Number,
    completedCountValue: Number,
    timeTaken: String,
    dateTime: String
  }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
