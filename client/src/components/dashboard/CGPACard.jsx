import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ProgressBar from '../ui/ProgressBar';
import { GraduationCap, ArrowUpRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function CGPACard({ cgpaData = {}, onUpdate }) {
    const navigate = useNavigate();

    const current = Number(cgpaData.currentCGPA || 0);
    const target = Number(cgpaData.targetCGPA || 0);
    const completed = Number(cgpaData.completedSemesters || 0);
    
    // Formula for required SGPA in NEXT semester: (Target * (Done + 1)) - (Current * Done)
    const requiredSGPA = (target * (completed + 1)) - (current * completed);
    const isRealistic = requiredSGPA <= 10 && requiredSGPA > 0;

    return (
        <Card 
            className="h-full flex flex-col relative overflow-hidden group hover:shadow-card cursor-pointer transition-all duration-300 border border-gray-100 dark:border-gray-800"
            onClick={() => navigate('/academic-goals')}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none group-hover:bg-primary/10 transition-colors" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-bold text-text-primary dark:text-text-inverted flex items-center gap-2">
                    <GraduationCap size={20} className="text-primary" />
                    CGPA Tracker
                </h3>
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight size={16} />
                </div>
            </div>

            <div className="space-y-5 relative z-10">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Current CGPA</span>
                    <span className="text-lg font-bold text-text-primary dark:text-text-inverted">{current.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Target CGPA</span>
                    <span className="text-lg font-bold text-primary">{target.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">Required SGPA (Next)</span>
                    <span className="text-xl font-extrabold text-primary">{isRealistic ? requiredSGPA.toFixed(2) : '--'}</span>
                </div>
            </div>

            <div className="mt-auto pt-4 relative z-10 flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Next Semester Focus
            </div>
        </Card>
    );
}
