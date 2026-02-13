import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, FileText, User, Settings, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, className = '' }) => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Analyze Risk', icon: Activity, path: '/analysis' },
        { name: 'Reports', icon: FileText, path: '/reports' },
        { name: 'Profile', icon: User, path: '/profile' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    const handleLogout = () => {
        // Implement logout logic here
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-soft">
            <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <span className="font-bold text-lg text-text-primary tracking-tight">RiskAnalyzer</span>
                </div>
                <button onClick={onClose} className="md:hidden text-gray-500">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => window.innerWidth < 768 && onClose()}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium
              ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-text-secondary hover:bg-gray-50 hover:text-primary'}
            `}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-danger hover:bg-danger/10 transition-colors duration-300 font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white transition-transform duration-300 md:translate-x-0 md:static ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } ${className}`}
            >
                <SidebarContent />
            </aside>
        </>
    );
};

export default Sidebar;
