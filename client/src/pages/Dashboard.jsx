import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import SummaryCards from '../components/dashboard/SummaryCards';
import CGPACard from '../components/dashboard/CGPACard';
import MotivationCard from '../components/dashboard/MotivationCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { Bell, User, Menu } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const getSafeUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user')) || {};
    } catch (e) {
        return {};
    }
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};
import API from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const { openSidebar } = useOutletContext() || {};

    const [data, setData] = useState(() => ({
        user: getSafeUser(),
        stats: {
            studyHours: 0,
            sleepHours: 0,
            stressLevel: 'Not Assessed',
            attendance: 0,
        },
        cgpa: {},
        goals: {
            targetStudyHours: 0,
            targetSleepHours: 0,
            targetAttendance: 0
        },
        currentRisk: 0,
        history: []
    }));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = React.useCallback(async () => {
        try {
            const res = await API.get('dashboard');
            const result = res.data;

            setData({
                user: result.user || { name: 'Student' },
                stats: result.stats || {
                    studyHours: 0,
                    sleepHours: 0,
                    stressLevel: 'Not Assessed',
                    attendance: 0,
                },
                cgpa: result.cgpa || {
                    currentCGPA: 0,
                    targetCGPA: 0,
                    totalSemesters: 8,
                    completedSemesters: 0
                },
                goals: result.goals || {
                    targetStudyHours: 0,
                    targetSleepHours: 0,
                    targetAttendance: 0
                },
                currentRisk: result.currentRisk || 0,
                history: result.history || []
            });
        } catch (err) {
            console.error('Dashboard Error:', err);
            if (err.response?.status === 401) {
                navigate('/login');
                return;
            }
            setError(err.response?.data?.message || err.message);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleCGPAUpdate = React.useCallback(async (cgpaData) => {
        try {
            await API.put('dashboard/cgpa', cgpaData);
            fetchDashboardData();
        } catch (err) {
            console.error('Update failed:', err);
            toast.error('Failed to update CGPA');
        }
    }, [fetchDashboardData]);

    if (isLoading) {
        return <div className="flex h-[80vh] items-center justify-center"><Loader text="Loading your dashboard..." /></div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <p className="text-red-500 mb-4 font-medium">Error loading dashboard: {error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    const userName = data?.user?.name?.split(' ')[0] || 'Student';

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Top Section */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={openSidebar}
                        className="p-2 -ml-2 text-text-secondary hover:bg-gray-50 rounded-lg md:hidden transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-text-primary tracking-tight">Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-text-secondary hover:bg-gray-50 rounded-full transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User size={18} />
                        </div>
                        <span className="font-semibold text-sm text-text-primary hidden sm:block">
                            {userName}
                        </span>
                    </div>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#5b5bd6] to-[#7c3aed] p-10 rounded-2xl text-white shadow-soft relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
                        Hello, {userName}! <span className="animate-wave text-4xl drop-shadow-sm">👋</span>
                    </h2>
                    <p className="text-white/90 mt-3 text-lg max-w-xl font-medium tracking-wide">
                        Ready to optimize your academic journey? Here's your daily wellbeing overview.
                    </p>
                </div>
            </div>

            <motion.div variants={item}>
                {data.stats && <SummaryCards data={data.stats} />}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div variants={item} className="h-full">
                    <RiskScoreCard riskScore={data.currentRisk || 0} />
                </motion.div>

                <motion.div variants={item} className="h-full lg:col-span-1">
                    <MotivationCard riskScore={data.currentRisk || 0} />
                </motion.div>

                <motion.div variants={item} className="h-full">
                    <CGPACard 
                        cgpaData={data.cgpa} 
                        goalsData={data.goals}
                        statsData={data.stats}
                        onUpdate={handleCGPAUpdate} 
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}
