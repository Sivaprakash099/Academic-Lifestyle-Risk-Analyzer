import React from 'react';

const Input = ({
    label,
    error,
    id,
    className = '',
    type = 'text',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`
          w-full px-4 py-3 rounded-xl border border-gray-200 
          focus:border-primary focus:ring-4 focus:ring-primary/10 
          outline-none transition-all duration-300 
          bg-white text-text-primary placeholder:text-text-muted
          ${error ? 'border-danger focus:border-danger focus:ring-danger/10' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-danger ml-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
