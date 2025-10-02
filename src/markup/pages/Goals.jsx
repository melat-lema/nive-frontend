// src/pages/Goals.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import goalService from '../../services/goal.service';
import ClipLoader from 'react-spinners/ClipLoader';
import AddGoalModal from '../components/AddGoalModal';

function Goals() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({});
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [filteredGoals, setFilteredGoals] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const getActivityIcon = (type) => {
        const icons = {
            'music': '🎵',
            'books': '📚',
            'expenses': '💰',
            'goals': '🎯',
            'notes': '📝',
            'dashboard': '📊',
            'settings': '⚙️',
            'insights': '📈'
        };
        return icons[type] || '📊';
    };
    // Fetch all data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, goalsRes] = await Promise.all([
                goalService.getGoalStats(),
                goalService.getAllGoals()
            ]);
            
            setStats(statsRes.data || {});
            setGoals(goalsRes.data || []);
        } catch (err) {
            console.error('Error fetching goal data:', err);
            setError('Failed to load goal data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter goals based on selected status
    useEffect(() => {
        let filtered = goals;
        
        // Apply status filter
        if (selectedStatus !== 'All') {
            filtered = filtered.filter(goal => goal.status === selectedStatus);
        }
        
        setFilteredGoals(filtered);
    }, [goals, selectedStatus]);

    // Handle adding new goal
 // Handle adding new goal
const handleAddGoal = async (goalData) => {
    try {
        await goalService.createGoal(goalData);
        setIsModalOpen(false);
        fetchData(); // Refresh all data
    } catch (error) {
        console.error('Error adding goal:', error);
        alert('Failed to add goal. Please try again.');
    }
}
    // In your Goals.jsx, add this function:
const handleCompleteGoal = async (goalId, target) => {
    try {
        // Update progress to target to mark as completed
        const updatedGoal = await goalService.updateGoalProgress(goalId, target);
        
        // Refresh data
        fetchData();
    } catch (error) {
        console.error('Error completing goal:', error);
        alert('Failed to complete goal. Please try again.');
    }
};



    // Format date relative to today
    const formatRelativeDate = (dateStr) => {
        if (!dateStr) return 'No deadline';
        
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    // Calculate remaining time
    const calculateRemainingTime = (deadline) => {
        if (!deadline) return 'No deadline';
        
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const diffTime = deadlineDate - now;
        
        if (diffTime < 0) {
            const diffDays = Math.abs(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            return `${diffDays} days overdue`;
        }
        
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day remaining';
        if (diffDays <= 30) return `${diffDays} days remaining`;
        const diffMonths = Math.ceil(diffDays / 30);
        return `${diffMonths} months remaining`;
    };

    // Get goal type icon
    const getGoalTypeIcon = (type) => {
        const icons = {
            'books': '📚',
            'music': '🎵',
            'expenses': '💰',
            'general': '🎯'
        };
        return icons[type] || '🎯';
    };

    // Get goal status color
    const getStatusColor = (status) => {
        return status === 'completed' ? 'green' : 
               status === 'overdue' ? 'red' : 'blue';
    };

    // Get priority color
    const getPriorityColor = (priority) => {
        return priority === 'high' ? 'purple' : 
               priority === 'medium' ? 'green' : 'gray';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <ClipLoader size={32} color="#6B7280" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => fetchData()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
           <div 
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-sm border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:static md:z-10`}
            >
                <div className="p-6">
                    <div className="flex items-center mb-8">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                            L
                        </div>
                        <span className="ml-2 text-xl font-bold">LifeTracker</span>
                    </div>

                    {/* CORE Section */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2">CORE</h3>
                        <nav className="space-y-2">
                            <button
                                onClick={() => { navigate('/dashboard'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('dashboard')}</span>
                                Dashboard
                            </button>
                            <button
                                onClick={() => { navigate('/music'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                               <span className="text-lg">{getActivityIcon('music')}</span>
                                Music
                            </button>
                            <button
                                onClick={() => { navigate('/books'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('books')}</span>
                                Books
                            </button>
                            <button
                                onClick={() => { navigate('/expenses'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('expenses')}</span>
                                Expenses
                            </button>
                            <button
                                onClick={() => { navigate('/notes'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('notes')}</span>
                                Notes
                            </button>
                            <button
                                onClick={() => { navigate('/goals'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 w-full text-blue-600 bg-blue-50 rounded-lg transition-colors"
                            >
                               <span className="text-lg">{getActivityIcon('goals')}</span>
                                Goals
                            </button>
                        </nav>
                    </div>

                    {/* ANALYTICS Section */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2">ANALYTICS</h3>
                        <nav className="space-y-2">
                            <button
                                onClick={() => { navigate('/insights'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('insights')}</span>
                                Insights
                            </button>
                        </nav>
                    </div>

                    {/* SYSTEM Section */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2">SYSTEM</h3>
                        <nav className="space-y-2">
                            <button
                                onClick={() => { navigate('/settings'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('settings')}</span>
                                Settings
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
           <div className="flex-1 md:ml-8"> {/* 8px = 2rem */}
                
                {/* Header */}
      <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        {/* Hamburger Menu for Mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex items-center space-x-4">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Goals Tracker</h1>
                       
                    </div>
                        </div>
                        
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Goal
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Active Goals Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Goals</h3>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-3xl font-bold text-blue-600">
                                    {stats.active_goals || 0}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">In progress</p>
                            </div>
                        </div>

                        {/* Completed Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed</h3>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.completed_goals || 0}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">This year</p>
                            </div>
                        </div>

                        {/* Success Rate Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate</h3>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-purple-600">
                                    {stats.success_rate || 0}%
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Overall completion</p>
                            </div>
                        </div>

                        {/* Overdue Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue</h3>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-3xl font-bold text-red-600">
                                    {stats.overdue_goals || 0}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Need attention</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter by Status */}
                    <div className="mb-6">
                        <div className="flex items-center">
                            <label className="text-lg font-semibold text-gray-900 mr-4">Filter by status:</label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSelectedStatus('All')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        selectedStatus === 'All' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setSelectedStatus('active')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        selectedStatus === 'active' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setSelectedStatus('completed')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        selectedStatus === 'completed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    Completed
                                </button>
                                <button
                                    onClick={() => setSelectedStatus('overdue')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        selectedStatus === 'overdue' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    Overdue
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Goals List */}
                    <div className="space-y-6">
                        {filteredGoals.map(goal => {
                            const progressPercentage = goal.target > 0 ? Math.round((goal.progress / goal.target) * 100) : 0;
                            const statusColor = getStatusColor(goal.status);
                            const priorityColor = getPriorityColor(goal.priority);
                            
                            return (
                                
                                <div key={goal.id} className={`bg-white rounded-xl shadow-sm border border-${statusColor}-200 p-6`}>
                                    
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-2">{getGoalTypeIcon(goal.type)}</span>
                                            <h4 className="font-medium text-gray-900 truncate">
                                                {goal.title || 'Untitled Goal'}
                                            </h4>
                                        </div>
                                        <div className="flex space-x-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                                                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${priorityColor}-100 text-${priorityColor}-800`}>
                                                {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4">
                                        {goal.description || 'No description provided.'}
                                    </p>
                                    
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-700">
                                                {goal.type === 'books' ? `Progress: ${goal.progress} of ${goal.target} books` :
                                                 goal.type === 'music' ? `Progress: ${goal.progress} of ${goal.target} songs` :
                                                 goal.type === 'expenses' ? `Progress: $${goal.progress} of $${goal.target}` :
                                                 `Progress: ${goal.progress} of ${goal.target}`}
                                            </span>
                                            <span className={`text-sm font-medium text-${statusColor}-600`}>
                                                {progressPercentage}%
                                            </span>
                                        </div>
                                        <div className={`w-full bg-gray-200 rounded-full h-2`}>
                                            <div
                                                className={`h-2 rounded-full bg-${statusColor}-500`}
                                                style={{ width: `${Math.min(100, progressPercentage)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
    <span className="text-xs text-gray-500">
        Due: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}
    </span>
    {goal.status === 'active' ? (
        <button
            onClick={() => handleCompleteGoal(goal.id, goal.target)}
            className="text-green-600 hover:text-green-700 text-sm"
        >
            Complete
        </button>
    ) : (
        <span className={`text-xs font-medium text-${statusColor}-600`}>
            {calculateRemainingTime(goal.deadline)}
        </span>
    )}
</div>
                                    
                                    {goal.status === 'completed' && (
                                        <div className="mt-2 flex items-center text-green-600 text-xs">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Goal achieved!
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {filteredGoals.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {selectedStatus !== 'All' ? (
                                <>
                                    <p>No {selectedStatus.toLowerCase()} goals found.</p>
                                    <button
                                        onClick={() => setSelectedStatus('All')}
                                        className="mt-2 text-blue-600 hover:underline"
                                    >
                                        View all goals
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>No goals yet.</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="mt-2 text-blue-600 hover:underline"
                                    >
                                        Add your first goal
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <AddGoalModal
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddGoal}
                />
            )}
        </div>
    );
}

export default Goals;