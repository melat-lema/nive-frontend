// src/components/SpotifyLogin.jsx
import React from 'react';

function SpotifyLogin() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = 'https://9ef5365ffe27.ngrok-free.app/callback'; // ✅ Frontend ngrok URL
    const scope = 'user-read-currently-playing user-read-private';

    const loginUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&show_dialog=true`;

    return (
        <button
            onClick={() => window.location.href = loginUrl}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center w-full"
        >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Connect Spotify
        </button>
    );
}

export default SpotifyLogin;