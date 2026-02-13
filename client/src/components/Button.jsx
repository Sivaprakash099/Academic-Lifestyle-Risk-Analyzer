import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    className = '',
    ...props
}) => {
    const baseStyles = "relative px-6 py-2 rounded-lg font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/50",
        secondary: "bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-secondary/50",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        ghost: "hover:bg-white/10 text-white",
        danger: "bg-danger hover:bg-danger/90 text-white shadow-lg hover:shadow-danger/50",
        glass: "glass-btn",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
