import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background blobs for depth */}
            <div className="fixed top-0 left-0 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="fixed top-0 right-0 w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="fixed -bottom-8 left-20 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <Navbar />

            <main className="relative z-10 container mx-auto px-4 py-8">
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        },
                    }}
                />
                {children}
            </main>
        </div>
    );
};

export default Layout;
