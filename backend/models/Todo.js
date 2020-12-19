const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model('Todo', TodoSchema);
