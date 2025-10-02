// src/pages/Books.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookService from '../../services/book.service';
import ClipLoader from 'react-spinners/ClipLoader';
import AddBookModal from '../components/AddBookModal';

function Books() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await bookService.getBooks();
            setBooks(response.data || []);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await bookService.getBookStats();
            setStats(response.data || {});
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Fetch books and stats initially
    useEffect(() => {
        fetchBooks();
        fetchStats();
    }, []);

    // Optional: refresh when tab/window regains focus
    useEffect(() => {
        const handleFocus = () => {
            fetchBooks();
            fetchStats();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const handleAddBook = async (bookData) => {
        try {
            await bookService.createBook(bookData);
            setIsModalOpen(false);
            fetchBooks(); // Refresh books after adding
            fetchStats(); // Refresh stats after adding
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Failed to add book. Please try again.');
        }
    };

  // --- Inside Books.jsx ---

const handleReadBook = (book) => {
    // ✅ Remove the function from state
    navigate(`/books/read/${book.id}`);
};


    // --- Inside Books.jsx ---

// Destructure with defaults
const currentlyReading = stats.currently_reading ?? 0;
const completedThisYear = stats.completed_this_year ?? 0;
const goalPercentage = stats.reading_goal?.percentage ?? 0;
const goalProgress = stats.reading_goal?.progress ?? 0;
const goalTarget = stats.reading_goal?.target ?? 1;

    // --- Inside Books.jsx ---

const handleProgressUpdate = async (bookId, currentPage) => {
    try {
        const updated = await bookService.updateProgress(bookId, currentPage);

        // ✅ Update this book in local state
        setBooks((prev) =>
            prev.map((b) => (b.id === bookId ? { ...b, ...updated } : b))
        );

        // ✅ Refresh stats so cards update
        const statsRes = await bookService.getBookStats();
        // Create a new object to ensure React detects the change
        setStats({ ...statsRes.data }); // <-- This forces a re-render

    } catch (error) {
        console.error("Failed to update progress:", error);
    }
};
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
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
                                  className="flex items-center px-4 py-2 gap-3 w-full text-blue-600 bg-blue-50 rounded-lg transition-colors"
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
                        <h1 className="text-2xl font-bold text-gray-900">Books Tracker</h1>
                       
                    </div>
                        </div>
                        
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Book
                        </button>
                    </div>
                </header>

                
               

            {/* Main Content */}
            
                

                {/* Stats Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Currently Reading Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Currently Reading</h3>
                            <div className="flex flex-col items-center text-center">
                                <svg className="w-12 h-12 text-blue-500 mb-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <p className="text-3xl font-bold text-blue-600">{currentlyReading}</p>
                                <p className="text-sm text-gray-500 mt-1">Books in progress</p>
                            </div>
                        </div>

                        {/* Completed This Year Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed This Year</h3>
                            <div className="flex flex-col items-center text-center">
                                <svg className="w-12 h-12 text-green-500 mb-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-3xl font-bold text-green-600">{completedThisYear}</p>
                                <p className="text-sm text-gray-500 mt-1">Books finished</p>
                            </div>
                        </div>

                        {/* Reading Goal Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Goal</h3>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-purple-600">{goalPercentage}%</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {goalProgress} / {goalTarget} books
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div
                                        className="bg-purple-600 h-2.5 rounded-full"
                                        style={{ width: `${goalPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Books Grid/Table */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Your Books</h3>
                            </div>
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="flex justify-center items-center p-8">
                                        <ClipLoader size={32} color="#6B7280" />
                                    </div>
                                ) : books.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No books added yet.</p>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="mt-2 text-purple-600 hover:underline"
                                        >
                                            Add your first book
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                        {books.map(book => {
                                            const progress = book.total_pages > 0 ? Math.round((book.current_page / book.total_pages) * 100) : 0;
                                            // Use the actual book status from the backend
                                           const displayStatus = book.status || "reading";


                                            return (
                                                <div key={book.id} className="border rounded-lg p-4 flex flex-col">
                                                    <div className="flex items-center mb-3">
                                                        <div className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold mr-3 ${
                                                            displayStatus === 'reading' ? 'bg-blue-500' :
                                                            displayStatus === 'finished' ? 'bg-green-500' :
                                                            'bg-purple-500'
                                                        }`}>
                                                            B
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 truncate">{book.title}</h4>
                                                            <p className="text-sm text-gray-500 truncate">{book.author}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-auto pt-2">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                displayStatus === 'reading' ? 'bg-blue-100 text-blue-800' :
                                                                displayStatus === 'finished' ? 'bg-green-100 text-green-800' :
                                                                'bg-purple-100 text-purple-800'
                                                            }`}>
                                                                {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                                                            </span>
                                                            {book.total_pages > 0 && (
                                                                <span className="text-xs text-gray-500">
                                                                    {progress}%
                                                                </span>
                                                            )}
                                                        </div>
                                                        {book.total_pages > 0 && (
                                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                <div
                                                                    className={`h-1.5 rounded-full ${
                                                                        displayStatus === 'reading' ? 'bg-blue-500' :
                                                                        displayStatus === 'finished' ? 'bg-green-500' :
                                                                        'bg-purple-500'
                                                                    }`}
                                                                    style={{ width: `${Math.min(100, progress)}%` }}
                                                                ></div>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => handleReadBook(book)}
                                                            className="mt-3 w-full py-1.5 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                                                        >
                                                            Read
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <AddBookModal
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddBook}
                />
            )}
        </div>
    );
}

export default Books;