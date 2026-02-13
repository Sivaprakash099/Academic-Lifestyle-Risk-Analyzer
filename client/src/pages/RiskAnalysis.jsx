import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Moon, Activity, CalendarCheck, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import Loader from '../components/ui/Loader';
import { toast } from 'react-hot-toast';
import API from '../services/api';

export default function RiskAnalysis() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const [formData, setFormData] = useState({
        studyHours: 4,
        sleepHours: 7,
        stressLevel: 'Low',
        attendance: 85,
        extracurricular: 'No',
        assignmentCompletion: 'Always',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateRisk = async () => {
        setIsAnalyzing(true);
        try {
            // Using centralized API service which handles token and baseURL
            const response = await API.post('/risk/analyze', formData);

            // Fetch the updated dashboard data to get the new risk score
            // The backend calculation updates the user's risk profile
            const dashResponse = await API.get('/dashboard');

            // Extract the current risk score from the dashboard response
            const currentRisk = dashResponse.data.currentRisk || 0; // Fallback to 0 if undefined

            setResult(currentRisk);
            setStep(2);

        } catch (error) {
            console.error(error);
            // Handle Axios error structure
            const message = error.response?.data?.message || error.message || "Analysis failed";
            toast.error(message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const stressOptions = [
        { value: 'Low', label: 'Low - I feel relaxed' },
        { value: 'Medium', label: 'Medium - Occasional stress' },
        { value: 'High', label: 'High - Frequently overwhelmed' },
    ];

    if (isAnalyzing) {
        return <div className="flex h-[60vh] items-center justify-center"><Loader text="Analyzing your lifestyle habits..." /></div>;
    }

    if (step === 2 && result !== null) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analysis Complete</h1>
                        <p className="text-gray-500 mt-1">Here is your updated risk profile based on your inputs.</p>
                    </div>
                    <Button variant="secondary" onClick={() => { setStep(1); setResult(null); }}>
                        New Analysis
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 h-full">
                        <RiskScoreCard riskScore={result} />
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-indigo-600" />
                                Input Summary
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50/50 rounded-2xl text-center">
                                    <BookOpen size={20} className="text-blue-500 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 font-medium uppercase">Study</p>
                                    <p className="text-lg font-bold text-blue-900">{formData.studyHours}h</p>
                                </div>
                                <div className="p-4 bg-indigo-50/50 rounded-2xl text-center">
                                    <Moon size={20} className="text-indigo-500 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 font-medium uppercase">Sleep</p>
                                    <p className="text-lg font-bold text-indigo-900">{formData.sleepHours}h</p>
                                </div>
                                <div className="p-4 bg-purple-50/50 rounded-2xl text-center">
                                    <Activity size={20} className="text-purple-500 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 font-medium uppercase">Stress</p>
                                    <p className="text-lg font-bold text-purple-900">{formData.stressLevel}</p>
                                </div>
                                <div className="p-4 bg-green-50/50 rounded-2xl text-center">
                                    <CalendarCheck size={20} className="text-green-500 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 font-medium uppercase">Attendance</p>
                                    <p className="text-lg font-bold text-green-900">{formData.attendance}%</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Key Recommendations</h3>
                            <ul className="space-y-4">
                                {result > 50 ? (
                                    <>
                                        <li className="flex gap-4 items-start">
                                            <div className="p-2 bg-red-100 rounded-lg text-red-600 flex-shrink-0">
                                                <AlertTriangle size={18} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Break Down Study Sessions</p>
                                                <p className="text-sm text-gray-600 mt-1">Long study hours without breaks can lead to burnout. Try the Pomodoro technique (25m work / 5m break).</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600 flex-shrink-0">
                                                <Moon size={18} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Prioritize Sleep Hygiene</p>
                                                <p className="text-sm text-gray-600 mt-1">Your sleep hours are critical for memory retention. Aim for consistent wake and sleep times.</p>
                                            </div>
                                        </li>
                                    </>
                                ) : (
                                    <li className="flex gap-4 items-start">
                                        <div className="p-2 bg-green-100 rounded-lg text-green-600 flex-shrink-0">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Maintain Your Routine</p>
                                            <p className="text-sm text-gray-600 mt-1">You're doing great! Keep up the balanced approach to study and rest.</p>
                                        </div>
                                    </li>
                                )}
                            </ul>
                            <div className="mt-8 pt-6 border-t border-indigo-100 flex justify-end">
                                <Button onClick={() => navigate('/dashboard')}>
                                    Go to Dashboard <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Lifestyle Pulse Check</h1>
                <p className="text-gray-500 text-lg">Update your current habits to get an accurate risk assessment.</p>
            </div>

            <Card className="shadow-xl shadow-indigo-100/50">
                <form className="space-y-8 p-2" onSubmit={(e) => { e.preventDefault(); calculateRisk(); }}>
                    {/* Sliders Section */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <BookOpen size={18} className="text-blue-500" /> Daily Study Hours
                                </label>
                                <span className="text-2xl font-bold text-blue-600">{formData.studyHours}h</span>
                            </div>
                            <input
                                type="range"
                                name="studyHours"
                                min="0" max="16" step="0.5"
                                value={formData.studyHours}
                                onChange={handleChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>0h</span>
                                <span>8h</span>
                                <span>16h+</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Moon size={18} className="text-indigo-500" /> Daily Sleep Hours
                                </label>
                                <span className="text-2xl font-bold text-indigo-600">{formData.sleepHours}h</span>
                            </div>
                            <input
                                type="range"
                                name="sleepHours"
                                min="0" max="12" step="0.5"
                                value={formData.sleepHours}
                                onChange={handleChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>0h</span>
                                <span>6h</span>
                                <span>12h+</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Current Stress Level"
                            name="stressLevel"
                            icon={Activity}
                            options={stressOptions}
                            value={formData.stressLevel}
                            onChange={handleChange}
                        />

                        <Input
                            label="Class Attendance (%)"
                            name="attendance"
                            type="number"
                            min="0" max="100"
                            icon={CalendarCheck}
                            value={formData.attendance}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-4 text-lg shadow-lg shadow-indigo-200"
                        size="lg"
                        isLoading={isAnalyzing}
                    >
                        Analyze My Risk
                    </Button>
                </form>
            </Card>
        </motion.div>
    );
}
