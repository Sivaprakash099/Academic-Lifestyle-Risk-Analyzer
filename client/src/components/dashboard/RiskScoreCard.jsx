import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function RiskScoreCard({ riskScore = 0 }) {
    const getRiskLevel = (score) => {
        if (score <= 30) return { level: 'Low', variant: 'success', color: 'text-success', stroke: '#10B981' };
        if (score <= 70) return { level: 'Medium', variant: 'warning', color: 'text-warning', stroke: '#F59E0B' };
        return { level: 'High', variant: 'danger', color: 'text-danger', stroke: '#EF4444' };
    };

    const { level, variant, color, stroke } = getRiskLevel(riskScore);
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (riskScore / 100) * circumference;

    return (
        <Card className="flex flex-col items-center justify-center p-6 h-full relative overflow-hidden group hover:shadow-card transition-all duration-300">
            <div className="flex items-center justify-between w-full mb-6">
                <h3 className="text-lg font-bold text-text-primary">Current Risk</h3>
                <Badge variant={variant}>{level} Risk</Badge>
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                {/* Background Circle */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r={radius}
                        className="text-gray-100"
                        strokeWidth="12"
                        fill="transparent"
                        stroke="currentColor"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="96"
                        cy="96"
                        r={radius}
                        className={color}
                        strokeWidth="12"
                        fill="transparent"
                        stroke={stroke}
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="flex flex-col items-center z-10 animate-fade-in">
                    <span className={`text-5xl font-bold ${color}`}>{riskScore}</span>
                    <span className="text-xs text-text-muted font-medium uppercase tracking-wider mt-1">Score</span>
                </div>
            </div>

            <p className="text-center text-text-secondary text-sm px-4 leading-relaxed">
                {level === 'High'
                    ? "Immediate attention needed. Review your study and lifestyle habits."
                    : level === 'Medium'
                        ? "Moderate risk detected. Consistency is key to improvement."
                        : "Great work! You are maintaining a healthy academic balance."}
            </p>
        </Card>
    );
}
