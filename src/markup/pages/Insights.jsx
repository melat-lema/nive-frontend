// src/pages/Insights.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import insightService from '../../services/insight.service';
import ClipLoader from 'react-spinners/ClipLoader';

function Insights() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({});
    const [insights, setInsights] = useState([]);
    const [activityDistribution, setActivityDistribution] = useState({});
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Fetch all data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, insightsRes] = await Promise.all([
                insightService.getInsightStats(),
                insightService.getAllInsights()
            ]);
            
            setStats(statsRes.data || {});
            setInsights(insightsRes.data || []);
            setActivityDistribution({
                music: statsRes.data?.music_percentage || 35,
                books: statsRes.data?.books_percentage || 25,
                expenses: statsRes.data?.expenses_percentage || 20,
                notes: statsRes.data?.notes_percentage || 20
            });
        } catch (err) {
            console.error('Error fetching insight data:', err);
            setError('Failed to load insight data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Format date relative to today
    const formatRelativeDate = (dateStr) => {
        if (!dateStr) return 'Just now';
        
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    // Get icon for activity type
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

    // Get color based on severity
    const getSeverityColor = (severity) => {
        return severity === 'success' ? 'green' :
               severity === 'warning' ? 'yellow' :
               severity === 'error' ? 'red' :
               'blue';
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
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                                 className="flex items-center px-4 py-2 gap-3 w-full text-blue-600 bg-blue-50 rounded-lg transition-colors"
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
            <div className="flex-1 md:ml-8"> 
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6 py-4 flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Activity Score Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Score</h3>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-3xl font-bold text-indigo-600">
                                    {stats.activity_score || 87}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Overall activity</p>
                                <p className="text-xs text-green-500 mt-1">+{stats.activity_change || 5}% from last month</p>
                            </div>
                        </div>

                        {/* Most Active Day Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Day</h3>
                            <div className="flex flex-col items-center text-center">
                                <svg className="w-10 h-10 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14" />
                                </svg>
                                <p className="text-xl font-bold text-blue-600">
                                    {stats.most_active_day || 'Tuesday'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Peak activity day</p>
                            </div>
                        </div>

                        {/* Streak Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Streak</h3>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-3xl font-bold text-orange-600">
                                    {stats.streak_days || 12}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Days active</p>
                                <p className="text-xs text-orange-500 mt-1">🔥 Keep it up!</p>
                            </div>
                        </div>

                        {/* Productivity Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity</h3>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.productivity_rate || 94}%
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Goal completion</p>
                            </div>
                        </div>
                    </div>

                    {/* Activity Distribution & Weekly Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Activity Distribution */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Distribution</h3>
                            <div className="space-y-4">
                                {/* Music Logging */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-xl mr-2">🎵</span>
                                        <span>Music Logging</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-purple-500"
                                                style={{ width: `${activityDistribution.music}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {activityDistribution.music}%
                                        </span>
                                    </div>
                                </div>

                                {/* Reading Progress */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-xl mr-2">📚</span>
                                        <span>Reading Progress</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-blue-500"
                                                style={{ width: `${activityDistribution.books}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {activityDistribution.books}%
                                        </span>
                                    </div>
                                </div>

                                {/* Expense Tracking */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-xl mr-2">💰</span>
                                        <span>Expense Tracking</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-red-500"
                                                style={{ width: `${activityDistribution.expenses}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {activityDistribution.expenses}%
                                        </span>
                                    </div>
                                </div>

                                {/* Note Taking */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-xl mr-2">📝</span>
                                        <span>Note Taking</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-yellow-500"
                                                style={{ width: `${activityDistribution.notes}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {activityDistribution.notes}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Summary */}
                        {/* Weekly Summary */}
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
    <div className="space-y-4">
        {/* Music */}
        <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center">
                <span className="text-xl mr-2">🎵</span>
                <div>
                    <h4 className="font-medium text-gray-900">Music</h4>
                    <p className="text-sm text-gray-600">{stats.music_count || 0} songs logged</p>
                </div>
            </div>
        </div>

        {/* Books */}
        <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
                <span className="text-xl mr-2">📚</span>
                <div>
                    <h4 className="font-medium text-gray-900">Books</h4>
                    <p className="text-sm text-gray-600">{stats.books_count || 0} books in progress</p>
                </div>
            </div>
        </div>

        {/* Expenses */}
        <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center">
                <span className="text-xl mr-2">💰</span>
                <div>
                    <h4 className="font-medium text-gray-900">Expenses</h4>
                    <p className="text-sm text-gray-600">${stats.expenses_total || 0} spent</p>
                </div>
            </div>
        </div>

        {/* Goals */}
        <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
                <span className="text-xl mr-2">🎯</span>
                <div>
                    <h4 className="font-medium text-gray-900">Goals</h4>
                    <p className="text-sm text-gray-600">{stats.completed_goals || 0} of {stats.total_goals || 0} completed</p>
                </div>
            </div>
        </div>
    </div>
</div>
                    </div>

                    {/* Insights & Recommendations */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Music Discovery Pattern */}
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Music Discovery Pattern</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            You tend to log more music on weekends. Consider exploring new genres during weekdays to diversify your listening habits.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Reading Progress */}
                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="flex items-start">
                                    <div className="bg-green-100 rounded-full p-2 mr-3">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Reading Progress</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Great progress on your reading goal! You're 80% complete. Keep up the momentum to finish 3 more books by year-end.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Budget Alert */}
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <div className="flex items-start">
                                    <div className="bg-yellow-100 rounded-full p-2 mr-3">
                                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Budget Alert</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            You've spent 83% of your monthly budget. Consider reviewing your grocery and entertainment expenses for the rest of the month.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Goal Achievement */}
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-start">
                                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Goal Achievement</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            You have 2 overdue goals. Consider breaking them into smaller tasks or adjusting deadlines to maintain momentum.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Insights;