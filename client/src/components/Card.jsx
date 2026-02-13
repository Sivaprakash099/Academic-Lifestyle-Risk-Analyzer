import React from 'react';

const Card = ({ children, className = '', title }) => {
    return (
        <div className={`glass-card ${className}`}>
            {title && (
                <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;
