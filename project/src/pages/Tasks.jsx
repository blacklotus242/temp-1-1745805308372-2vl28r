import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Plus, Calendar, Clock, CheckCircle2, XCircle, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import "react-datepicker/dist/react-datepicker.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
};

const categoryOptions = [
  // Business & Finance
  { value: 'business_strategy', label: 'Business Strategy', group: 'Business & Finance' },
  { value: 'financial_planning', label: 'Financial Planning', group: 'Business & Finance' },
  { value: 'marketing', label: 'Marketing', group: 'Business & Finance' },
  { value: 'sales', label: 'Sales', group: 'Business & Finance' },
  { value: 'operations', label: 'Operations', group: 'Business & Finance' },
  
  // Health & Wellness
  { value: 'fitness', label: 'Fitness', group: 'Health & Wellness' },
  { value: 'nutrition', label: 'Nutrition', group: 'Health & Wellness' },
  { value: 'mental_health', label: 'Mental Health', group: 'Health & Wellness' },
  { value: 'medical', label: 'Medical', group: 'Health & Wellness' },
  { value: 'wellness', label: 'Wellness', group: 'Health & Wellness' },
  
  // Personal Development
  { value: 'education', label: 'Education', group: 'Personal Development' },
  { value: 'skill_building', label: 'Skill Building', group: 'Personal Development' },
  { value: 'career_growth', label: 'Career Growth', group: 'Personal Development' },
  { value: 'networking', label: 'Networking', group: 'Personal Development' },
  { value: 'personal_goals', label: 'Personal Goals', group: 'Personal Development' },
  
  // Project Management
  { value: 'planning', label: 'Planning', group: 'Project Management' },
  { value: 'execution', label: 'Execution', group: 'Project Management' },
  { value: 'monitoring', label: 'Monitoring', group: 'Project Management' },
  { value: 'evaluation', label: 'Evaluation', group: 'Project Management' },
  { value: 'team_coordination', label: 'Team Coordination', group: 'Project Management' },
  
  // Technology
  { value: 'development', label: 'Development', group: 'Technology' },
  { value: 'infrastructure', label: 'Infrastructure', group: 'Technology' },
  { value: 'security', label: 'Security', group: 'Technology' },
  { value: 'data_analytics', label: 'Data Analytics', group: 'Technology' },
  { value: 'automation', label: 'Automation', group: 'Technology' },
  
  // Creative & Design
  { value: 'content_creation', label: 'Content Creation', group: 'Creative & Design' },
  { value: 'design', label: 'Design', group: 'Creative & Design' },
  { value: 'branding', label: 'Branding', group: 'Creative & Design' },
  { value: 'multimedia', label: 'Multimedia', group: 'Creative & Design' },
  { value: 'innovation', label: 'Innovation', group: 'Creative & Design' },
  
  // Research & Analysis
  { value: 'market_research', label: 'Market Research', group: 'Research & Analysis' },
  { value: 'data_analysis', label: 'Data Analysis', group: 'Research & Analysis' },
  { value: 'competitive_analysis', label: 'Competitive Analysis', group: 'Research & Analysis' },
  { value: 'user_research', label: 'User Research', group: 'Research & Analysis' },
  { value: 'trend_analysis', label: 'Trend Analysis', group: 'Research & Analysis' },
  
  // Communication
  { value: 'internal_comms', label: 'Internal Communications', group: 'Communication' },
  { value: 'external_comms', label: 'External Communications', group: 'Communication' },
  { value: 'stakeholder_mgmt', label: 'Stakeholder Management', group: 'Communication' },
  { value: 'public_relations', label: 'Public Relations', group: 'Communication' },
  { value: 'documentation', label: 'Documentation', group: 'Communication' }
];

const groupedOptions = [
  {
    label: 'Business & Finance',
    options: categoryOptions.filter(option => option.group === 'Business & Finance')
  },
  {
    label: 'Health & Wellness',
    options: categoryOptions.filter(option => option.group === 'Health & Wellness')
  },
  {
    label: 'Personal Development',
    options: categoryOptions.filter(option => option.group === 'Personal Development')
  },
  {
    label: 'Project Management',
    options: categoryOptions.filter(option => option.group === 'Project Management')
  },
  {
    label: 'Technology',
    options: categoryOptions.filter(option => option.group === 'Technology')
  },
  {
    label: 'Creative & Design',
    options: categoryOptions.filter(option => option.group === 'Creative & Design')
  },
  {
    label: 'Research & Analysis',
    options: categoryOptions.filter(option => option.group === 'Research & Analysis')
  },
  {
    label: 'Communication',
    options: categoryOptions.filter(option => option.group === 'Communication')
  }
];

const priorityOptions = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' }
];

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    '&:hover': {
      borderColor: 'rgba(139, 92, 246, 0.5)'
    }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  }),
  group: (base) => ({
    ...base,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
  }),
  groupHeading: (base) => ({
    ...base,
    color: 'rgba(139, 92, 246, 0.8)',
    fontSize: '0.9em',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '8px 12px'
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(139, 92, 246, 0.2)'
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white'
  }),
  input: (base) => ({
    ...base,
    color: 'white'
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgba(255, 255, 255, 0.5)'
  })
};

