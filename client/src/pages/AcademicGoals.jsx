import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Save, CheckCircle, AlertTriangle, ArrowUpRight, Calculator, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Loader from '../components/ui/Loader';
import { toast } from 'react-hot-toast';
import API from '../services/api';

export default function AcademicGoals() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState({
        cgpa: { currentCGPA: 0, targetCGPA: 0, totalSemesters: 8, completedSemesters: 0 }
    });

    const [formGoals, setFormGoals] = useState({
        currentCGPA: 0,
        targetCGPA: 0,
        totalSemesters: 8,
        completedSemesters: 0
    });

    const [calculation, setCalculation] = useState(null);

    const calculateRequiredGPA = React.useCallback((goals) => {
        const current = parseFloat(goals.currentCGPA);
        const target = parseFloat(goals.targetCGPA);
        const completed = parseInt(goals.completedSemesters);

        if (!target) {
            setCalculation(null);
            return;
        }

        if (target < current) {
            setCalculation({ error: "Target CGPA cannot be lower than current CGPA" });
            return;
        }

        if (current < 0 || current > 10 || target < 0 || target > 10) {
            setCalculation({ error: "CGPA values must be between 0 and 10" });
            return;
        }

        const requiredSGPA = (target * (completed + 1)) - (current * completed);
        
        let colorClass = 'text-success';
        let barVariant = 'success';

        if (requiredSGPA > 9) {
            colorClass = 'text-danger';
            barVariant = 'danger';
        } else if (requiredSGPA > 8) {
            colorClass = 'text-amber-500';
            barVariant = 'warning';
        }

        setCalculation({
            required: requiredSGPA.toFixed(2),
            isAchievable: requiredSGPA <= 10,
            colorClass,
            barVariant,
            progress: target > 0 ? Math.min((current/target)*100, 100) : 0
        });
    }, []);

    const fetchData = React.useCallback(async () => {
        try {
            const response = await API.get('/dashboard');
            setData(response.data);
            const goals = {
                currentCGPA: response.data.cgpa.currentCGPA || 0,
                targetCGPA: response.data.cgpa.targetCGPA || 0,
                totalSemesters: response.data.cgpa.totalSemesters || 8,
                completedSemesters: response.data.cgpa.completedSemesters || 0
            };
            setFormGoals(goals);
            calculateRequiredGPA(goals);
        } catch (error) {
            toast.error("Failed to load goals data");
        } finally {
            setIsLoading(false);
        }
    }, [calculateRequiredGPA]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFormChange = React.useCallback((updates) => {
        setFormGoals(prev => {
            const newGoals = { ...prev, ...updates };
            calculateRequiredGPA(newGoals);
            return newGoals;
        });
    }, [calculateRequiredGPA]);

    const handleSave = React.useCallback(async (e) => {
        e.preventDefault();
        
        if (calculation?.error) {
            toast.error(calculation.error);
            return;
        }

        setIsSaving(true);
        try {
            await API.put('/dashboard/cgpa', {
                currentCGPA: parseFloat(formGoals.currentCGPA),
                targetCGPA: parseFloat(formGoals.targetCGPA),
                totalSemesters: parseInt(formGoals.totalSemesters),
                completedSemesters: parseInt(formGoals.completedSemesters)
            });

            toast.success("Academic goals updated successfully!");
            fetchData();
        } catch (error) {
            toast.error("Failed to save goals");
        } finally {
            setIsSaving(false);
        }
    }, [calculation?.error, formGoals, fetchData]);

    if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Loader text="Loading your academic goals..." /></div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
                    <Target className="text-primary" size={32} /> Academic Goals
                </h1>
                <p className="text-text-secondary mt-1">Calculate the SGPA you need in the next semester to stay on track for your target CGPA.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Goal Setting Form */}
                <Card className="h-fit">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Calculator size={20} className="text-primary" /> Goal Settings
                    </h3>
                    <form onSubmit={handleSave} className="space-y-5">
                        <Input
                            label="Current CGPA"
                            type="number" step="0.01" min="0" max="10"
                            value={formGoals.currentCGPA}
                            onChange={(e) => handleFormChange({ currentCGPA: e.target.value })}
                        />
                        <Input
                            label="Target CGPA"
                            type="number" step="0.01" min="0" max="10"
                            value={formGoals.targetCGPA}
                            onChange={(e) => handleFormChange({ targetCGPA: e.target.value })}
                        />
                        <Input
                            label="Semesters Completed"
                            type="number" min="0" max="10"
                            value={formGoals.completedSemesters}
                            onChange={(e) => handleFormChange({ completedSemesters: e.target.value })}
                        />
                        <Input
                            label="Total Number of Semesters"
                            type="number" min="1" max="10"
                            value={formGoals.totalSemesters}
                            onChange={(e) => handleFormChange({ totalSemesters: e.target.value })}
                        />

                        <Button type="submit" className="w-full" isLoading={isSaving} icon={Calculator}>
                            Save Changes
                        </Button>
                    </form>
                </Card>

                {/* Results logic */}
                <div className="space-y-6">
                    {calculation ? (
                        calculation.error ? (
                            <Card className="border-l-4 border-danger bg-danger/5">
                                <div className="flex items-start gap-3 text-danger">
                                    <AlertTriangle size={20} className="flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold mb-1">Validation Error</h4>
                                        <p className="text-sm">{calculation.error}</p>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className={`border-l-4 ${calculation.isAchievable ? 'border-primary' : 'border-danger'} bg-gradient-to-br from-white to-gray-50 dark:from-dark-lighter dark:to-dark shadow-lg`}>
                                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-6 text-primary">
                                    Next Semester Requirement
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-y-4">
                                        <div>
                                            <p className="text-xs text-text-muted font-bold uppercase">Current CGPA</p>
                                            <p className="text-xl font-bold text-text-primary">{formGoals.currentCGPA}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted font-bold uppercase">Target CGPA</p>
                                            <p className="text-xl font-bold text-primary">{formGoals.targetCGPA}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-text-muted font-bold uppercase">Completed Semesters</p>
                                            <p className="text-xl font-bold text-text-primary">{formGoals.completedSemesters}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-100 dark:bg-dark border border-gray-200 dark:border-gray-800">
                                        <p className="text-xs text-text-muted font-bold uppercase mb-1">Required SGPA in Next Semester</p>
                                        <p className={`text-4xl font-extrabold ${calculation.colorClass}`}>
                                            <strong>{calculation.required}</strong>
                                        </p>
                                    </div>

                                    <div className={`flex items-start gap-3 p-4 rounded-xl ${calculation.isAchievable ? 'bg-primary/5 text-text-primary border border-primary/10' : 'bg-danger/5 text-danger border border-danger/10'}`}>
                                        {calculation.isAchievable ? <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-primary" /> : <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />}
                                        <p className="text-sm font-medium leading-relaxed">
                                            {calculation.isAchievable ? (
                                                <>You need SGPA <strong>{calculation.required}</strong> in the next semester to reach your target CGPA.</>
                                            ) : (
                                                <>Target CGPA <strong>cannot be reached</strong> in the next semester.</>
                                            )}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs font-bold uppercase">
                                            <span className="text-text-muted">Target Progress</span>
                                            <span className="text-primary">{Math.round(calculation.progress)}%</span>
                                        </div>
                                        <ProgressBar 
                                            progress={calculation.progress} 
                                            variant={calculation.barVariant}
                                            className="h-2.5 shadow-inner"
                                        />
                                    </div>
                                </div>
                            </Card>
                        )
                    ) : (
                        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-gray-200 dark:border-gray-800">
                            <div className="p-4 bg-gray-50 dark:bg-dark rounded-full mb-4">
                                <Info size={32} className="text-text-muted" />
                            </div>
                            <h4 className="font-bold text-text-primary mb-2">Enter your goals</h4>
                            <p className="text-sm text-text-secondary">Fill in the planning form to see your required GPA and progress analytics.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
