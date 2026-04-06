import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaMoon, FaSun, FaSave } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { authAPI } from '../../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    dailyQuote: user?.dailyQuote || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(formData);
      updateUser({ ...user, ...res.data });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const quotes = [
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal.",
    "The future belongs to those who believe in their dreams.",
    "Believe you can and you're halfway there.",
    "It does not matter how slowly you go as long as you do not stop.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account settings</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FaUser /> Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FaEnvelope /> Daily Quote
            </label>
            <input
              type="text"
              value={formData.dailyQuote}
              onChange={(e) => setFormData({ ...formData, dailyQuote: e.target.value })}
              className="input-field"
              placeholder={randomQuote}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Leave empty for a random motivational quote
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              {theme === 'dark' ? <FaMoon className="text-[#a855f7]" /> : <FaSun className="text-yellow-500" />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              <span className="ml-auto text-sm" style={{ color: 'var(--text-secondary)' }}>
                Click to toggle
              </span>
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full"
          >
            <FaSave className="mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}
            >
              {message}
            </motion.p>
          )}
        </form>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4">Daily Motivation</h3>
        <blockquote className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <p className="text-lg italic">"{formData.dailyQuote || randomQuote}"</p>
        </blockquote>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4">Account Info</h3>
        <div className="space-y-3">
          <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Theme</span>
            <span className="capitalize">{theme}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Member since</span>
            <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;