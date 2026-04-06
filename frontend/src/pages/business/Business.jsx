import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaDollarSign, FaLightbulb, FaFlag } from 'react-icons/fa';
import { goalsAPI, financeAPI } from '../../services/api';
import { format } from 'date-fns';

const Business = () => {
  const [goals, setGoals] = useState([]);
  const [finance, setFinance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [goalForm, setGoalForm] = useState({ title: '', description: '', targetDate: '', progress: 0 });
  const [financeForm, setFinanceForm] = useState({ type: 'expense', amount: '', description: '', category: '' });
  const [ideaForm, setIdeaForm] = useState({ title: '', description: '', tags: '' });
  const [activeTab, setActiveTab] = useState('goals');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [goalsRes, financeRes] = await Promise.all([goalsAPI.getAll(), financeAPI.getAll()]);
      setGoals(goalsRes.data);
      setFinance(financeRes.data);
      const savedIdeas = JSON.parse(localStorage.getItem('businessIdeas') || '[]');
      setIdeas(savedIdeas);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await goalsAPI.update(editingGoal._id, goalForm);
      } else {
        await goalsAPI.create(goalForm);
      }
      fetchData();
      closeGoalModal();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleFinanceSubmit = async (e) => {
    e.preventDefault();
    try {
      await financeAPI.create({ ...financeForm, amount: parseFloat(financeForm.amount) });
      fetchData();
      closeFinanceModal();
    } catch (error) {
      console.error('Error saving finance:', error);
    }
  };

  const handleIdeaSubmit = (e) => {
    e.preventDefault();
    const newIdeas = [...ideas, { ...ideaForm, tags: ideaForm.tags.split(',').map(t => t.trim()).filter(Boolean), id: Date.now() }];
    setIdeas(newIdeas);
    localStorage.setItem('businessIdeas', JSON.stringify(newIdeas));
    closeIdeaModal();
  };

  const handleDeleteGoal = async (id) => {
    try {
      await goalsAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleDeleteFinance = async (id) => {
    try {
      await financeAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting finance:', error);
    }
  };

  const deleteIdea = (id) => {
    const newIdeas = ideas.filter(i => i.id !== id);
    setIdeas(newIdeas);
    localStorage.setItem('businessIdeas', JSON.stringify(newIdeas));
  };

  const openEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description || '',
      targetDate: goal.targetDate ? format(new Date(goal.targetDate), 'yyyy-MM-dd') : '',
      progress: goal.progress,
    });
    setShowGoalModal(true);
  };

  const closeGoalModal = () => {
    setShowGoalModal(false);
    setEditingGoal(null);
    setGoalForm({ title: '', description: '', targetDate: '', progress: 0 });
  };

  const closeFinanceModal = () => {
    setShowFinanceModal(false);
    setFinanceForm({ type: 'expense', amount: '', description: '', category: '' });
  };

  const closeIdeaModal = () => {
    setShowIdeaModal(false);
    setIdeaForm({ title: '', description: '', tags: '' });
  };

  const totalIncome = finance.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = finance.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);

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
          <h1 className="text-3xl font-bold">Business Board</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Goals, finance, and ideas</p>
        </div>
      </div>

      <div className="flex gap-2 border-b" style={{ borderColor: 'var(--text-secondary)' }}>
        {['goals', 'finance', 'ideas'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab 
                ? 'text-[#6366f1] border-b-2 border-[#6366f1]' 
                : 'text-[var(--text-secondary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowGoalModal(true)} className="btn-primary">
              <FaPlus className="mr-2" /> Add Goal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map(goal => (
              <motion.div key={goal._id} className="card" whileHover={{ y: -2 }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => openEditGoal(goal)} className="text-gray-400 hover:text-[#6366f1]">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteGoal(goal._id)} className="text-gray-400 hover:text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {goal.description && (
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{goal.description}</p>
                )}
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="text-[#f97316]">{goal.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#333] overflow-hidden">
                    <div className="h-full rounded-full bg-[#f97316]" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
                {goal.targetDate && (
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                  </p>
                )}
              </motion.div>
            ))}
            {goals.length === 0 && (
              <div className="col-span-full text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                No goals yet. Set your first business goal!
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card text-center">
              <FaDollarSign className="text-2xl mx-auto mb-2 text-green-500" />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Income</p>
              <p className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="card text-center">
              <FaDollarSign className="text-2xl mx-auto mb-2 text-red-500" />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Expenses</p>
              <p className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="card text-center">
              <FaDollarSign className="text-2xl mx-auto mb-2 text-[#6366f1]" />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Net</p>
              <p className="text-2xl font-bold text-[#6366f1]">${(totalIncome - totalExpenses).toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button onClick={() => setShowFinanceModal(true)} className="btn-primary">
              <FaPlus className="mr-2" /> Add Transaction
            </button>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <div className="space-y-3">
              {finance.slice(0, 10).map(item => (
                <div key={item._id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div>
                    <p className="font-medium">{item.description || item.category}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{format(new Date(item.date), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${item.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                    </span>
                    <button onClick={() => handleDeleteFinance(item._id)} className="text-gray-400 hover:text-red-500">
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
              {finance.length === 0 && (
                <p className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ideas' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowIdeaModal(true)} className="btn-primary">
              <FaPlus className="mr-2" /> Add Idea
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map(idea => (
              <motion.div key={idea.id} className="card" whileHover={{ y: -2 }}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{idea.title}</h3>
                  <button onClick={() => deleteIdea(idea.id)} className="text-gray-400 hover:text-red-500">
                    <FaTrash className="text-sm" />
                  </button>
                </div>
                {idea.description && (
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{idea.description}</p>
                )}
                {idea.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#f97316' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {ideas.length === 0 && (
              <div className="col-span-full text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                No ideas yet. Capture your business ideas!
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showGoalModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeGoalModal}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4">{editingGoal ? 'Edit Goal' : 'Add Goal'}</h2>
              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input type="text" value={goalForm.title} onChange={e => setGoalForm({ ...goalForm, title: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea value={goalForm.description} onChange={e => setGoalForm({ ...goalForm, description: e.target.value })} className="input-field h-20 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Date</label>
                    <input type="date" value={goalForm.targetDate} onChange={e => setGoalForm({ ...goalForm, targetDate: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Progress %</label>
                    <input type="number" min="0" max="100" value={goalForm.progress} onChange={e => setGoalForm({ ...goalForm, progress: parseInt(e.target.value) })} className="input-field" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeGoalModal} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editingGoal ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFinanceModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeFinanceModal}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
              <form onSubmit={handleFinanceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select value={financeForm.type} onChange={e => setFinanceForm({ ...financeForm, type: e.target.value })} className="input-field">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input type="number" step="0.01" value={financeForm.amount} onChange={e => setFinanceForm({ ...financeForm, amount: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input type="text" value={financeForm.description} onChange={e => setFinanceForm({ ...financeForm, description: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input type="text" value={financeForm.category} onChange={e => setFinanceForm({ ...financeForm, category: e.target.value })} className="input-field" placeholder="sales, supplies, etc." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeFinanceModal} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Add</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIdeaModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeIdeaModal}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-semibold mb-4">Add Idea</h2>
              <form onSubmit={handleIdeaSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input type="text" value={ideaForm.title} onChange={e => setIdeaForm({ ...ideaForm, title: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea value={ideaForm.description} onChange={e => setIdeaForm({ ...ideaForm, description: e.target.value })} className="input-field h-20 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <input type="text" value={ideaForm.tags} onChange={e => setIdeaForm({ ...ideaForm, tags: e.target.value })} className="input-field" placeholder="tech, marketing, product" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeIdeaModal} className="btn-secondary flex-1">Cancel</button>
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

export default Business;