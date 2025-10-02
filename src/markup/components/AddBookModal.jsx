// src/components/AddBookModal.jsx
import React, { useState } from 'react';

function AddBookModal({ onClose, onAdd }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [status, setStatus] = useState('reading');
    const [startedAt, setStartedAt] = useState(new Date().toISOString().split('T')[0]);
    const [finishedAt, setFinishedAt] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [rating, setRating] = useState(0);
    const [file, setFile] = useState(null); // State for the uploaded file

// src/components/AddExpenseModal.jsx
const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert form data to proper types
    const expenseData = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        subcategory: formData.subcategory || null,
        description: formData.description || null,
        occurred_on: formData.occurred_on,
        is_recurring: formData.is_recurring,
        recurrence_pattern: formData.is_recurring ? formData.recurrence_pattern : null
    };
    
    onAdd(expenseData); // This will send as JSON
};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Add New Book</h2>
                <form onSubmit={handleSubmit}>
                    {/* File Upload Input */}
                    <div className="mb-4">
                        <label htmlFor="book-file" className="block text-sm font-medium text-gray-700 mb-1">
                            Book File (PDF, EPUB, TXT) *
                        </label>
                        <input
                            type="file"
                            id="book-file"
                            accept=".pdf,.epub,.txt"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">Select the book file you want to upload.</p>
                    </div>

                    {/* Title */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {/* Author */}
                    <div className="mb-4">
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                            Author *
                        </label>
                        <input
                            type="text"
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {/* Genre */}
                    <div className="mb-4">
                        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                            Genre
                        </label>
                        <input
                            type="text"
                            id="genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="reading">Reading</option>
                            <option value="finished">Finished</option>
                            <option value="wishlist">Wishlist</option>
                        </select>
                    </div>

                    {/* Conditional Fields */}
                    {status === 'reading' && (
                        <div className="mb-4">
                            <label htmlFor="started-at" className="block text-sm font-medium text-gray-700 mb-1">
                                Started At
                            </label>
                            <input
                                type="date"
                                id="started-at"
                                value={startedAt}
                                onChange={(e) => setStartedAt(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    )}

                    {status === 'finished' && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="finished-at" className="block text-sm font-medium text-gray-700 mb-1">
                                    Finished At
                                </label>
                                <input
                                    type="date"
                                    id="finished-at"
                                    value={finishedAt}
                                    onChange={(e) => setFinishedAt(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                                    Rating (0-10)
                                </label>
                                <input
                                    type="number"
                                    id="rating"
                                    min="0"
                                    max="10"
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </>
                    )}

                    {/* Page Information (for reading/finished) */}
                    {(status === 'reading' || status === 'finished') && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="current-page" className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Page
                                </label>
                                <input
                                    type="number"
                                    id="current-page"
                                    min="0"
                                    value={currentPage}
                                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="total-pages" className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Pages
                                </label>
                                <input
                                    type="number"
                                    id="total-pages"
                                    min="1"
                                    value={totalPages}
                                    onChange={(e) => setTotalPages(Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Add Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBookModal;