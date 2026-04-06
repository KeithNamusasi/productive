import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHome, FaBook, FaBriefcase, FaGraduationCap, 
  FaChartLine, FaCalendarAlt, FaStickyNote, FaUser,
  FaMoon, FaSun, FaSignOutAlt, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/reading', icon: FaBook, label: 'Reading' },
    { path: '/work', icon: FaBriefcase, label: 'Work' },
    { path: '/school', icon: FaGraduationCap, label: 'School' },
    { path: '/business', icon: FaChartLine, label: 'Business' },
    { path: '/daily', icon: FaCalendarAlt, label: 'Daily' },
    { path: '/notes', icon: FaStickyNote, label: 'Notes' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed left-0 top-0 h-full w-[280px] z-40 flex flex-col"
        style={{ 
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            DayFlow
          </h1>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <FaChevronLeft className="text-sm" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <div className="px-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#6366f1]/20 text-[#6366f1]' 
                    : 'hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`
              }
            >
              <item.icon className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 space-y-2">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#6366f1]/20 text-[#6366f1]' 
                  : 'hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            <FaUser className="text-lg" />
            <span className="font-medium">Profile</span>
          </NavLink>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200 hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200 hover:bg-red-500/10 text-red-400"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.div>

      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-30 p-3 rounded-xl shadow-lg"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <FaChevronRight className="text-sm" style={{ color: 'var(--text-secondary)' }} />
        </button>
      )}
    </>
  );
};

export default Sidebar;