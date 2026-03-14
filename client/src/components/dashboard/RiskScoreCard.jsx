import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function RiskScoreCard({ riskScore = 0 }) {
    const getRiskLevel = (score) => {
        if (score >= 7) return { level: 'High Risk', variant: 'danger', color: 'text-[#ef4444]', stroke: '#ef4444' };
        if (score >= 4) return { level: 'Medium Risk', variant: 'warning', color: 'text-[#f59e0b]', stroke: '#f59e0b' };
        return { level: 'Low Risk', variant: 'success', color: 'text-[#22c55e]', stroke: '#22c55e' };
    };

    const { level, variant, color, stroke } = getRiskLevel(riskScore);
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    // Normalize based on max possible normalized score (9)
    const offset = circumference - (Math.min(riskScore, 9) / 9) * circumference;

    return (
        <Card className="flex flex-col items-center justify-center p-6 h-full relative overflow-hidden group hover:shadow-card transition-all duration-300">
            <div className="flex items-center justify-between w-full mb-6">
                <h3 className="text-lg font-bold text-text-primary">Current Risk</h3>
                <Badge variant={variant}>{level}</Badge>
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
                </div>
            </div>

            <div className="text-center mt-6">
                <Badge variant={variant} className="text-sm px-4 py-1.5 shadow-sm">
                    {level}
                </Badge>
            </div>
            <p className="text-center text-text-secondary text-sm px-4 leading-relaxed">
                {level.includes('High')
                    ? "Immediate attention needed. Review your study and lifestyle habits."
                    : level.includes('Medium')
                        ? "Moderate risk detected. Consistency is key to improvement."
                        : "Great work! You are maintaining a healthy academic balance."}
            </p>
        </Card>
    );
}
