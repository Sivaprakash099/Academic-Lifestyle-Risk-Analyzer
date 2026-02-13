```
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ClipboardList, 
    BarChart2, 
    User, 
    Settings, 
    LogOut, 
    BookOpen,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import authService from '../services/authService';

export default function Sidebar({ isOpen, toggleSidebar, isMobile }) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Analyze Risk', path: '/analysis', icon: ClipboardList },
        { name: 'Reports', path: '/reports', icon: BarChart2 },
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const sidebarContent = (
        <div className="flex bg-white flex-col h-full border-r border-gray-200 shadow-sm transition-all duration-300">
            {/* Logo Section */}
            <div className={clsx("flex items-center h-16 px-6 border-b border-gray-100", collapsed && !isMobile ? "justify-center px-2" : "justify-between")}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex-shrink-0 bg-indigo-600 rounded-lg p-1.5">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    {(!collapsed || isMobile) && (
                        <span className="font-bold text-lg text-gray-900 whitespace-nowrap">AcadeRisk</span>
                    )}
                </div>
                {!isMobile && (
                    <button 
                        onClick={toggleCollapse} 
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors hidden lg:block"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                )}
                {isMobile && (
                    <button onClick={toggleSidebar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={isMobile ? toggleSidebar : undefined}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                isActive 
                                    ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )
                        }
                    >
                        <link.icon 
                            size={20} 
                            className={clsx("flex-shrink-0 transition-colors", collapsed && !isMobile ? "mx-auto" : "")} 
                        />
                        {(!collapsed || isMobile) && (
                            <span className="whitespace-nowrap">{link.name}</span>
                        )}
                        
                        {/* Tooltip for collapsed mode */}
                        {collapsed && !isMobile && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                {link.name}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User & Logout Section */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className={clsx(
                        "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group",
                        collapsed && !isMobile ? "justify-center" : ""
                    )}
                >
                    <LogOut size={20} className={clsx("flex-shrink-0", collapsed && !isMobile ? "mx-auto" : "")} />
                    {(!collapsed || isMobile) && <span className="font-medium">Logout</span>}
                    
                    {collapsed && !isMobile && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                            Logout
                        </div>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside 
                className={clsx(
                    "hidden lg:block fixed inset-y-0 left-0 bg-white z-30 transition-all duration-300 ease-in-out border-r border-gray-200",
                    collapsed ? "w-20" : "w-64"
                )}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleSidebar}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden shadow-2xl"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
```
