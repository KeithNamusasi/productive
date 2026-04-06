import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FaBook, FaBriefcase, FaCalendarAlt, FaStickyNote,
  FaPlus, FaChevronRight, FaFire, FaClock,
  FaCheckCircle, FaTasks
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { booksAPI, tasksAPI, assignmentsAPI, habitsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const greeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, tasksRes, assignmentsRes, habitsRes] = await Promise.all([
          booksAPI.getAll(),
          tasksAPI.getAll(),
          assignmentsAPI.getAll(),
          habitsAPI.getAll(),
        ]);
        setBooks(booksRes.data);
        setTasks(tasksRes.data);
        setAssignments(assignmentsRes.data);
        setHabits(habitsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentBook = books.find(b => b.status === 'reading');
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const upcomingAssignments = assignments
    .filter(a => new Date(a.dueDate) > currentDate && a.status !== 'graded')
    .slice(0, 3);
  const completedHabitsToday = habits.filter(h => h.completedToday).length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="card" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{greeting()}, {user?.name?.split(' ')[0] || 'User'}!</h1>
            <p className="text-white/80">{format(currentDate, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-white/60 text-sm mt-1">{format(currentDate, 'h:mm a')}</p>
          </div>
          <div className="text-white/20">
            <FaCalendarAlt className="text-6xl" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item} className="card cursor-pointer hover:border-[#10b981]/50" onClick={() => navigate('/reading')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#10b981]/20 flex items-center justify-center">
              <FaBook className="text-[#10b981]" />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Reading</span>
          </div>
          <p className="text-2xl font-bold">{books.filter(b => b.status === 'reading').length}</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>books in progress</p>
          {currentBook && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>{currentBook.title}</span>
                <span>{Math.round((currentBook.currentPage / currentBook.totalPages) * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-[#10b981]" 
                  style={{ width: `${(currentBook.currentPage / currentBook.totalPages) * 100}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>

        <motion.div variants={item} className="card cursor-pointer hover:border-[#3b82f6]/50" onClick={() => navigate('/work')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/20 flex items-center justify-center">
              <FaBriefcase className="text-[#3b82f6]" />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Work</span>
          </div>
          <p className="text-2xl font-bold">{todoTasks.length}</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>tasks to do</p>
          <div className="mt-3 flex gap-2">
            {tasks.filter(t => t.priority === 'high').slice(0, 2).map(t => (
              <span key={t._id} className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs">
                {t.title.slice(0, 10)}...
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="card cursor-pointer hover:border-[#a855f7]/50" onClick={() => navigate('/school')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#a855f7]/20 flex items-center justify-center">
              <FaTasks className="text-[#a855f7]" />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>School</span>
          </div>
          <p className="text-2xl font-bold">{upcomingAssignments.length}</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>upcoming deadlines</p>
        </motion.div>

        <motion.div variants={item} className="card cursor-pointer hover:border-[#ec4899]/50" onClick={() => navigate('/daily')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#ec4899]/20 flex items-center justify-center">
              <FaCheckCircle className="text-[#ec4899]" />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Habits</span>
          </div>
          <p className="text-2xl font-bold">{completedHabitsToday}/{habits.length}</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>completed today</p>
          {habits.length > 0 && (
            <div className="mt-3 flex gap-1">
              {habits.slice(0, 5).map(h => (
                <div 
                  key={h._id} 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${h.completedToday ? 'bg-[#ec4899] text-white' : 'bg-white/20 text-white/60'}`}
                >
                  ✓
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Today's Tasks</h3>
            <button 
              onClick={() => navigate('/work')}
              className="text-[#6366f1] text-sm flex items-center gap-1 hover:underline"
            >
              View All <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="space-y-3">
            {todoTasks.slice(0, 5).map(task => (
              <div key={task._id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'high' ? 'bg-red-500' : 
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{task.title}</p>
                  {task.deadline && (
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <FaClock className="inline mr-1" />
                      {format(new Date(task.deadline), 'MMM d')}
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  task.status === 'done' ? 'bg-green-500/20 text-green-400' :
                  task.status === 'inprogress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {task.status === 'todo' ? 'To Do' : task.status === 'inprogress' ? 'In Progress' : 'Done'}
                </span>
              </div>
            ))}
            {todoTasks.length === 0 && (
              <p className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No tasks for today</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
            <button 
              onClick={() => navigate('/school')}
              className="text-[#6366f1] text-sm flex items-center gap-1 hover:underline"
            >
              View All <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAssignments.map(assignment => (
              <div key={assignment._id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${assignment.subject?.color}20` }}>
                  <FaBook className="text-sm" style={{ color: assignment.subject?.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{assignment.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{assignment.subject?.name}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  new Date(assignment.dueDate) < new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000) 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {format(new Date(assignment.dueDate), 'MMM d')}
                </span>
              </div>
            ))}
            {upcomingAssignments.length === 0 && (
              <p className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No upcoming deadlines</p>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Habit Streaks</h3>
          <button 
            onClick={() => navigate('/daily')}
            className="text-[#6366f1] text-sm flex items-center gap-1 hover:underline"
          >
            Manage <FaChevronRight className="text-xs" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {habits.slice(0, 4).map(habit => (
            <div key={habit._id} className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <FaFire className="text-2xl mx-auto mb-2 text-orange-500" />
              <p className="font-medium">{habit.name}</p>
              <p className="text-2xl font-bold text-[#6366f1]">{habit.streak}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>day streak</p>
            </div>
          ))}
          {habits.length === 0 && (
            <div className="col-span-4 text-center py-4" style={{ color: 'var(--text-secondary)' }}>
              No habits yet. Start building your daily habits!
            </div>
          )}
        </div>
      </motion.div>

      <motion.button
        variants={item}
        onClick={() => navigate('/notes')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#6366f1] text-white flex items-center justify-center shadow-lg hover:bg-[#5558e3] transition-colors z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaPlus className="text-xl" />
      </motion.button>
    </motion.div>
  );
};

export default Dashboard;