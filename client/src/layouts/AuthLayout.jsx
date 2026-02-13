import React from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-500 p-4">
            <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                        {subtitle && (
                            <p className="text-gray-500">{subtitle}</p>
                        )}
                    </div>
                    {children}
                </div>

                <p className="text-center mt-6 text-white/80 text-sm">
                    Academic Lifestyle Risk Analyzer &copy; {new Date().getFullYear()}
                </p>
            </motion.div>
        </div>
    );
}
