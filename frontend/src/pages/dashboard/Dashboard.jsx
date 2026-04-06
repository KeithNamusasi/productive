import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FaBook, FaBriefcase, FaCalendarAlt, FaStickyNote,
  FaPlus, FaChevronRight, FaFire, FaClock, FaBolt,
  FaStar, FaTrophy, FaRocket, FaCheck
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
  const [showGlow, setShowGlow] = useState(true);

  const currentDate = new Date();
  
  const motivationalQuotes = [
    "Make today count! 🌟",
    "You're capable of amazing things! 🚀",
    "One step at a time, one day at a time 💪",
    "Your potential is limitless! ⭐",
    "Today is a fresh start! ✨",
    "Believe in yourself! 💫",
    "Progress, not perfection 🏆",
    "You got this! 🔥"
  ];
  
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

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
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const upcomingAssignments = assignments
    .filter(a => new Date(a.dueDate) > currentDate && a.status !== 'graded')
    .slice(0, 3);
  const completedHabitsToday = habits.filter(h => h.completedToday).length;
  const totalProgress = tasks.length > 0 ? Math.round((completedTasks / (todoTasks.length + completedTasks)) * 100) : 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 }
  };

  const glowItem = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-[#6366f1]/30 border-t-[#6366f1]"
        />
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 md:space-y-6 pb-20"
    >
      {/* Hero Section - Futuristic Greeting */}
      <motion.div 
        variants={item}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          boxShadow: '0 0 60px rgba(99, 102, 241, 0.3), 0 0 100px rgba(168, 85, 247, 0.2)'
        }}
      >
        {/* Animated Glow Elements */}
        <motion.div 
          variants={glowItem}
          className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#6366f1]/20 blur-3xl"
        />
        <motion.div 
          variants={glowItem}
          className="absolute bottom-0 left-0 w-24 h-24 md:w-36 md:h-36 rounded-full bg-[#a855f7]/20 blur-3xl"
          style={{ animationDelay: '0.5s' }}
        />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-2"
            >
              <FaBolt className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">{quote}</span>
            </motion.div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">
              {greeting()}, <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'Champion'}!</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              {format(currentDate, 'EEEE, MMMM d, yyyy')} • {format(currentDate, 'h:mm a')}
            </p>
          </div>
          
          {/* Progress Ring */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="relative w-20 h-20 md:w-24 md:h-24"
          >
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="42" cy="42" r="36" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
              <circle 
                cx="42" cy="42" r="36" 
                stroke="url(#gradient)" 
                strokeWidth="6" 
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${totalProgress * 2.26} 226`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl md:text-2xl font-bold text-white">{totalProgress}%</span>
              <span className="text-xs text-gray-400">Done</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group cursor-pointer"
          onClick={() => navigate('/reading')}
        >
          <div className="relative p-4 md:p-5 rounded-xl md:rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#10b981]/20 flex items-center justify-center">
                <FaBook className="text-[#10b981] text-sm md:text-base" />
              </div>
              <FaStar className="text-yellow-500/50 text-xs" />
            </div>
            <p className="text-xl md:text-2xl font-bold">{books.filter(b => b.status === 'reading').length}</p>
            <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>Reading</p>
            {currentBook && (
              <div className="mt-2">
                <div className="h-1 rounded-full bg-gray-700 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentBook.currentPage / currentBook.totalPages) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full bg-[#10b981]" 
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group cursor-pointer"
          onClick={() => navigate('/work')}
        >
          <div className="relative p-4 md:p-5 rounded-xl md:rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#3b82f6]/20 flex items-center justify-center">
                <FaBriefcase className="text-[#3b82f6] text-sm md:text-base" />
              </div>
              <FaBolt className="text-orange-500/50 text-xs" />
            </div>
            <p className="text-xl md:text-2xl font-bold">{todoTasks.length}</p>
            <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>Tasks</p>
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group cursor-pointer"
          onClick={() => navigate('/school')}
        >
          <div className="relative p-4 md:p-5 rounded-xl md:rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#a855f7]/20 flex items-center justify-center">
                <FaTrophy className="text-[#a855f7] text-sm md:text-base" />
              </div>
              <FaRocket className="text-purple-500/50 text-xs" />
            </div>
            <p className="text-xl md:text-2xl font-bold">{upcomingAssignments.length}</p>
            <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>Deadlines</p>
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, y: -4 }}
          className="group cursor-pointer"
          onClick={() => navigate('/daily')}
        >
          <div className="relative p-4 md:p-5 rounded-xl md:rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#ec4899]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#ec4899]/20 flex items-center justify-center">
                <FaCheck className="text-[#ec4899] text-sm md:text-base" />
              </div>
              <FaFire className="text-orange-500/50 text-xs" />
            </div>
            <p className="text-xl md:text-2xl font-bold">{completedHabitsToday}/{habits.length}</p>
            <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>Habits</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Today's Tasks */}
        <motion.div variants={item} className="p-4 md:p-6 rounded-xl md:rounded-2xl" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
              Today's Tasks
            </h3>
            <button onClick={() => navigate('/work')} className="text-[#6366f1] text-sm flex items-center gap-1 hover:underline">
              View All <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="space-y-2 md:space-y-3">
            {todoTasks.slice(0, 4).map((task, index) => (
              <motion.div 
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg group"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className={`w-3 h-3 rounded-full ${
                  task.priority === 'high' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate group-hover:text-[#6366f1] transition-colors">{task.title}</p>
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
              </motion.div>
            ))}
            {todoTasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="text-4xl mb-2">🎉</div>
                <p style={{ color: 'var(--text-secondary)' }}>All caught up!</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No tasks for today</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={item} className="p-4 md:p-6 rounded-xl md:rounded-2xl" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
              Upcoming Deadlines
            </h3>
            <button onClick={() => navigate('/school')} className="text-[#6366f1] text-sm flex items-center gap-1 hover:underline">
              View All <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="space-y-2 md:space-y-3">
            {upcomingAssignments.slice(0, 4).map((assignment, index) => (
              <motion.div 
                key={assignment._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg group"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${assignment.subject?.color}20` }}>
                  <FaBook className="text-sm" style={{ color: assignment.subject?.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate group-hover:text-[#a855f7] transition-colors">{assignment.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{assignment.subject?.name}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                  new Date(assignment.dueDate) < new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000) 
                    ? 'bg-red-500/20 text-red-400 animate-pulse' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {format(new Date(assignment.dueDate), 'MMM d')}
                </span>
              </motion.div>
            ))}
            {upcomingAssignments.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="text-4xl mb-2">✨</div>
                <p style={{ color: 'var(--text-secondary)' }}>No upcoming deadlines</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You're all clear!</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Habit Streaks */}
      <motion.div variants={item} className="p-4 md:p-6 rounded-xl md:rounded-2xl" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <FaFire className="text-orange-500" />
            Habit Streaks
          </h3>
          <button onClick={() => navigate('/daily')} className="text-[#6366f1] text-sm flex items-center gap-1 hover:underline">
            Manage <FaChevronRight className="text-xs" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {habits.slice(0, 4).map((habit, index) => (
            <motion.div 
              key={habit._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 md:p-4 rounded-xl"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaFire className="text-xl md:text-2xl mx-auto mb-2 text-orange-500" />
              </motion.div>
              <p className="font-medium text-sm md:text-base">{habit.name}</p>
              <p className="text-xl md:text-2xl font-bold text-[#6366f1]">{habit.streak}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>day streak</p>
            </motion.div>
          ))}
          {habits.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 md:col-span-4 text-center py-4"
            >
              <p style={{ color: 'var(--text-secondary)' }}>No habits yet. Start building!</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        variants={item}
        onClick={() => navigate('/notes')}
        className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-[#6366f1]/30 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaPlus className="text-xl md:text-2xl" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default Dashboard;