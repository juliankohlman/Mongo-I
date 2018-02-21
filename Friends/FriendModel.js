const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide firstName, lastName and age for the friend.']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide firstName, lastName and age for the friend.']
  },
  age: {
    type: Number,
    min: [1, 'Age must be a whole number between 1 and 120'],
    max: [120,'Age must be a whole number between 1 and 120'],
    required: [true, 'Please provide firstName, lastName and age for the friend.']
  },
  createdOn: {
    type: Date,
    default: Date.now,
    required: [true, 'There was an error while saving the friend to the database']
  }
})

const FriendModel = mongoose.model('Friend', FriendSchema);

module.exports = FriendModel;