import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const InputField = ({
    label,
    id,
    type = "text",
    icon: Icon,
    error,
    className,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value.length > 0);
        if (props.onBlur) props.onBlur(e);
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (props.onFocus) props.onFocus(e);
    }

    const handleChange = (e) => {
        setHasValue(e.target.value.length > 0);
        if (props.onChange) props.onChange(e);
    }

    return (
        <div className={clsx("relative", className)}>
            <div className="relative group">

                {/* Icon */}
                {Icon && (
                    <div className={clsx(
                        "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 z-10",
                        isFocused ? "text-indigo-400" : "text-slate-500"
                    )}>
                        <Icon className="h-5 w-5" />
                    </div>
                )}

                {/* Input */}
                <input
                    id={id}
                    type={type}
                    className={clsx(
                        "block w-full bg-slate-800/50 border rounded-xl text-slate-100 placeholder-transparent focus:outline-none transition-all duration-300 sm:text-sm",
                        Icon ? "pl-11 pr-4 py-3.5" : "px-4 py-3.5",
                        error
                            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                            : "border-white/10 hover:border-white/20 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/20"
                    )}
                    placeholder={label}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    {...props}
                />

                {/* Floating Label */}
                <label
                    htmlFor={id}
                    className={clsx(
                        "absolute transition-all duration-200 pointer-events-none",
                        Icon ? "left-11" : "left-4",
                        (isFocused || hasValue || props.value)
                            ? "-top-2.5 text-xs font-semibold text-indigo-400 bg-slate-900 border border-slate-700/50 rounded px-2 z-20"
                            : "top-3.5 text-sm text-slate-500"
                    )}
                >
                    {label}
                </label>

                {/* Glow Effect */}
                <div className={clsx(
                    "absolute -inset-0.5 rounded-xl blur opacity-0 transition-opacity duration-500 pointer-events-none",
                    isFocused ? "opacity-30 bg-indigo-500" : ""
                )} />
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 mt-1.5 ml-1 font-medium flex items-center"
                >
                    <span className="w-1 h-1 rounded-full bg-red-400 mr-1.5"></span>
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default InputField;
