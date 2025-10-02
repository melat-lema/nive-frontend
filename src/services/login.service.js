const api_url = import.meta.env.VITE_API_URL;

function getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_token) {
        return { Authorization: `Bearer ${user.user_token}` };
    }
    return {};
}

async function logIn(formData) {
    const requestOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    };
    const response = await fetch(`${api_url}/api/login`, requestOption);
    return response;
}

// Example: secured request (after login)
async function getuser() {
    const requestOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(), // 🔑 attach token
        },
    };
    const response = await fetch(`${api_url}/api/user`, requestOption);
    return response;
}

const loginService = {
    logIn,
    getuser,
    logOut: () => localStorage.removeItem("user"),
};

export default loginService;
