import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaClock, FaBookOpen } from 'react-icons/fa';
import { subjectsAPI, assignmentsAPI } from '../../services/api';
import { format } from 'date-fns';

const School = () => {
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [subjectForm, setSubjectForm] = useState({ name: '', color: '#a855f7' });
  const [assignmentForm, setAssignmentForm] = useState({
    subject: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, assignmentsRes] = await Promise.all([
        subjectsAPI.getAll(),
        assignmentsAPI.getAll(),
      ]);
      setSubjects(subjectsRes.data);
      setAssignments(assignmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await subjectsAPI.update(editingSubject._id, subjectForm);
      } else {
        await subjectsAPI.create(subjectForm);
      }
      fetchData();
      closeSubjectModal();
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await assignmentsAPI.update(editingAssignment._id, assignmentForm);
      } else {
        await assignmentsAPI.create(assignmentForm);
      }
      fetchData();
      closeAssignmentModal();
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (confirm('Delete this subject and all its assignments?')) {
      try {
        await subjectsAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await assignmentsAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const openEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectForm({ name: subject.name, color: subject.color });
    setShowSubjectModal(true);
  };

  const openEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      subject: assignment.subject._id,
      title: assignment.title,
      description: assignment.description || '',
      dueDate: format(new Date(assignment.dueDate), 'yyyy-MM-dd'),
      priority: assignment.priority,
    });
    setShowAssignmentModal(true);
  };

  const closeSubjectModal = () => {
    setShowSubjectModal(false);
    setEditingSubject(null);
    setSubjectForm({ name: '', color: '#a855f7' });
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setEditingAssignment(null);
    setAssignmentForm({ subject: '', title: '', description: '', dueDate: '', priority: 'medium' });
  };

  const getUpcomingAssignments = () => {
    const now = new Date();
    return assignments
      .filter(a => new Date(a.dueDate) > now && a.status !== 'graded')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
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
          <h1 className="text-3xl font-bold">School Planner</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track courses and assignments</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowSubjectModal(true)} className="btn-secondary">
            <FaPlus className="mr-2" /> Add Subject
          </button>
          <button onClick={() => setShowAssignmentModal(true)} className="btn-primary">
            <FaPlus className="mr-2" /> Add Assignment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Subjects</h3>
          <div className="space-y-3">
            {subjects.map(subject => (
              <div key={subject._id} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: subject.color }} />
                  <div>
                    <h4 className="font-medium">{subject.name}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {assignments.filter(a => a.subject._id === subject._id).length} assignments
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditSubject(subject)} className="text-gray-400 hover:text-[#6366f1]">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteSubject(subject._id)} className="text-gray-400 hover:text-red-500">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            {subjects.length === 0 && (
              <p className="text-center py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                No subjects yet
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {getUpcomingAssignments().slice(0, 6).map(assignment => (
              <div key={assignment._id} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${assignment.subject?.color}20` }}>
                    <FaBookOpen className="text-sm" style={{ color: assignment.subject?.color }} />
                  </div>
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{assignment.subject?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    new Date(assignment.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {format(new Date(assignment.dueDate), 'MMM d')}
                  </span>
                  <button onClick={() => openEditAssignment(assignment)} className="text-gray-400 hover:text-[#6366f1]">
                    <FaEdit className="text-sm" />
                  </button>
                  <button onClick={() => handleDeleteAssignment(assignment._id)} className="text-gray-400 hover:text-red-500">
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
            {getUpcomingAssignments().length === 0 && (
              <p className="text-center py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                No upcoming assignments
              </p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSubjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeSubjectModal}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="card w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h2>
              <form onSubmit={handleSubjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <input
                    type="color"
                    value={subjectForm.color}
                    onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeSubjectModal} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editingSubject ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAssignmentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeAssignmentModal}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="card w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">{editingAssignment ? 'Edit Assignment' : 'Add Assignment'}</h2>
              <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    value={assignmentForm.subject}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select subject</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    className="input-field h-20 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <input
                      type="date"
                      value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={assignmentForm.priority}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, priority: e.target.value })}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeAssignmentModal} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editingAssignment ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default School;