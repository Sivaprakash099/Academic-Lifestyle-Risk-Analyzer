import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans selection:bg-indigo-500/30">

            {/* Background Gradients & Blobs */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-[#0F172A] z-0"></div>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Top Left Blob */}
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"
                />

                {/* Bottom Right Blob */}
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"
                />

                {/* Center Accent Blob */}
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px]"
                />
            </div>

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay z-0 pointer-events-none"></div>

            {/* Glassmorphism Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px] px-4 relative z-10"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 rounded-2xl p-8 sm:p-10 relative overflow-hidden ring-1 ring-white/5">

                    {/* Subtle Top Gradient Line */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>

                    <div className="mb-8 text-center">
                        {/* Logo Area */}
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-6 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                            {title}
                        </h2>

                        {/* Gradient Text for Project Name if provided, or just subtitle */}
                        {subtitle && (
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {children}

                </div>

                {/* Copyright */}
                <p className="text-center text-slate-500 text-xs mt-8 font-medium">
                    &copy; {new Date().getFullYear()} Academic Risk Analyzer. <br /> Secure & Private.
                </p>
            </motion.div>
        </div>
    );
};

export default AuthLayout;
