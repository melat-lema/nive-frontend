// src/services/note.service.js
const api_url = import.meta.env.VITE_API_URL;

function getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_token) {
        return { Authorization: `Bearer ${user.user_token}` };
    }
    return {};
}

async function getNoteStats() {
    const response = await fetch(`${api_url}/api/notes/stats`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch note stats');
    return response.json();
}

async function getAllNotes() {
    const response = await fetch(`${api_url}/api/notes`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
}

// src/services/note.service.js
async function createNote(noteData) {
    console.log("📤 Sending note ", noteData); // ← Add debug log
    
    const response = await fetch(`${api_url}/api/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // ← This is critical!
            ...getAuthHeader()
        },
        body: JSON.stringify(noteData) // ← Must be JSON string
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create note');
    }
    return response.json();
}

async function toggleStarred(noteId) {
    const response = await fetch(`${api_url}/api/notes/${noteId}/toggle-starred`, {
        method: 'PUT',
        headers: {
            ...getAuthHeader()
        }
    });
    if (!response.ok) throw new Error('Failed to toggle starred status');
    return response.json();
}

const noteService = {
    getNoteStats,
    getAllNotes,
    createNote,
    toggleStarred,
    logOut: () => localStorage.removeItem("user"),
};

export default noteService;