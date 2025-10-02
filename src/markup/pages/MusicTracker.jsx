// src/pages/Music.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import musicService from '../../services/music.service';
import ClipLoader from 'react-spinners/ClipLoader';
import SpotifyLogin from './SpotifyLogin';

function Music() {
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotify_token'));
    const [nowPlaying, setNowPlaying] = useState(null);
    const [user, setUser] = useState(null); // ✅ Add user state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // ✅ Load user data
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
    }, []);

    const getActivityIcon = (type) => {
        const icons = {
            'music': '🎵',
            'books': '📚',
            'expenses': '💰',
            'goals': '🎯',
            'notes': '📝',
            'dashboard': '📊',
            'settings': '⚙️',
            'insights': '📈'
        };
        return icons[type] || '📊';
    };

    // Load initial data on mount if token exists
    useEffect(() => {
        let intervalId;

        if (spotifyToken) {
            console.log("Starting Spotify polling...");

            const fetchNowPlaying = async () => {
                try {
                    const response = await fetch('/api/spotify/now-playing', {
                        headers: { Authorization: `Bearer ${spotifyToken}` }
                    });

                    if (!response) {
                        console.error('No response from server');
                        setNowPlaying(null);
                        return;
                    }

                    if (response.status === 204) {
                        console.log("No content from Spotify player");
                        setNowPlaying(null);
                        return;
                    }

                    if (!response.ok) {
                        console.error(`Spotify API error: ${response.status} ${response.statusText}`);
                        if (response.status === 401) handleDisconnectSpotify();
                        return;
                    }

                    const data = await response.json();

                    if (data.item) {
                        console.log("Now playing item:", data.item.name);
                        setNowPlaying(data.item);

                        // Deduplication logic
                        const currentTrackName = data.item.name;
                        const currentArtistName = data.item.artists[0]?.name || 'Unknown Artist';
                        const today = new Date().toDateString();

                        const isAlreadyLoggedToday = tracks.some(track =>
                            track.track_name === currentTrackName &&
                            track.artist === currentArtistName &&
                            new Date(track.listened_at).toDateString() === today
                        );

                        if (!isAlreadyLoggedToday) {
                            console.log("New track detected, saving to DB...");
                            await saveTrackToDB({
                                track_name: currentTrackName,
                                artist: currentArtistName,
                                album: data.item.album?.name || 'Unknown Album',
                                mood: 'listening',
                                genre: '',
                                duration_minutes: Math.floor((data.item.duration_ms || 0) / 60000),
                                listened_at: new Date()
                            });
                        } else {
                            console.log("Track already logged today.");
                        }
                    } else {
                        setNowPlaying(null);
                    }
                } catch (error) {
                    console.error('Error fetching now playing:', error);
                    setNowPlaying(null);
                }
            };

            fetchNowPlaying();
            intervalId = setInterval(fetchNowPlaying, 10000); // poll every 10s
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
            console.log("Cleared Spotify polling interval");
        };
    }, [spotifyToken, tracks]);

    const fetchTracks = async () => {
        setLoading(true);
        try {
            console.log("Fetching recent tracks...");
            const response = await musicService.getTracks();
            console.log("Tracks fetched:", response.data);
            setTracks(response.data || []);
        } catch (error) {
            console.error('Error fetching tracks:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
             console.log("Fetching stats...");
            const response = await musicService.getStats();
            console.log("Stats fetched:", response.data);
            setStats(response.data || {});
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const saveTrackToDB = async (trackData) => {
        try {
            console.log("Saving track to DB:", trackData.track_name);
            await musicService.createTrack(trackData);
            console.log("Track saved.");
            await fetchTracks();
            await fetchStats();
        } catch (error) {
            console.error('Error saving track to DB:', error);
        }
    };

    const handleDisconnectSpotify = () => {
        console.log("Disconnecting Spotify...");
        localStorage.removeItem('spotify_token');
        setSpotifyToken(null);
        setNowPlaying(null);
        setTracks([]);
        setStats(null);
    };

    // ✅ Add logout function
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate('/login');
    };

    // Safely calculate stats values
    const topGenre = stats?.top_artists?.[0]?.artist || 'Unknown';
    const topGenrePercentage = stats?.top_artists?.[0]?.count || 0;
    const moodDistribution = stats?.mood_distribution || [];
    const songsThisWeek = stats?.daily_listening?.length || 0;
    const lastWeekSongs = 35; // Example baseline
    const trend = songsThisWeek > lastWeekSongs ? '+12%' : '-8%';

    // ✅ Fetch data on mount
    useEffect(() => {
        fetchTracks();
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div 
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-sm border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:static md:z-10`}
            >
                <div className="p-6">
                    <div className="flex items-center mb-8">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                            L
                        </div>
                        <span className="ml-2 text-xl font-bold">LifeTracker</span>
                    </div>

                    {/* CORE Section */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2">CORE</h3>
                        <nav className="space-y-2">
                            <button
                                onClick={() => { navigate('/dashboard'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('dashboard')}</span>
                                Dashboard
                            </button>
                            <button
                                onClick={() => { navigate('/music'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 w-full text-blue-600 bg-blue-50 rounded-lg transition-colors"
                            >
                               <span className="text-lg">{getActivityIcon('music')}</span>
                                Music
                            </button>
                            <button
                                onClick={() => { navigate('/books'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('books')}</span>
                                Books
                            </button>
                            <button
                                onClick={() => { navigate('/expenses'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('expenses')}</span>
                                Expenses
                            </button>
                            <button
                                onClick={() => { navigate('/notes'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('notes')}</span>
                                Notes
                            </button>
                            <button
                                onClick={() => { navigate('/goals'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                               <span className="text-lg">{getActivityIcon('goals')}</span>
                                Goals
                            </button>
                        </nav>
                    </div>

                    {/* ANALYTICS Section */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2">ANALYTICS</h3>
                        <nav className="space-y-2">
                            <button
                                onClick={() => { navigate('/insights'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('insights')}</span>
                                Insights
                            </button>
                        </nav>
                    </div>

                    {/* SYSTEM Section */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2">SYSTEM</h3>
                        <nav className="space-y-2">
                            <button
                                onClick={() => { navigate('/settings'); setIsSidebarOpen(false); }}
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-lg">{getActivityIcon('settings')}</span>
                                Settings
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 md:ml-8"> 
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        {/* Hamburger Menu for Mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <h1 className="text-2xl font-bold text-gray-900">Music Tracker</h1>
                        
                        {/* User and Logout - ✅ Added this section */}
                        <div className="flex items-center space-x-4">
                            <div 
                                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
                                onClick={() => navigate('/settings')}
                            >
                                {user ? `${user.first_name?.charAt(0) || 'J'}${user.last_name?.charAt(0) || 'D'}` : 'JD'}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Top Artist Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Artist</h3>
                            <div className="flex flex-col items-center text-center">
                                <svg className="w-12 h-12 text-purple-500 mb-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4a4 4 0 110 8 4 4 0 010-8zm0 10c-3.33 0-6 1.34-6 3v1h12v-1c0-1.66-2.67-3-6-3z"/>
                                </svg>
                                <p className="text-2xl font-bold text-purple-600">{stats?.top_artists?.[0]?.artist || 'Unknown'}</p>
                                <p className="text-sm text-gray-500 mt-1">{stats?.top_artists?.[0]?.count || 0} plays</p>
                            </div>
                        </div>

                        {/* Listening Activity Card */}
                        {/* Listening Activity Card */}
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Listening Activity</h3>
    {stats?.daily_listening?.length > 0 ? (
        <div className="flex items-end space-x-2 h-32">
            {stats.daily_listening.map((day, index) => {
                const colors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-pink-500"];
                const color = colors[index % colors.length];
                const height = Math.min(day.count * 10, 120);
                return (
                    <div key={index} className="flex flex-col items-center">
                        <div
                            className={`${color} w-6 rounded-t-lg transition-all`}
                            style={{ height: `${height}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">{day.date}</span>
                    </div>
                );
            })}
        </div>
    ) : (
        <p className="text-sm text-gray-500">No listening data yet.</p>
    )}
</div>

                        {/* This Week Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-purple-600">{songsThisWeek}</p>
                                <p className="text-sm text-gray-500 mt-1">Songs logged</p>
                                <p className="text-xs text-green-600 mt-1">↗ {trend} from last week</p>
                            </div>
                        </div>
                    </div>

                    {/* Now Playing Widget */}
                    {nowPlaying && (
                        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Now Playing</h3>
                            <div className="flex items-center">
                                <img 
                                    src={nowPlaying.album.images[0]?.url} 
                                    alt="Album art" 
                                    className="w-16 h-16 rounded mr-4"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">{nowPlaying.name}</p>
                                    <p className="text-sm text-gray-500">{nowPlaying.artists[0].name}</p>
                                    <p className="text-xs text-gray-400">{nowPlaying.album.name}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Music Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Music</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Song</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mood</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                <ClipLoader size={20} color="#6B7280" />
                                            </td>
                                        </tr>
                                    ) : tracks.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                {spotifyToken ? 'Listening for your music...' : 'Connect Spotify to start tracking your music.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        tracks.slice(0, 5).map(track => (
                                            <tr key={track.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{track.track_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{track.artist}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        {track.genre || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        {track.mood || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(track.listened_at).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Spotify Connect Section */}
                    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spotify Integration</h3>
                        {!spotifyToken ? (
                            <div className="flex items-center justify-center p-4">
                                <SpotifyLogin />
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-green-600 font-medium">Connected!</p>
                                    <p className="text-sm text-gray-500">Auto-tracking your music</p>
                                </div>
                                <button
                                    onClick={handleDisconnectSpotify}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Disconnect
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Music;