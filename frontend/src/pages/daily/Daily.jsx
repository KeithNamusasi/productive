import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaCheck, FaClock, FaSun, FaMoon, FaCloud } from 'react-icons/fa';
import { timeblocksAPI, habitsAPI } from '../../services/api';
import { format } from 'date-fns';

const Daily = () => {
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTimeBlockModal, setShowTimeBlockModal] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [editingTimeBlock, setEditingTimeBlock] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [timeBlockForm, setTimeBlockForm] = useState({ title: '', description: '', timeOfDay: 'morning', category: 'general' });
  const [habitForm, setHabitForm] = useState({ name: '', color: '#6366f1' });

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const [timeBlocksRes, habitsRes] = await Promise.all([
        timeblocksAPI.getAll(selectedDate),
        habitsAPI.getAll(),
      ]);
      setTimeBlocks(timeBlocksRes.data);
      setHabits(habitsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeBlockSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTimeBlock) {
        await timeblocksAPI.update(editingTimeBlock._id, { ...timeBlockForm, date: selectedDate });
      } else {
        await timeblocksAPI.create({ ...timeBlockForm, date: selectedDate });
      }
      fetchData();
      closeTimeBlockModal();
    } catch (error) {
      console.error('Error saving time block:', error);
    }
  };

  const handleHabitSubmit = async (e) => {
    e.preventDefault();
    try {
      await habitsAPI.create(habitForm);
      fetchData();
      closeHabitModal();
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const toggleHabit = async (id) => {
    try {
      await habitsAPI.toggle(id);
      fetchData();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const toggleTimeBlockComplete = async (id, completed) => {
    try {
      await timeblocksAPI.update(id, { completed: !completed });
      fetchData();
    } catch (error) {
      console.error('Error updating time block:', error);
    }
  };

  const handleDeleteTimeBlock = async (id) => {
    try {
      await timeblocksAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting time block:', error);
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      await habitsAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const openEditTimeBlock = (block) => {
    setEditingTimeBlock(block);
    setTimeBlockForm({
      title: block.title,
      description: block.description || '',
      timeOfDay: block.timeOfDay,
      category: block.category || 'general',
    });
    setShowTimeBlockModal(true);
  };

  const closeTimeBlockModal = () => {
    setShowTimeBlockModal(false);
    setEditingTimeBlock(null);
    setTimeBlockForm({ title: '', description: '', timeOfDay: 'morning', category: 'general' });
  };

  const closeHabitModal = () => {
    setShowHabitModal(false);
    setHabitForm({ name: '', color: '#6366f1' });
  };

  const timeOfDayConfig = {
    morning: { icon: FaSun, label: 'Morning', color: '#f97316' },
    afternoon: { icon: FaCloud, label: 'Afternoon', color: '#3b82f6' },
    evening: { icon: FaMoon, label: 'Evening', color: '#a855f7' },
  };

  const getBlocksByTimeOfDay = (timeOfDay) => timeBlocks.filter(b => b.timeOfDay === timeOfDay);

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
          <h1 className="text-3xl font-bold">Daily Planner</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Plan your day and track habits</p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
          <button onClick={() => setShowTimeBlockModal(true)} className="btn-primary">
            <FaPlus className="mr-2" /> Add Block
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Time Blocks</h2>
          {Object.entries(timeOfDayConfig).map(([timeOfDay, config]) => {
            const Icon = config.icon;
            const blocks = getBlocksByTimeOfDay(timeOfDay);
            return (
              <div key={timeOfDay} className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="text-lg" style={{ color: config.color }} />
                  <h3 className="font-semibold">{config.label}</h3>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>({blocks.length})</span>
                </div>
                <div className="space-y-2">
                  {blocks.map(block => (
                    <div key={block._id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <button onClick={() => toggleTimeBlockComplete(block._id, block.completed)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${block.completed ? 'bg-[#10b981] border-[#10b981]' : 'border-gray-500'}`}>
                        {block.completed && <FaCheck className="text-xs text-white" />}
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${block.completed ? 'line-through opacity-60' : ''}`}>{block.title}</p>
                        {block.description && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{block.description}</p>}
                      </div>
                      <button onClick={() => openEditTimeBlock(block)} className="text-gray-400 hover:text-[#6366f1]">
                        <FaClock className="text-sm" />
                      </button>
                      <button onClick={() => handleDeleteTimeBlock(block._id)} className="text-gray-400 hover:text-red-500">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  ))}
                  {blocks.length === 0 && (
                    <p className="text-center py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>No blocks planned</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Habit Tracker</h2>
            <button onClick={() => setShowHabitModal(true)} className="btn-secondary text-sm py-2">
              <FaPlus className="mr-2" /> Add Habit
            </button>
          </div>
          
          <div className="card">
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{format(new Date(selectedDate), 'EEEE, MMMM d')}</p>
            <div className="space-y-3">
              {habits.map(habit => (
                <div key={habit._id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <button onClick={() => toggleHabit(habit._id)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${habit.completedToday ? 'bg-[#ec4899] border-[#ec4899]' : 'border-gray-500'}`}>
                    {habit.completedToday && <FaCheck className="text-sm text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className="font-medium">{habit.name}</p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="text-orange-500">{habit.streak} day streak</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteHabit(habit._id)} className="text-gray-400 hover:text-red-500">
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              ))}
              {habits.length === 0 && (
                <p className="text-center py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>No habits yet. Build your daily habits!</p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Today's Progress</h3>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#ec4899]">{habits.filter(h => h.completedToday).length}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{habits.length - habits.filter(h => h.completedToday).length}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>remaining</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#10b981]">
                  {habits.length > 0 ? Math.round((habits.filter(h => h.completedToday).length / habits.length) * 100) : 0}%
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>progress</p>
              </div>
            </div>
            <div className="mt-4 h-3 rounded-full bg-[#333] overflow-hidden">
              <div className="h-full rounded-full bg-[#ec4899] transition-all" style={{ width: `${habits.length > 0 ? (habits.filter(h => h.completedToday).length / habits.length) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTimeBlockModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeTimeBlockModal}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4">{editingTimeBlock ? 'Edit Time Block' : 'Add Time Block'}</h2>
              <form onSubmit={handleTimeBlockSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input type="text" value={timeBlockForm.title} onChange={e => setTimeBlockForm({ ...timeBlockForm, title: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea value={timeBlockForm.description} onChange={e => setTimeBlockForm({ ...timeBlockForm, description: e.target.value })} className="input-field h-20 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Time of Day</label>
                    <select value={timeBlockForm.timeOfDay} onChange={e => setTimeBlockForm({ ...timeBlockForm, timeOfDay: e.target.value })} className="input-field">
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input type="text" value={timeBlockForm.category} onChange={e => setTimeBlockForm({ ...timeBlockForm, category: e.target.value })} className="input-field" placeholder="work, personal" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeTimeBlockModal} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editingTimeBlock ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHabitModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeHabitModal}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4">Add Habit</h2>
              <form onSubmit={handleHabitSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input type="text" value={habitForm.name} onChange={e => setHabitForm({ ...habitForm, name: e.target.value })} className="input-field" placeholder="Exercise, Read, Meditate" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <input type="color" value={habitForm.color} onChange={e => setHabitForm({ ...habitForm, color: e.target.value })} className="w-full h-12 rounded-lg cursor-pointer" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeHabitModal} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Add</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Daily;