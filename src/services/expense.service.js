// src/services/expense.service.js
// src/services/expense.service.js
const api_url = import.meta.env.VITE_API_URL;

function getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_token) {
        return { Authorization: `Bearer ${user.user_token}` };
    }
    return {};
}

// ... other functions ...

async function createExpense(expenseData) {
    const response = await fetch(`${api_url}/api/expenses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // ← Add this header
            ...getAuthHeader()
        },
        body: JSON.stringify(expenseData) // ← Send as JSON string
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create expense');
    }
    return response.json();
}


async function getExpenseStats() {
    const response = await fetch(`${api_url}/api/expenses/stats`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch expense stats');
    return response.json();
}

async function getRecentTransactions() {
    const response = await fetch(`${api_url}/api/expenses/recent`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch recent transactions');
    return response.json();
}
async function setBudget(amount) {
    const response = await fetch(`${api_url}/api/expenses/budget`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({ amount })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to set budget');
    }
    return response.json();
}


const expenseService = {
    getExpenseStats,
    getRecentTransactions,
    createExpense,
    logOut: () => localStorage.removeItem("user"),
    setBudget
};

export default expenseService;