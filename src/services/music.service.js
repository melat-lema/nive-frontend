// src/services/music.service.js
const api_url = import.meta.env.VITE_API_URL; // e.g., http://localhost:3000

function getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_token) {
        return { Authorization: `Bearer ${user.user_token}` };
    }
    return {};
}

async function createTrack(trackData) {
    const response = await fetch(`${api_url}/api/music`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(trackData),
    });
    if (!response.ok) throw new Error('Failed to create track');
    return response.json();
}

// New function: createOrUpdateTrack
async function createOrUpdateTrack(trackData) {
    const response = await fetch(`${api_url}/api/music/upsert`, { // backend endpoint handles insert or update
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(trackData),
    });
    if (!response.ok) throw new Error('Failed to create or update track');
    return response.json();
}

async function getTracks() {
    const response = await fetch(`${api_url}/api/music`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch tracks');
    return response.json();
}

async function getStats() {
    const response = await fetch(`${api_url}/api/music/stats`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
}

const musicService = {
    createTrack,
    createOrUpdateTrack, // added here
    getTracks,
    getStats,
    logOut: () => localStorage.removeItem("user"),
};

export default musicService;
