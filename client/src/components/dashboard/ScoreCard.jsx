import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

export const ScoreCard = ({ score = 0, riskLevel = 'Low' }) => {
    const [progress, setProgress] = useState(0);

    // Animate progress on mount
    useEffect(() => {
        const timer = setTimeout(() => setProgress(score), 500);
        return () => clearTimeout(timer);
    }, [score]);

    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    let color = 'text-green-500';
    if (score > 30) color = 'text-yellow-500';
    if (score > 60) color = 'text-red-500';

    return (
        <Card className="p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Current Risk Score</h3>

            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Background Circle */}
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="absolute transform -rotate-90"
                >
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="text-slate-100"
                    />
                </svg>

                {/* Progress Circle */}
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="absolute transform -rotate-90"
                >
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className={color}
                    />
                </svg>

                <div className="flex flex-col items-center">
                    <span className={`text-3xl font-bold ${color}`}>{score}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">/ 100</span>
                </div>
            </div>

            <div className={`mt-6 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold 
        ${riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                    riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {riskLevel} Risk
            </div>

            <p className="mt-4 text-xs text-slate-400 max-w-[200px]">
                Based on your recent lifestyle analysis inputs.
            </p>
        </Card>
    );
};
