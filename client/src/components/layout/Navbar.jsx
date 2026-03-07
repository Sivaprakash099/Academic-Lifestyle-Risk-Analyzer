import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Menu, User, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = ({ onMenuClick }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/login');
                    }
                    throw new Error('Failed to fetch user');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                // Redirect if unauthorized or error
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <header className="bg-dark border-b border-dark-lighter h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-text-muted hover:text-secondary transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-xl font-semibold text-text-inverted hidden md:block">
                    Dashboard
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-text-muted hover:text-secondary transition-colors rounded-full hover:bg-dark-light">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full ring-2 ring-dark"></span>
                </button>

                <div className="h-8 w-px bg-dark-lighter mx-1 hidden md:block"></div>

                <div className="relative">
                    {loading ? (
                        <div className="flex items-center gap-3 animate-pulse">
                            <div className="hidden md:block text-right">
                                <div className="h-4 w-24 bg-dark-lighter rounded mb-1"></div>
                                <div className="h-3 w-32 bg-dark-lighter rounded"></div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-dark-lighter"></div>
                        </div>
                    ) : (
                        <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-text-inverted leading-tight group-hover:text-secondary transition-colors">
                                    {userData?.name || 'User'}
                                </p>
                                <p className="text-xs text-text-muted">
                                    {userData?.email || 'user@example.com'}
                                </p>
                            </div>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30 font-bold text-lg hover:scale-105 transition-transform overflow-hidden shadow-glow">
                                    {getInitials(userData?.name)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-success w-3 h-3 rounded-full border-2 border-dark"></div>
                            </div>
                            <ChevronDown size={16} className={`text-text-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-0 pt-2 w-48 transition-all duration-300 ease-in-out">
                                    <div className="bg-dark-light border border-dark-lighter rounded-xl shadow-2xl py-2 overflow-hidden animate-slide-up">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-text-inverted hover:bg-secondary/10 hover:text-secondary transition-colors"
                                        >
                                            <UserCircle size={18} />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-text-inverted hover:bg-secondary/10 hover:text-secondary transition-colors"
                                        >
                                            <Settings size={18} />
                                            Settings
                                        </Link>
                                        <hr className="my-1 border-dark-lighter" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger/10 w-full text-left transition-colors"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
