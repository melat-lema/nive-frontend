// src/services/setting.service.js
const api_url = import.meta.env.VITE_API_URL;

function getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_token) {
        return { Authorization: `Bearer ${user.user_token}` };
    }
    return {};
}

async function getUserProfile() {
    const response = await fetch(`${api_url}/api/settings/profile`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
}

async function updateUserProfile(userData) {
    const response = await fetch(`${api_url}/api/settings/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update user profile');
    }
    return response.json();
}

const settingService = {
    getUserProfile,
    updateUserProfile,
    logOut: () => localStorage.removeItem("user"),
};

export default settingService;