function Tasks() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [subtasks, setSubtasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [newSubtask, setNewSubtask] = useState({});
  const [initialSubtasks, setInitialSubtasks] = useState(['']);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: null,
    status: 'pending',
    priority: 'medium',
    category: null,
    tags: []
  });

  useEffect(() => {
    loadTasks();
  }, [user]);

  const loadTasks = async () => {
    try {
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      const { data: subtasksData, error: subtasksError } = await supabase
        .from('subtasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (subtasksError) throw subtasksError;

      const subtasksByTask = {};
      subtasksData?.forEach(subtask => {
        if (!subtasksByTask[subtask.task_id]) {
          subtasksByTask[subtask.task_id] = [];
        }
        subtasksByTask[subtask.task_id].push(subtask);
      });

      setTasks(tasksData || []);
      setSubtasks(subtasksByTask);
    } catch (error) {
      console.error('Error loading tasks:', error);
      addNotification('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInitialSubtask = () => {
    setInitialSubtasks([...initialSubtasks, '']);
  };

  const handleRemoveInitialSubtask = (index) => {
    setInitialSubtasks(initialSubtasks.filter((_, i) => i !== index));
  };

  const handleInitialSubtaskChange = (index, value) => {
    const newSubtasks = [...initialSubtasks];
    newSubtasks[index] = value;
    setInitialSubtasks(newSubtasks);
  };

  const handleAddSubtask = async (taskId) => {
    if (!newSubtask[taskId]?.trim()) return;

    try {
      const { data, error } = await supabase
        .from('subtasks')
        .insert([{
          task_id: taskId,
          title: newSubtask[taskId],
          is_complete: false
        }])
        .select();

      if (error) throw error;

      setSubtasks(prev => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), data[0]]
      }));

      setNewSubtask(prev => ({ ...prev, [taskId]: '' }));
      addNotification('Subtask added successfully', 'success');
    } catch (error) {
      console.error('Error adding subtask:', error);
      addNotification('Failed to add subtask', 'error');
    }
  };

  const handleToggleSubtask = async (subtask) => {
    try {
      const { error } = await supabase
        .from('subtasks')
        .update({ is_complete: !subtask.is_complete })
        .eq('id', subtask.id);

      if (error) throw error;

      setSubtasks(prev => ({
        ...prev,
        [subtask.task_id]: prev[subtask.task_id].map(st =>
          st.id === subtask.id ? { ...st, is_complete: !st.is_complete } : st
        )
      }));

      const updatedSubtasks = subtasks[subtask.task_id].map(st =>
        st.id === subtask.id ? { ...st, is_complete: !st.is_complete } : st
      );
      const allComplete = updatedSubtasks.every(st => st.is_complete);

      if (allComplete) {
        await handleStatusChange(subtask.task_id, 'completed');
      }
    } catch (error) {
      console.error('Error toggling subtask:', error);
      addNotification('Failed to update subtask', 'error');
    }
  };

  const handleDeleteSubtask = async (subtaskId, taskId) => {
    try {
      const { error } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', subtaskId);

      if (error) throw error;

      setSubtasks(prev => ({
        ...prev,
        [taskId]: prev[taskId].filter(st => st.id !== subtaskId)
      }));

      addNotification('Subtask deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting subtask:', error);
      addNotification('Failed to delete subtask', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let taskId;
      if (editingTask) {
        const { error } = await supabase
          .from('tasks')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTask.id);

        if (error) throw error;
        taskId = editingTask.id;
        addNotification('Task updated successfully', 'success');
      } else {
        const { data, error } = await supabase
          .from('tasks')
          .insert([{
            ...formData,
            user_id: user.id
          }])
          .select();

        if (error) throw error;
        taskId = data[0].id;

        // Insert initial subtasks
        const validSubtasks = initialSubtasks.filter(st => st.trim());
        if (validSubtasks.length > 0) {
          const { error: subtaskError } = await supabase
            .from('subtasks')
            .insert(
              validSubtasks.map(title => ({
                task_id: taskId,
                title,
                is_complete: false
              }))
            );

          if (subtaskError) throw subtaskError;
        }

        addNotification('Task created successfully', 'success');
      }

      setFormData({
        title: '',
        description: '',
        deadline: null,
        status: 'pending',
        priority: 'medium',
        category: null,
        tags: []
      });
      setInitialSubtasks(['']);
      setShowNewTaskForm(false);
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      addNotification('Failed to save task', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      deadline: task.deadline ? new Date(task.deadline) : null,
      status: task.status,
      priority: task.priority || 'medium',
      category: task.category ? { value: task.category, label: task.category.charAt(0).toUpperCase() + task.category.slice(1) } : null,
      tags: task.tags || []
    });
    setShowNewTaskForm(true);
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      addNotification('Task deleted successfully', 'success');
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      addNotification('Failed to delete task', 'error');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (error) throw error;
      addNotification(`Task marked as ${newStatus}`, 'success');
      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      addNotification('Failed to update task status', 'error');
    }
  };

  return (
    <div 
      className="min-h-screen p-6 relative"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1920')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/25 dark:bg-black/60" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Mission Control Center
          </h1>
          <button
            onClick={() => {
              setShowNewTaskForm(true);
              setEditingTask(null);
              setFormData({
                title: '',
                description: '',
                deadline: null,
                status: 'pending',
                priority: 'medium',
                category: null,
                tags: []
              });
              setInitialSubtasks(['']);
            }}
            className="cosmic-button px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>New Mission</span>
          </button>
        </div>

        {showNewTaskForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-black/30 backdrop-blur-md p-6 rounded-xl border border-purple-500/20"
          >
            <h2 className="text-xl font-semibold mb-4 text-white">
              {editingTask ? 'Edit Mission' : 'New Mission'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Priority
                  </label>
                  <Select
                    value={priorityOptions.find(option => option.value === formData.priority)}
                    onChange={(option) => setFormData({ ...formData, priority: option.value })}
                    options={priorityOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(option) => setFormData({ ...formData, category: option })}
                    options={groupedOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={selectStyles}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Deadline
                </label>
                <DatePicker
                  selected={formData.deadline}
                  onChange={(date) => setFormData({ ...formData, deadline: date })}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  calendarClassName="cosmic-datepicker"
                />
              </div>

              {/* Subtasks Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Subtasks
                </label>
                <div className="space-y-2">
                  {initialSubtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={subtask}
                        onChange={(e) => handleInitialSubtaskChange(index, e.target.value)}
                        placeholder="Enter subtask..."
                        className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInitialSubtask(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddInitialSubtask}
                    className="mt-2 flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Subtask</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewTaskForm(false)}
                  className="px-4 py-2 border border-white/20 rounded-lg text-gray-300 hover:bg-black/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="cosmic-button px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingTask ? 'Update Mission' : 'Create Mission')}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <AnimatePresence>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No missions found. Create your first mission to get started!
            </div>
          ) : (
            <motion.div className="grid gap-4">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="group bg-black/30 backdrop-blur-md p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority || 'medium']}`} />
                        <h3 className="text-xl font-semibold text-white">{task.title}</h3>
                        {task.category && (
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                            {task.category}
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <div className="relative">
                          <p className={`text-gray-400 ${expandedTasks.has(task.id) ? '' : 'line-clamp-2'}`}>
                            {task.description}
                          </p>
                          {task.description.length > 100 && (
                            <button
                              onClick={() => toggleTaskExpansion(task.id)}
                              className="text-purple-400 hover:text-purple-300 text-sm mt-1 focus:outline-none"
                            >
                              {expandedTasks.has(task.id) ? (
                                <span className="flex items-center">
                                  Show less <ChevronUp className="w-4 h-4 ml-1" />
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  Show more <ChevronDown className="w-4 h-4 ml-1" />
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                        {task.deadline && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(task.deadline).toLocaleDateString()}
                            <Clock className="w-4 h-4 mx-1" />
                            {new Date(task.deadline).toLocaleTimeString()}
                          </div>
                        )}
                        <div className={`px-3 py-1 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                          task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300' :
                          task.status === 'archived' ? 'bg-gray-500/20 text-gray-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'completed')}
                          className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                          title="Mark as completed"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      )}
                      {task.status !== 'archived' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'archived')}
                          className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
                          title="Archive task"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pl-4 space-y-2">
                    <AnimatePresence>
                      {subtasks[task.id]?.map((subtask) => (
                        <motion.div
                          key={subtask.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center space-x-2 group/subtask"
                        >
                          <button
                            onClick={() => handleToggleSubtask(subtask)}
                            className={`w-4 h-4 rounded border ${
                              subtask.is_complete
                                ? 'bg-purple-500 border-purple-500'
                                : 'border-gray-500 hover:border-purple-400'
                            } flex items-center justify-center transition-colors`}
                          >
                            {subtask.is_complete && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </button>
                          <span className={`flex-1 text-sm ${
                            subtask.is_complete
                              ? 'text-gray-500 line-through'
                              : 'text-gray-300'
                          }`}>
                            {subtask.title}
                          </span>
                          <button
                            onClick={() => handleDeleteSubtask(subtask.id, task.id)}
                            className="opacity-0 group-hover/subtask:opacity-100 text-gray-500 hover:text-red-500 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <div className="flex items-center space-x-2 bg-black/30 p-2 rounded-lg border border-white/20 hover:border-purple-500/50 transition-all duration-300">
                      <Plus className="w-4 h-4 text-purple-400" />
                      <input
                        type="text"
                        value={newSubtask[task.id] || ''}
                        onChange={(e) =>
                          setNewSubtask(prev => ({
                            ...prev,
                            [task.id]: e.target.value
                          }))
                        }
                        placeholder="Add a subtask..."
                        className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubtask(task.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddSubtask(task.id)}
                        className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Tasks;