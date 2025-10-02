// src/pages/Notes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import noteService from '../../services/note.service';
import ClipLoader from 'react-spinners/ClipLoader';
import AddNoteModal from '../components/AddNoteModal';

function Notes() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({});
    const [notes, setNotes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [filteredNotes, setFilteredNotes] = useState([]);
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
            const [statsRes, notesRes] = await Promise.all([
                noteService.getNoteStats(),
                noteService.getAllNotes()
            ]);
            
            setStats(statsRes.data || {});
            setNotes(notesRes.data || []);
        } catch (err) {
            console.error('Error fetching note data:', err);
            setError('Failed to load note data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter notes based on search query and selected tag
    useEffect(() => {
        let filtered = notes;
        
        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(note => 
                note.title?.toLowerCase().includes(query) || 
                note.content.toLowerCase().includes(query)
            );
        }
        
        // Apply tag filter
        if (selectedTag !== 'All') {
            filtered = filtered.filter(note => 
                note.tags && note.tags.includes(selectedTag)
            );
        }
        
        setFilteredNotes(filtered);
    }, [notes, searchQuery, selectedTag]);

    // Handle adding new note
    const handleAddNote = async (noteData) => {
        try {
            await noteService.createNote(noteData);
            setIsModalOpen(false);
            fetchData(); // Refresh all data
        } catch (error) {
            console.error('Error adding note:', error);
            alert('Failed to add note. Please try again.');
        }
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

    // Get most used tag
    const getMostUsedTag = () => {
        if (!notes.length) return { tag: 'N/A', count: 0 };
        
        const tagCounts = {};
        notes.forEach(note => {
            if (note.tags) {
                note.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });
        
        const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
        return sortedTags.length > 0 ? { tag: sortedTags[0][0], count: sortedTags[0][1] } : { tag: 'N/A', count: 0 };
    };

    // Get all unique tags
    const getAllTags = () => {
        const tagsSet = new Set();
        notes.forEach(note => {
            if (note.tags) {
                note.tags.forEach(tag => tagsSet.add(tag));
            }
        });
        return Array.from(tagsSet);
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
                                className="flex items-center px-4 py-2 gap-3 w-full text-blue-600 bg-blue-50 rounded-lg transition-colors"
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
            <div className="flex-1 md:ml-8"> 
                
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        {/* Mobile sidebar toggle */}
<button
    className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
>
    <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
</button>

                        <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
                        <div className="flex items-center space-x-4">
                            
                            {/* Search Box */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Note
                            </button>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Total Notes Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Notes</h3>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-3xl font-bold text-yellow-600">
                                    {stats.total_notes || 0}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">All time</p>
                            </div>
                        </div>

                        {/* This Week Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-3xl font-bold text-blue-600">
                                    {stats.notes_this_week || 0}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">New notes</p>
                            </div>
                        </div>

                        {/* Most Used Tag Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Tag</h3>
                            <div className="flex flex-col items-center text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-2">
                                    {getMostUsedTag().tag}
                                </span>
                                <p className="text-sm text-gray-500">
                                    {getMostUsedTag().count} notes
                                </p>
                            </div>
                        </div>

                        {/* Favorites Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorites</h3>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-3xl font-bold text-red-600">
                                    {stats.starred_notes || 0}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Starred notes</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter by Tags */}
                    <div className="mb-6">
                        <div className="flex items-center">
                            <label className="text-lg font-semibold text-gray-900 mr-4">Filter by tags:</label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSelectedTag('All')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        selectedTag === 'All' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    All
                                </button>
                                {getAllTags().map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            selectedTag === tag 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notes Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {filteredNotes.map(note => (
                            <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-medium text-gray-900 truncate">
                                        {note.title || 'Untitled Note'}
                                    </h4>
                                    <button
                                        onClick={() => {
                                            // Toggle starred status
                                            noteService.toggleStarred(note.id);
                                            fetchData();
                                        }}
                                        className={`text-xl ${note.is_starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                                    >
                                        ★
                                    </button>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {note.content}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-wrap gap-2">
                                        {note.tags && note.tags.map(tag => (
                                            <span key={tag} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                tag === 'work' ? 'bg-green-100 text-green-800' :
                                                tag === 'personal' ? 'bg-blue-100 text-blue-800' :
                                                tag === 'ideas' ? 'bg-purple-100 text-purple-800' :
                                                tag === 'meeting' ? 'bg-orange-100 text-orange-800' :
                                                tag === 'books' ? 'bg-indigo-100 text-indigo-800' :
                                                tag === 'health' ? 'bg-emerald-100 text-emerald-800' :
                                                tag === 'travel' ? 'bg-pink-100 text-pink-800' :
                                                tag === 'cooking' ? 'bg-amber-100 text-amber-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {formatRelativeDate(note.created_at)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredNotes.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {searchQuery || selectedTag !== 'All' ? (
                                <>
                                    <p>No notes found matching your filters.</p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedTag('All');
                                        }}
                                        className="mt-2 text-blue-600 hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>No notes yet.</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="mt-2 text-blue-600 hover:underline"
                                    >
                                        Add your first note
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <AddNoteModal
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddNote}
                />
            )}
        </div>
    );
}

export default Notes;