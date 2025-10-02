// src/services/goal.service.js
const api_url = import.meta.env.VITE_API_URL;

function getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_token) {
        return { Authorization: `Bearer ${user.user_token}` };
    }
    return {};
}

async function getGoalStats() {
    const response = await fetch(`${api_url}/api/goals/stats`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch goal stats');
    return response.json();
}

async function getAllGoals() {
    const response = await fetch(`${api_url}/api/goals`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch goals');
    return response.json();
}

// src/services/goal.service.js
async function createGoal(goalData) {
    const response = await fetch(`${api_url}/api/goals`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // ← THIS IS MISSING!
            ...getAuthHeader()
        },
        body: JSON.stringify(goalData) // ← This must be stringified JSON
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create goal');
    }
    return response.json();
}
async function updateGoalProgress(goalId, progress) {
    const response = await fetch(`${api_url}/api/goals/${goalId}/progress`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({ progress })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update goal progress');
    }
    return response.json();
}
const goalService = {
    getGoalStats,
    getAllGoals,
    createGoal,
    logOut: () => localStorage.removeItem("user"),
    updateGoalProgress
};

export default goalService;