const mongoose = require('mongoose');

// Define Todo Schema
const todoSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });
  
  // Create Todo Model
  const Todo = mongoose.model('Todo', todoSchema);
  