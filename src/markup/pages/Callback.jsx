// src/pages/Callback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
            console.error('No code found in URL');
            navigate('/music');
            return;
        }

        // Send code to backend for token exchange
        fetch('/api/spotify/callback', { // ✅ Relative path for proxy
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true' // ✅ Skip ngrok warning
            },
            body: JSON.stringify({
                code,
                redirect_uri: 'https://9ef5365ffe27.ngrok-free.app/callback' // ✅ Frontend ngrok URL
            })
        })
        .then(response => {
             if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('spotify_token', data.access_token);
            navigate('/music', { replace: true });
        })
        .catch(error => {
            console.error('Error in callback:', error);
            alert('Connection failed. Check backend is running and CORS is enabled.');
            navigate('/music');
        });
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Connecting to Spotify...</p>
            </div>
        </div>
    );
}

export default Callback;