import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoWidget = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch todos');
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post('/api/todos', {
        text: newTodo.trim(),
        completed: false
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      const response = await axios.put(`/api/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === id ? response.data : t));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  if (loading) return <div className="text-center">Loading todos...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold">Todo List</h4>
      
      <form onSubmit={addTodo} className="flex space-x-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add
        </button>
      </form>

      <div className="space-y-2">
        {todos.map(todo => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-3 bg-white rounded-md shadow"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoWidget; 