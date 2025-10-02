const api_url = import.meta.env.VITE_API_URL;

function getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_token) {
        return { Authorization: `Bearer ${user.user_token}` };
    }
    return {};
}

async function getBooks() {
    const response = await fetch(`${api_url}/api/books`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
}

async function getBookStats() {
    const response = await fetch(`${api_url}/api/books/stats`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch book stats');
    return response.json();
}

async function createBook(formData) {
    const response = await fetch(`${api_url}/api/books`, {
        method: 'POST',
        headers: {
            ...getAuthHeader()
        },
        body: formData
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create book');
    }
    return response.json();
}

async function getBookById(id) {
    const response = await fetch(`${api_url}/api/books/${id}`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch book');
    return response.json();
}

async function updateProgress(id, currentPage) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.user_token;
  const response = await fetch(`${api_url}/api/books/${id}/progress`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ current_page: currentPage })
  });
  if (!response.ok) throw new Error('Failed to update progress');
  return response.json();
}
// In your book service, add this method:



// Then add it to your service object:
const bookService = {
    getBooks,
    getBookStats,
    createBook,
    getBookById,
    logOut: () => localStorage.removeItem("user"),
    updateProgress,
    
};

export default bookService;
