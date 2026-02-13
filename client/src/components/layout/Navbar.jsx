import React from 'react';
import { Bell, Menu, User, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = ({ onMenuClick, user }) => {
    return (
        <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-text-secondary hover:text-primary transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-xl font-semibold text-text-primary hidden md:block">
                    Dashboard
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-gray-100">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-semibold text-text-primary leading-tight">
                            {user?.name || 'Student'}
                        </p>
                        <p className="text-xs text-text-muted">
                            {user?.email || 'student@example.com'}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
