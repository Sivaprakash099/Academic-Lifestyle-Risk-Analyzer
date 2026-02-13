import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    disabled = false,
    type = 'button',
    ...props
}) => {

    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100";

    const variants = {
        primary: "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30",
        secondary: "bg-white hover:bg-gray-50 text-text-primary border border-gray-200",
        outline: "border-2 border-primary text-primary hover:bg-primary/5",
        danger: "bg-danger hover:bg-red-600 text-white shadow-lg shadow-danger/30",
        ghost: "text-text-secondary hover:bg-gray-100 hover:text-text-primary",
    };

    const sizes = {
        sm: "text-sm py-1.5 px-3",
        md: "text-base py-2.5 px-5",
        lg: "text-lg py-3 px-6",
        icon: "p-2",
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
