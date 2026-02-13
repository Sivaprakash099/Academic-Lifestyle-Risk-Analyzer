import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ProgressBar from '../ui/ProgressBar';
import { GraduationCap, Calculator, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CGPACard({ cgpaData = {}, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        currentCGPA: cgpaData.currentCGPA || '',
        targetCGPA: cgpaData.targetCGPA || '',
        completedSemesters: cgpaData.completedSemesters || '',
        totalSemesters: cgpaData.totalSemesters || 8,
    });

    const [isLoading, setIsLoading] = useState(false);

    const calculateRequiredGPA = () => {
        const current = Number(formData.currentCGPA);
        const target = Number(formData.targetCGPA);
        const completed = Number(formData.completedSemesters);
        const total = Number(formData.totalSemesters);

        if (!target || !total) return 0;

        const remaining = total - completed;
        if (remaining <= 0) return 0;

        const required = ((target * total) - (current * completed)) / remaining;
        return required.toFixed(2);
    };

    const requiredGPA = isEditing ? calculateRequiredGPA() :
        ((Number(cgpaData.targetCGPA || 0) * Number(cgpaData.totalSemesters || 0) - Number(cgpaData.currentCGPA || 0) * Number(cgpaData.completedSemesters || 0)) / (Number(cgpaData.totalSemesters || 1) - Number(cgpaData.completedSemesters || 0))).toFixed(2);

    const isRealistic = requiredGPA <= 10 && requiredGPA >= 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onUpdate(formData);
            setIsEditing(false);
            toast.success('CGPA Goals Updated');
        } catch (error) {
            toast.error('Failed to update CGPA');
        } finally {
            setIsLoading(false);
        }
    };

    if (isEditing) {
        return (
            <Card className="h-full border border-primary/10 shadow-lg animate-fade-in">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <Calculator size={20} className="text-primary" />
                        Adjust Goals
                    </h3>
                    <button onClick={() => setIsEditing(false)} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Current CGPA"
                            type="number" step="0.01" max="10"
                            value={formData.currentCGPA}
                            onChange={(e) => setFormData({ ...formData, currentCGPA: e.target.value })}
                            required
                        />
                        <Input
                            label="Target CGPA"
                            type="number" step="0.01" max="10"
                            value={formData.targetCGPA}
                            onChange={(e) => setFormData({ ...formData, targetCGPA: e.target.value })}
                            required
                        />
                        <Input
                            label="Semesters Done"
                            type="number" max="8"
                            value={formData.completedSemesters}
                            onChange={(e) => setFormData({ ...formData, completedSemesters: e.target.value })}
                            required
                        />
                        <Input
                            label="Total Semesters"
                            type="number" max="10"
                            value={formData.totalSemesters}
                            onChange={(e) => setFormData({ ...formData, totalSemesters: e.target.value })}
                            required
                        />
                    </div>
                    <div className="pt-2">
                        <Button type="submit" className="w-full" isLoading={isLoading}>Save Changes</Button>
                    </div>
                </form>
            </Card>
        );
    }

    const current = Number(cgpaData.currentCGPA || 0);
    const target = Number(cgpaData.targetCGPA || 10);
    const progress = (current / target) * 100;

    return (
        <Card className="h-full flex flex-col relative overflow-hidden group hover:shadow-card transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <GraduationCap size={20} className="text-primary" />
                    Academic Goal
                </h3>
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-lg text-text-muted hover:bg-primary/5 hover:text-primary transition-all active:scale-95"
                >
                    <Edit2 size={16} />
                </button>
            </div>

            <div className="mb-6 relative z-10">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-3xl font-bold text-text-primary">{current}</p>
                        <p className="text-xs text-text-secondary font-medium uppercase tracking-wide">Current CGPA</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-text-secondary">{target}</p>
                        <p className="text-xs text-text-muted font-medium uppercase tracking-wide">Target</p>
                    </div>
                </div>
                {/* Updated ProgressBar usage */}
                <ProgressBar progress={progress} color="primary" className="h-2.5" />
            </div>

            <div className="relative z-10 mt-auto">
                <div className="p-4 bg-light rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-text-secondary font-medium">Required Next Sem</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-xs ${isRealistic ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {requiredGPA > 0 && isFinite(requiredGPA) ? requiredGPA : '-'} GPA
                        </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                        {!isRealistic ? (
                            "Target seems ambitious. Consider revising or maximizing clear-all subjects."
                        ) : (
                            "You are on track! Maintain consistency in your core subjects to hit your target."
                        )}
                    </p>
                </div>
            </div>
        </Card>
    );
}
