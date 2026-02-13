import React from 'react';
import { X } from 'lucide-react';
import Card from './Card';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <Card className={`relative w-full max-w-lg animate-slide-up ${className}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-text-primary">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </Card>
        </div>
    );
};

export default Modal;
