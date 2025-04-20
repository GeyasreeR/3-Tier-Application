import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import './App.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '', completed: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/todos';

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data } = await axios.get(API_URL);
        setTodos(data);
      } catch (err) {
        setError('Failed to load todos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [API_URL]);

  const addTodo = async () => {
    if (!title.trim()) return;
    
    try {
      setIsLoading(true);
      const { data } = await axios.post(API_URL, {
        title,
        description,
        completed: false
      });
      setTodos(prev => [...prev, data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to add todo');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await axios.put(`${API_URL}/${id}`, editData);
      setTodos(todos.map(todo => todo._id === id ? data : todo));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update todo');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      setIsLoading(true);
      const { data } = await axios.patch(`${API_URL}/${id}`, {
        completed: !currentStatus
      });
      setTodos(todos.map(todo => todo._id === id ? data : todo));
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditData({
      title: todo.title,
      description: todo.description,
      completed: todo.completed
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Geya's Todo App</h1>
        <p>Organize your tasks efficiently</p>
      </header>

      <div className="todo-container">
        <div className="add-todo-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="todo-input"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className="todo-input"
          />
          <button 
            onClick={addTodo}
            className="add-button"
            disabled={isLoading}
          >
            <FiPlus /> Add Task
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="todo-list">
          {isLoading && !todos.length ? (
            <div className="loading">Loading...</div>
          ) : (
            todos.map(todo => (
              <div 
                key={todo._id} 
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                {editingId === todo._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="todo-input"
                    />
                    <input
                      type="text"
                      value={editData.description}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      className="todo-input"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => updateTodo(todo._id)}
                        className="save-button"
                      >
                        <FiCheck /> Save
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="cancel-button"
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-content">
                      <div className="todo-title">{todo.title}</div>
                      <div className="todo-description">{todo.description}</div>
                      <div className="todo-status">
                        Status: {todo.completed ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                    <div className="todo-actions">
                      <button
                        onClick={() => toggleComplete(todo._id, todo.completed)}
                        className={`status-button ${todo.completed ? 'completed' : ''}`}
                      >
                        {todo.completed ? 'Mark Pending' : 'Mark Complete'}
                      </button>
                      <button
                        onClick={() => startEditing(todo)}
                        className="edit-button"
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="delete-button"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;





























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/todos';

// function TodoApp() {
//     const [todos, setTodos] = useState([]);
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [editingId, setEditingId] = useState(null);
//     const [editTitle, setEditTitle] = useState('');
//     const [editDescription, setEditDescription] = useState('');
//     const [editCompleted, setEditCompleted] = useState(false);

//     useEffect(() => {
//         fetchTodos();
//     }, []);

//     const fetchTodos = async () => {
//         try {
//             const response = await axios.get(API_URL);
//             setTodos(response.data);
//         } catch (error) {
//             console.error('Error fetching todos:', error);
//         }
//     };

//     const addTodo = async () => {
//         if (!title.trim()) return;
        
//         try {
//             const response = await axios.post(API_URL, {
//                 title,
//                 description,
//                 completed: false
//             });
//             setTodos([...todos, response.data]);
//             setTitle('');
//             setDescription('');
//         } catch (error) {
//             console.error('Error adding todo:', error);
//         }
//     };

//     const updateTodo = async (id) => {
//         try {
//             const response = await axios.put(`${API_URL}/${id}`, {
//                 title: editTitle,
//                 description: editDescription,
//                 completed: editCompleted
//             });
//             setTodos(todos.map(todo => todo._id === id ? response.data : todo));
//             setEditingId(null);
//         } catch (error) {
//             console.error('Error updating todo:', error);
//         }
//     };

//     const deleteTodo = async (id) => {
//         try {
//             await axios.delete(`${API_URL}/${id}`);
//             setTodos(todos.filter(todo => todo._id !== id));
//         } catch (error) {
//             console.error('Error deleting todo:', error);
//         }
//     };

//     const startEditing = (todo) => {
//         setEditingId(todo._id);
//         setEditTitle(todo.title);
//         setEditDescription(todo.description);
//         setEditCompleted(todo.completed);
//     };

//     const cancelEditing = () => {
//         setEditingId(null);
//     };

//     return (
//         <div className="todo-app">
//             <h1>Todo App</h1>
            
//             <div className="add-todo">
//                 <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Title"
//                 />
//                 <input
//                     type="text"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="Description"
//                 />
//                 <button onClick={addTodo}>Add Todo</button>
//             </div>
            
//             <div className="todo-list">
//                 {todos.map(todo => (
//                     <div key={todo._id} className="todo-item">
//                         {editingId === todo._id ? (
//                             <div className="edit-form">
//                                 <input
//                                     type="text"
//                                     value={editTitle}
//                                     onChange={(e) => setEditTitle(e.target.value)}
//                                 />
//                                 <input
//                                     type="text"
//                                     value={editDescription}
//                                     onChange={(e) => setEditDescription(e.target.value)}
//                                 />
//                                 <label>
//                                     <input
//                                         type="checkbox"
//                                         checked={editCompleted}
//                                         onChange={(e) => setEditCompleted(e.target.checked)}
//                                     />
//                                     Completed
//                                 </label>
//                                 <button onClick={() => updateTodo(todo._id)}>Save</button>
//                                 <button onClick={cancelEditing}>Cancel</button>
//                             </div>
//                         ) : (
//                             <div className="todo-content">
//                                 <h3>{todo.title}</h3>
//                                 <p>{todo.description}</p>
//                                 <p>Status: {todo.completed ? 'Completed' : 'Pending'}</p>
//                                 <button onClick={() => startEditing(todo)}>Edit</button>
//                                 <button onClick={() => deleteTodo(todo._id)}>Delete</button>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default TodoApp;