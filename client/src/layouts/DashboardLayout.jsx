import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    // Mock user data - replace with actual auth context later
    const user = {
        name: "Student",
        email: "student@example.com",
        avatar: null
    };

    return (
        <div className="flex h-screen bg-light overflow-hidden font-sans">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Navbar */}
                <Navbar
                    onMenuClick={() => setIsSidebarOpen(true)}
                    user={user}
                />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-6 lg:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto h-full animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
