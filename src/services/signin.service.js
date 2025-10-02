const api_url = import.meta.env.VITE_API_URL;
async function signinUser(userData) {
    const requestOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    };

    const response = await fetch(`${api_url}/api/signin`, requestOption);

    // ✅ Check if response is ok and has content
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text) {
        throw new Error('Empty response from server');
    }

    try {
        return JSON.parse(text);
    } catch (err) {
        throw new Error('Invalid JSON response: ' + text);
    }
}

const signinService = {
    signinUser,
};

export default signinService;