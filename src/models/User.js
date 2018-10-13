const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {type: String, lowercase: true, index: {unique: true}},
  password: String
}, {
    timestamps: true
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');