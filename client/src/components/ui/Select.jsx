import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
    label,
    error,
    id,
    options = [],
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    className={`
            w-full px-4 py-3 rounded-xl border border-gray-200 
            focus:border-primary focus:ring-4 focus:ring-primary/10 
            outline-none transition-all duration-300 appearance-none
            bg-white text-text-primary placeholder:text-text-muted
            ${error ? 'border-danger focus:border-danger focus:ring-danger/10' : ''}
            ${className}
          `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {error && (
                <p className="mt-1 text-sm text-danger ml-1">{error}</p>
            )}
        </div>
    );
};

export default Select;
