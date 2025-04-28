import { useState, useEffect } from 'react';
import { Check, Trash2, Edit, Plus, X, Save } from 'lucide-react';

// Main Todo App Component
export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - replace with your actual backend URL when deploying
  const API_URL = 'http://localhost:5000/api/todos';

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos
  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Please try again later.');
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo, completed: false }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      
      const addedTodo = await response.json();
      setTodos([...todos, addedTodo]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error('Error adding todo:', err);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
    }
  };

  // Toggle todo completion status
  const handleToggleComplete = async (id) => {
    const todoToUpdate = todos.find(todo => todo._id === id);
    if (!todoToUpdate) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todoToUpdate.completed }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  // Start editing a todo
  const handleEditStart = (todo) => {
    setEditId(todo._id);
    setEditText(todo.text);
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditId(null);
    setEditText('');
  };

  // Save edited todo
  const handleEditSave = async (id) => {
    if (!editText.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, text: editText } : todo
      ));
      setEditId(null);
      setEditText('');
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">Todo App</h1>
        
        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="flex mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add
          </button>
        </form>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          /* Todo List */
          <ul className="space-y-3">
            {todos.length === 0 ? (
              <li className="text-center py-4 text-gray-500">No todos yet. Add one above!</li>
            ) : (
              todos.map(todo => (
                <li 
                  key={todo._id} 
                  className={`flex items-center justify-between p-3 rounded-lg shadow-sm border ${
                    todo.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  {editId === todo._id ? (
                    /* Edit Mode */
                    <div className="flex items-center justify-between w-full">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-grow px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 mr-2"
                        autoFocus
                      />
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditSave(todo._id)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleToggleComplete(todo._id)}
                          className={`p-1 mr-2 rounded-full ${
                            todo.completed ? 'bg-green-500 text-white' : 'border border-gray-300'
                          }`}
                        >
                          {todo.completed && <Check size={16} />}
                        </button>
                        <span 
                          className={`${
                            todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditStart(todo)}
                          className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                          disabled={todo.completed}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
        
        {/* Todo Count */}
        {todos.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            <p>
              {todos.filter(todo => todo.completed).length} completed / {todos.length} total
            </p>
          </div>
        )}
      </div>
    </div>
  );
}