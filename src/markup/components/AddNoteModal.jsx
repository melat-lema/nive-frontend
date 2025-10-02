// src/components/AddNoteModal.jsx
import React, { useState } from 'react';

function AddNoteModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        is_starred: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

   // src/components/AddNoteModal.jsx
const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert tags string to array
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    // This should be an object with title, content, tags, etc.
    const noteData = {
        title: formData.title || null,
        content: formData.content,
        tags: tagsArray,
        is_starred: formData.is_starred,
        is_archived: false
    };
    
    console.log("📝 Note data to send:", noteData); // ← Add debug log
    onAdd(noteData);
};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Add New Note</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title (Optional)
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter a title for your note"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="6"
                            placeholder="Write your note here..."
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="work, personal, ideas, meeting"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Separate tags with commas (e.g., "work, personal, ideas")
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_starred"
                                checked={formData.is_starred}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Mark as favorite</span>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Add Note
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddNoteModal;