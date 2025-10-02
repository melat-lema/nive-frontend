// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import settingService from '../../services/setting.service';
import ClipLoader from 'react-spinners/ClipLoader';

function Settings() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        theme_preference: 'system',
        accent_color: '#00A651',
        timezone: 'UTC',
        language: 'en',
        enable_email_notifications: true,
        enable_goal_reminders: true,
        enable_push_notifications: false,
        two_factor_enabled: false
    });
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        theme_preference: 'system',
        accent_color: '#00A651',
        timezone: 'UTC',
        language: 'en',
        enable_email_notifications: true,
        enable_goal_reminders: true,
        enable_push_notifications: false,
        two_factor_enabled: false
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    // Fetch user data
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const userData = await settingService.getUserProfile();
            setUser(userData);
            setFormData({
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                theme_preference: userData.theme_preference,
                accent_color: userData.accent_color,
                timezone: userData.timezone,
                language: userData.language,
                enable_email_notifications: userData.enable_email_notifications,
                enable_goal_reminders: userData.enable_goal_reminders,
                enable_push_notifications: userData.enable_push_notifications,
                two_factor_enabled: userData.two_factor_enabled
            });
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to load user settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle saving settings
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await settingService.updateUserProfile(formData);
            setUser(formData); // Update local state
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle password change
    const handlePasswordChange = () => {
        // In a real app, this would open a modal or redirect to a password change page
        alert('Password change functionality is not implemented in this demo');
    };

    // Handle 2FA toggle
    const handleTwoFactorToggle = () => {
        // In a real app, this would handle 2FA setup
        alert('Two-factor authentication setup is not implemented in this demo');
    };

    // Handle data export
    const handleDataExport = () => {
        // In a real app, this would trigger a download of user data
        alert('Data export functionality is not implemented in this demo');
    };

    // Handle account deletion
    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
            alert('Account deletion is not implemented in this demo');
        }
    };

    // Get initials for avatar
    const getAvatarInitials = () => {
        if (!user.first_name && !user.last_name) return 'JD';
        return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <ClipLoader size={32} color="#6B7280" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={fetchUserData}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

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
                                className="flex items-center px-4 py-2 gap-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                                  className="flex items-center px-4 py-2 gap-3 w-full text-blue-600 bg-blue-50 rounded-lg transition-colors"
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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6 py-4 flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    </div>
                </header>

                {/* Profile Settings */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
                        
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {getAvatarInitials()}
                            </div>
                            <div className="ml-4">
                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                    Change Avatar
                                </button>
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Timezone
                                    </label>
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">America/New York</option>
                                        <option value="America/Los_Angeles">America/Los Angeles</option>
                                        <option value="Europe/London">Europe/London</option>
                                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                                        <option value="Australia/Sydney">Australia/Sydney</option>
                                        <option value="UTC-8">UTC-8 (Pacific Time)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Language
                                    </label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="zh">Chinese</option>
                                        <option value="ja">Japanese</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                                        isSaving ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                    <p className="text-sm text-gray-500">Receive email updates about your goals and achievements</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="email_notifications"
                                        name="enable_email_notifications"
                                        checked={formData.enable_email_notifications}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="email_notifications"
                                        className={`block w-12 h-6 rounded-full cursor-pointer ${
                                            formData.enable_email_notifications ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block w-4 h-4 rounded-full bg-white transform transition-transform ${
                                                formData.enable_email_notifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        ></span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Goal Reminders</h3>
                                    <p className="text-sm text-gray-500">Get reminded about upcoming goal deadlines</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="goal_reminders"
                                        name="enable_goal_reminders"
                                        checked={formData.enable_goal_reminders}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="goal_reminders"
                                        className={`block w-12 h-6 rounded-full cursor-pointer ${
                                            formData.enable_goal_reminders ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block w-4 h-4 rounded-full bg-white transform transition-transform ${
                                                formData.enable_goal_reminders ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        ></span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Weekly Summary</h3>
                                    <p className="text-sm text-gray-500">Receive a weekly summary of your activities</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="weekly_summary"
                                        name="enable_push_notifications"
                                        checked={formData.enable_push_notifications}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="weekly_summary"
                                        className={`block w-12 h-6 rounded-full cursor-pointer ${
                                            formData.enable_push_notifications ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block w-4 h-4 rounded-full bg-white transform transition-transform ${
                                                formData.enable_push_notifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        ></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h2>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Theme
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div
                                    className={`p-4 border-2 rounded-lg cursor-pointer ${
                                        formData.theme_preference === 'light' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setFormData(prev => ({ ...prev, theme_preference: 'light' }))}
                                >
                                    <div className="h-16 bg-white rounded-md mb-2"></div>
                                    <div className="text-center">Light</div>
                                </div>
                                
                                <div
                                    className={`p-4 border-2 rounded-lg cursor-pointer ${
                                        formData.theme_preference === 'dark' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setFormData(prev => ({ ...prev, theme_preference: 'dark' }))}
                                >
                                    <div className="h-16 bg-gray-800 rounded-md mb-2"></div>
                                    <div className="text-center">Dark</div>
                                </div>
                                
                                <div
                                    className={`p-4 border-2 rounded-lg cursor-pointer ${
                                        formData.theme_preference === 'system' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setFormData(prev => ({ ...prev, theme_preference: 'system' }))}
                                >
                                    <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-800 rounded-md mb-2"></div>
                                    <div className="text-center">System</div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Accent Color
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, accent_color: '#00A651' }))}
                                    className={`w-8 h-8 rounded-full ${formData.accent_color === '#00A651' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                                    style={{ backgroundColor: '#00A651' }}
                                ></button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, accent_color: '#3B82F6' }))}
                                    className={`w-8 h-8 rounded-full ${formData.accent_color === '#3B82F6' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                    style={{ backgroundColor: '#3B82F6' }}
                                ></button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, accent_color: '#9333EA' }))}
                                    className={`w-8 h-8 rounded-full ${formData.accent_color === '#9333EA' ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                                    style={{ backgroundColor: '#9333EA' }}
                                ></button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, accent_color: '#EC4899' }))}
                                    className={`w-8 h-8 rounded-full ${formData.accent_color === '#EC4899' ? 'ring-2 ring-offset-2 ring-pink-500' : ''}`}
                                    style={{ backgroundColor: '#EC4899' }}
                                ></button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, accent_color: '#F59E0B' }))}
                                    className={`w-8 h-8 rounded-full ${formData.accent_color === '#F59E0B' ? 'ring-2 ring-offset-2 ring-yellow-500' : ''}`}
                                    style={{ backgroundColor: '#F59E0B' }}
                                ></button>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Security */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Security</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                </div>
                                <button
                                    onClick={handleTwoFactorToggle}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    {user.two_factor_enabled ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Data Export</h3>
                                    <p className="text-sm text-gray-500">Download all your data in JSON format</p>
                                </div>
                                <button
                                    onClick={handleDataExport}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    Export Data
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Change Password</h3>
                                    <p className="text-sm text-gray-500">Update your account password</p>
                                </div>
                                <button
                                    onClick={handlePasswordChange}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">Delete Account</h3>
                                <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;