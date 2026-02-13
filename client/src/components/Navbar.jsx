import React, { useState, useEffect } from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { clsx } from 'clsx';

export default function Navbar({ toggleSidebar }) {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState(2); // Mock notification count

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
    }, []);

    const getPageTitle = () => {
        const path = location.pathname.split('/')[1];
        if (!path) return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    };

    return (
        <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 sticky top-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                    <Menu size={24} />
                </button>

                <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                    {getPageTitle()}
                </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Search (Optional) */}
                <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-64 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    <Search size={18} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell size={20} />
                    {notifications > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                </button>

                {/* Profile Dropdown */}
                <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-gray-200">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email || 'student@example.com'}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm ring-1 ring-gray-100">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                    </div>
                </div>
            </div>
        </header>
    );
}
