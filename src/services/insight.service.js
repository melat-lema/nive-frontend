// src/services/insight.service.js
const api_url = import.meta.env.VITE_API_URL;

function getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_token) {
        return { Authorization: `Bearer ${user.user_token}` };
    }
    return {};
}

async function getInsightStats() {
    const response = await fetch(`${api_url}/api/insights/stats`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch insight stats');
    return response.json();
}

async function getAllInsights() {
    const response = await fetch(`${api_url}/api/insights`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch insights');
    return response.json();
}

const insightService = {
    getInsightStats,
    getAllInsights,
    logOut: () => localStorage.removeItem("user"),
};

export default insightService;