import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import SummaryCards from '../components/dashboard/SummaryCards';
import RecentAnalysis from '../components/dashboard/RecentAnalysis';
import CGPACard from '../components/dashboard/CGPACard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();

    const getSafeUser = () => {
        try {
            return JSON.parse(localStorage.getItem('user')) || {};
        } catch (e) {
            return {};
        }
    };

    const [data, setData] = useState({
        user: getSafeUser(),
        stats: {
            studyHours: 0,
            sleepHours: 0,
            stressLevel: 'Not Assessed',
            attendance: 0,
        },
        cgpa: {},
        currentRisk: 0,
        history: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('/api/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const result = await response.json();

            setData({
                user: result.user || { name: 'Student' },
                stats: result.stats || data.stats,
                cgpa: result.cgpa || {},
                currentRisk: result.currentRisk || 0,
                history: result.history || []
            });
        } catch (err) {
            console.error('Dashboard Error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [navigate]);

    const handleCGPAUpdate = async (cgpaData) => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/dashboard/cgpa', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cgpaData)
        });

        if (response.ok) {
            fetchDashboardData();
        } else {
            throw new Error('Update failed');
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
            {/* Welcome Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        Hello, {userName}! <span className="animate-wave text-4xl">👋</span>
                    </h1>
                    <p className="text-indigo-100 mt-2 text-lg max-w-xl">
                        Ready to optimize your academic journey? Here's your daily wellbeing overview.
                    </p>
                </div>
                <div></div>
            </div>

            <motion.div variants={item}>
                {data.stats && <SummaryCards data={data.stats} />}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div variants={item} className="lg:col-span-1 h-full">
                    <RiskScoreCard riskScore={data.currentRisk || 0} />
                </motion.div>

                <motion.div variants={item} className="lg:col-span-1 h-full">
                    <CGPACard cgpaData={data.cgpa} onUpdate={handleCGPAUpdate} />
                </motion.div>

                <motion.div variants={item} className="lg:col-span-1 h-full">
                    <RecentAnalysis history={data.history || []} />
                </motion.div>
            </div>
        </motion.div>
    );
}
