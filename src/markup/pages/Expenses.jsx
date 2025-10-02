// src/pages/Expenses.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import expenseService from '../../services/expense.service';
import ClipLoader from 'react-spinners/ClipLoader';
import AddExpenseModal from '../components/AddExpenseModal';
import BudgetModal from '../components/BudgetModal'; // ← Add this line
function Expenses() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false); // ← Add this line
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
            const [statsRes, transactionsRes] = await Promise.all([
                expenseService.getExpenseStats(),
                expenseService.getRecentTransactions()
            ]);
            
            setStats(statsRes.data || {});
            setTransactions(transactionsRes.data || []);
        } catch (err) {
            console.error('Error fetching expense data:', err);
            setError('Failed to load expense data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
// Handle saving budget
const handleSaveBudget = async (budgetAmount) => {
    try {
        await expenseService.setBudget(budgetAmount);
        setIsBudgetModalOpen(false);
        fetchData(); // Refresh all data
    } catch (error) {
        console.error('Error saving budget:', error);
        alert('Failed to save budget. Please try again.');
    }
};
    // Handle adding new expense
    const handleAddExpense = async (expenseData) => {
        try {
            await expenseService.createExpense(expenseData);
            setIsModalOpen(false);
            fetchData(); // Refresh all data
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Failed to add expense. Please try again.');
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Format date relative to today
    const formatRelativeDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    // Get category icon
    const getCategoryIcon = (category) => {
        const icons = {
            'Groceries': '🛒',
            'Utilities': '🏠',
            'Entertainment': '🎬',
            'Transport': '🚗',
            'Dining': '🍽️',
            'Shopping': '🛍️',
            'Healthcare': '🏥',
            'Education': '🎓',
            'Travel': '✈️',
            'Personal Care': '🧴',
            'Gifts': '🎁',
            'Savings': '💰',
            'Investments': '📈',
            'Other': '📦'
        };
        return icons[category] || '📊';
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
                                  className="flex items-center px-4 py-2 gap-3 w-full text-blue-600 bg-blue-50 rounded-lg transition-colors"
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
                        <h1 className="text-2xl font-bold text-gray-900">Expenses Tracker</h1>
                       
                    </div>
                        </div>
                        
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Expenses
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* This Month Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-3xl font-bold text-red-600">
                                    {formatCurrency(stats.this_month_total || 0)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Total spent</p>
                                <p className={`text-xs mt-1 ${stats.month_change_percent >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    {stats.month_change_percent >= 0 ? '↑' : '↓'} {Math.abs(stats.month_change_percent || 0)}% from last month
                                </p>
                            </div>
                        </div>
{/* Budget Status Card */}
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Budget</h3>
    <div className="text-center">
        <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(stats.budget_amount || 0)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
            {stats.budget_amount ? 'Your spending limit' : 'Set your budget'}
        </p>
        <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="mt-2 text-blue-600 hover:underline text-sm"
        >
            {stats.budget_amount ? 'Edit Budget' : 'Set Budget'}
        </button>
    </div>
</div>
                        {/* Top Category Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Category</h3>
                            <div className="flex flex-col items-center text-center">
                                <span className="text-4xl mb-2">
                                    {getCategoryIcon(stats.top_category?.name || 'Other')}
                                </span>
                                <p className="text-xl font-bold text-blue-600">
                                    {stats.top_category?.name || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {formatCurrency(stats.top_category?.amount || 0)} ({stats.top_category?.percentage || 0}%)
                                </p>
                            </div>
                        </div>

                        {/* Budget Status Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Status</h3>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-yellow-600">
                                    {stats.budget_percentage || 0}%
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    of ${formatCurrency(stats.budget_amount || 1500)} budget
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div
                                        className={`h-2.5 rounded-full ${
                                            stats.budget_percentage >= 90 ? 'bg-red-600' :
                                            stats.budget_percentage >= 70 ? 'bg-yellow-600' :
                                            'bg-green-600'
                                        }`}
                                        style={{ width: `${stats.budget_percentage || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Transactions Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h3>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-purple-600">
                                    {stats.total_transactions || 0}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">This month</p>
                            </div>
                        </div>
                    </div>

                    {/* Spending by Category & Monthly Trend */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Spending by Category */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
                            <div className="space-y-4">
                                {stats.category_breakdown?.map((category, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-2">{getCategoryIcon(category.name)}</span>
                                            <span>{category.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${
                                                        category.name === 'Groceries' ? 'bg-blue-500' :
                                                        category.name === 'Utilities' ? 'bg-green-500' :
                                                        category.name === 'Entertainment' ? 'bg-purple-500' :
                                                        category.name === 'Transport' ? 'bg-red-500' :
                                                        'bg-gray-500'
                                                    }`}
                                                    style={{ width: `${category.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {formatCurrency(category.amount)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monthly Trend */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
                            <div className="space-y-4">
                                {stats.monthly_trend?.map((month, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span>{month.name}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${
                                                        month.name === 'January' ? 'bg-blue-500' :
                                                        month.name === 'February' ? 'bg-green-500' :
                                                        'bg-red-500'
                                                    }`}
                                                    style={{ width: `${month.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {formatCurrency(month.amount)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                        </div>
                        <div className="overflow-x-auto">
                            {transactions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No recent transactions.
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="mt-2 text-blue-600 hover:underline"
                                    >
                                        Add your first expense
                                    </button>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {transaction.title}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        transaction.category === 'Groceries' ? 'bg-blue-100 text-blue-800' :
                                                        transaction.category === 'Utilities' ? 'bg-green-100 text-green-800' :
                                                        transaction.category === 'Entertainment' ? 'bg-purple-100 text-purple-800' :
                                                        transaction.category === 'Transport' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {getCategoryIcon(transaction.category)} {transaction.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                                    -{formatCurrency(transaction.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatRelativeDate(transaction.occurred_on)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
    <AddExpenseModal
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddExpense}
    />
)}
{isBudgetModalOpen && ( // ← Add this block
    <BudgetModal
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        currentBudget={stats.budget_amount}
    />
)}

        </div>
    );
}

export default Expenses;