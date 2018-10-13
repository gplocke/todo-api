var mongoose = require('mongoose');  
var Schema = mongoose.Schema

var TodoSchema = new mongoose.Schema({
  user: { type : Schema.ObjectId, ref : 'User' },
  text: String
}, {
  timestamps: true
});

mongoose.model('Todo', TodoSchema);

module.exports = mongoose.model('Todo');