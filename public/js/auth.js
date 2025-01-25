// auth.js
document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    const currentPath = window.location.pathname;

    // If userId exists in localStorage, check if the session is still valid
    if (userId) {
        try {
            // Check session with the backend
            const response = await fetch('/api/session-check', { method: 'GET', credentials: 'include' });

            // If the response is not OK (session invalid), remove userId from localStorage and redirect to login
            if (!response.ok) {
                throw new Error('Session invalid');
            }
        } catch (error) {
            console.error('Session check failed:', error);
            localStorage.removeItem('userId');  // Remove the invalid userId from localStorage
            window.location.href = '/';  // Redirect to the login page
        }
    } else if (currentPath !== '/tchr/login') {
        // If no userId in localStorage, redirect to the login page (unless already on the login page)
        window.location.href = '/';
    }
    else if (currentPath !== '/std/login') {
        // If no userId in localStorage, redirect to the login page (unless already on the login page)
        window.location.href = '/';
    }
});
