var mongoose = require('mongoose');  
var Schema = mongoose.Schema

var TodoSchema = new mongoose.Schema({
  user: { type : Schema.ObjectId, ref : 'User' },
  text: String,
  complete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

mongoose.model('Todo', TodoSchema);

module.exports = mongoose.model('Todo');