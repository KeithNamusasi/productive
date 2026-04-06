import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaClock, FaFlag } from 'react-icons/fa';
import { tasksAPI } from '../../services/api';
import { format } from 'date-fns';

const Work = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    tags: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await tasksAPI.getAll();
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        deadline: formData.deadline || null,
      };
      
      if (editingTask) {
        await tasksAPI.update(editingTask._id, taskData);
      } else {
        await tasksAPI.create(taskData);
      }
      fetchTasks();
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      deadline: task.deadline ? format(new Date(task.deadline), 'yyyy-MM-dd') : '',
      tags: task.tags?.join(', ') || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
      tags: '',
    });
  };

  const columns = [
    { id: 'todo', label: 'To Do', color: '#a0a0a0' },
    { id: 'inprogress', label: 'In Progress', color: '#3b82f6' },
    { id: 'done', label: 'Done', color: '#10b981' },
  ];

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Manager</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your tasks with Kanban board</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FaPlus className="mr-2" /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
              <h3 className="text-lg font-semibold">{column.label}</h3>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                ({getTasksByStatus(column.id).length})
              </span>
            </div>
            
            <div className="space-y-3 min-h-[200px]">
              {getTasksByStatus(column.id).map((task) => (
                <motion.div
                  key={task._id}
                  layout
                  draggable
                  onDragEnd={(e, info) => {
                    if (info.offset.x > 100 && column.id !== 'done') {
                      const nextColumn = columns.find(c => c.id === column.id + 1);
                      if (nextColumn) updateStatus(task._id, nextColumn.id);
                    } else if (info.offset.x < -100 && column.id !== 'todo') {
                      const prevColumn = columns.find(c => c.id === column.id - 1);
                      if (prevColumn) updateStatus(task._id, prevColumn.id);
                    }
                  }}
                  className="p-4 rounded-lg cursor-move"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(task)} className="text-gray-400 hover:text-[#6366f1]">
                        <FaEdit className="text-sm" />
                      </button>
                      <button onClick={() => handleDelete(task._id)} className="text-gray-400 hover:text-red-500">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaFlag className={`text-xs ${getPriorityColor(task.priority)}`} />
                      <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                        {task.priority}
                      </span>
                    </div>
                    {task.deadline && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <FaClock />
                        {format(new Date(task.deadline), 'MMM d')}
                      </div>
                    )}
                  </div>
                  
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-0.5 rounded text-xs"
                          style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              
              {getTasksByStatus(column.id).length === 0 && (
                <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No tasks in {column.label.toLowerCase()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="card w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field h-24 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Deadline</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="input-field"
                    placeholder="work, urgent, project"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingTask ? 'Update' : 'Add Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Work;