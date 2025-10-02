// src/services/dashboard.service.js
const api_url = import.meta.env.VITE_API_URL;

function getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_token) {
        return { Authorization: `Bearer ${user.user_token}` };
    }
    return {};
}

async function getDashboardStats() {
    const response = await fetch(`${api_url}/api/dashboard/stats`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
}

async function getRecentActivity() {
    const response = await fetch(`${api_url}/api/dashboard/recent-activity`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch recent activity');
    return response.json();
}

const dashboardService = {
    getDashboardStats,
    getRecentActivity,
    logOut: () => localStorage.removeItem("user"),
};

export default dashboardService;