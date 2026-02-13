import React from 'react';

const ProgressBar = ({ progress, color = 'primary', height = 'h-2', className = '' }) => {
    const colors = {
        primary: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        danger: "bg-danger",
    };

    return (
        <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${height} ${className}`}>
            <div
                className={`${colors[color]} h-full transition-all duration-500 ease-out`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
        </div>
    );
};

export default ProgressBar;
