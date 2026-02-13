import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
    const variants = {
        primary: "bg-primary/10 text-primary border-primary/20",
        success: "bg-success/10 text-success border-success/20",
        warning: "bg-warning/10 text-warning-DEFAULT border-warning/20", // using DEFAULT for warning text to ensure visibility
        danger: "bg-danger/10 text-danger border-danger/20",
        neutral: "bg-gray-100 text-gray-600 border-gray-200",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
