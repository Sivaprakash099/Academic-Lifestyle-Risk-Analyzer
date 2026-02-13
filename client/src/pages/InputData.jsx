import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lifestyleService from '../services/lifestyleService';
import riskService from '../services/riskService';
import { Save, Activity, Clock, Moon, Monitor, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';

const InputData = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        studyHours: '',
        sleepHours: '',
        stressLevel: 'Low',
        screenTime: '',
        activityLevel: 'Moderate',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const lifestyle = await lifestyleService.addLifestyle(formData);
            await riskService.analyzeRisk(lifestyle._id);

            toast.success('Data submitted & analyzed!', {
                icon: '📊',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });

            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in p-4">
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>

                <div className="mb-8 border-b border-white/10 pb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center mb-2">
                        <Activity className="mr-3 text-primary h-6 w-6" />
                        Daily Lifestyle Entry
                    </h2>
                    <p className="text-gray-400">Track your habits to analyze academic risk.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                        {/* Study Hours */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Study Hours (Daily)
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="number"
                                    name="studyHours"
                                    required
                                    min="0"
                                    max="24"
                                    className="glass-input w-full pl-10"
                                    placeholder="e.g. 4"
                                    value={formData.studyHours}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Sleep Hours */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sleep Hours (Daily)
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Moon className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="number"
                                    name="sleepHours"
                                    required
                                    min="0"
                                    max="24"
                                    className="glass-input w-full pl-10"
                                    placeholder="e.g. 7"
                                    value={formData.sleepHours}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Stress Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Stress Level
                            </label>
                            <select
                                name="stressLevel"
                                className="glass-input w-full appearance-none text-white bg-slate-800"
                                value={formData.stressLevel}
                                onChange={handleChange}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        {/* Screen Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Screen Time (Hours)
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Monitor className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="number"
                                    name="screenTime"
                                    required
                                    min="0"
                                    max="24"
                                    className="glass-input w-full pl-10"
                                    placeholder="e.g. 5"
                                    value={formData.screenTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Activity Level */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Physical Activity Level
                            </label>
                            <select
                                name="activityLevel"
                                className="glass-input w-full appearance-none text-white bg-slate-800"
                                value={formData.activityLevel}
                                onChange={handleChange}
                            >
                                <option value="None">None (Sedentary)</option>
                                <option value="Low">Low (Light walking)</option>
                                <option value="Moderate">Moderate (Exercise 3x/week)</option>
                                <option value="High">High (Daily exercise)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-end">
                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full sm:w-auto text-lg px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        >
                            <Save className="mr-2 h-5 w-5" />
                            Submit & Analyze
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default InputData;
