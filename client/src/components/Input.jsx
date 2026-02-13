import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full glass-input ${error ? 'border-danger focus:ring-danger' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-danger animate-pulse">{error}</p>
            )}
        </div>
    );
};

export default Input;
