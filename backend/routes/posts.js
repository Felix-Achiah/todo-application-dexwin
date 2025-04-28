const router = require("express").Router();
const Todo = require("../models/todo");


// CRUD API Routes

// Get all todos
app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find().sort({ createdAt: -1 });
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // Create a new todo
  app.post('/todos', async (req, res) => {
    try {
      const { text, completed } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: 'Text is required' });
      }
      
      const newTodo = new Todo({
        text,
        completed: completed || false
      });
      
      const savedTodo = await newTodo.save();
      res.status(201).json(savedTodo);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // Update a todo
  app.patch('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedTodo = await Todo.findByIdAndUpdate(
        id, 
        updates, 
        { new: true, runValidators: true }
      );
      
      if (!updatedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      
      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // Delete a todo
  app.delete('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const deletedTodo = await Todo.findByIdAndDelete(id);
      
      if (!deletedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      
      res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });