import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Moon, Activity, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Download, RotateCcw, Trash2, Eye } from 'lucide-react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal'; // Use the new Modal component
import { toast } from 'react-hot-toast';

export default function Reports() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showClearModal, setShowClearModal] = useState(false);
    const navigate = useNavigate();

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get('/reports');
            setData(res.data);
            if (res.data.riskHistory.length > 0) {
                // Optional: toast success
            }
        } catch (err) {
            console.error("Reports Fetch Error:", err);
            if (err.response && err.response.status === 401) {
                setError("Session expired. Please login again.");
            } else {
                setError(err.response?.data?.message || err.message || "Failed to fetch reports");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleExport = () => {
        toast.success("Report downloaded successfully (Demo)", { icon: '📥' });
    };

    const handleClearHistory = () => {
        setShowClearModal(false);
        // Implement API call here to clear history
        toast.success("History cleared successfully (Demo)", { icon: '🗑️' });
    };

    const handleRecalculate = () => {
        navigate('/analysis');
    };

    const handleDetailedAnalysis = () => {
        toast.success("Detailed analysis view coming soon!", { icon: '📊' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-light">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary font-medium animate-pulse">Generating insights...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-light p-4">
                <Card className="max-w-md w-full border-danger/20 text-center">
                    <div className="bg-danger/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="h-10 w-10 text-danger" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Error Loading Reports</h3>
                    <p className="text-text-secondary mb-6">{error}</p>

                    <div className="flex gap-4 justify-center">
                        <Button onClick={fetchReports} variant="primary">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                        {error.includes("Session") && (
                            <Button onClick={() => navigate('/login')} variant="secondary">
                                Login
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        );
    }

    if (!data || data.riskHistory.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-6 min-h-[80vh]"
            >
                <div className="bg-primary/10 p-6 rounded-full mb-6">
                    <TrendingUp className="h-16 w-16 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-3">No Reports Available Yet</h2>
                <p className="text-text-secondary max-w-md mb-8 text-center">
                    Complete your first risk analysis to unlock detailed academic and lifestyle insights.
                </p>
                <Button onClick={handleRecalculate} size="lg">
                    Start Analysis
                </Button>
            </motion.div>
        );
    }

    // Reverse to show chronological order (Oldest -> Newest) in chart
    const chartData = [...data.riskHistory].reverse().map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: new Date(item.date).toLocaleDateString(),
        score: item.riskScore,
        level: item.riskLevel
    }));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 animate-fade-in"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-primary">
                        Analytics & Reports
                    </h1>
                    <p className="text-text-secondary mt-2 text-lg">Detailed insights into your academic journey.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" size="sm" onClick={fetchReports}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setShowClearModal(true)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear History
                    </Button>
                </div>
            </div>

            {/* 1. Risk Trend Section */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-t-4 border-t-primary">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-xl font-bold flex items-center text-text-primary">
                                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                                Risk Trend Analysis
                            </h2>
                            <p className="text-sm text-text-muted mt-1 ml-10">Track your risk score variations over time.</p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="success">Low</Badge>
                            <Badge variant="warning">Medium</Badge>
                            <Badge variant="danger">High</Badge>
                        </div>
                    </div>

                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                                    dy={15}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                    cursor={{ stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#4F46E5"
                                    strokeWidth={3}
                                    dot={{ fill: '#fff', strokeWidth: 2, r: 4, stroke: '#4F46E5' }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#4F46E5' }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2. Academic Performance Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <Card className="h-full flex flex-col justify-between border-t-4 border-t-blue-500">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-bold flex items-center text-text-primary">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Academic Status
                                </h2>
                                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                                    Edit Goal
                                </Button>
                            </div>

                            {data.cgpa.targetCGPA > 0 ? (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Current</p>
                                            <div className="flex items-baseline">
                                                <p className="text-5xl font-extrabold text-text-primary">{data.cgpa.currentCGPA}</p>
                                                <span className="text-text-muted ml-2 font-medium">/ 10</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Target</p>
                                            <div className="bg-blue-50 px-4 py-2 rounded-xl inline-block">
                                                <p className="text-2xl font-bold text-blue-600">{data.cgpa.targetCGPA}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold text-text-muted">
                                            <span>Progress to Goal</span>
                                            <span>{Math.min((data.cgpa.currentCGPA / data.cgpa.targetCGPA) * 100, 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((data.cgpa.currentCGPA / data.cgpa.targetCGPA) * 100, 100)}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                                            ></motion.div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                                            {data.cgpa.currentCGPA >= data.cgpa.targetCGPA
                                                ? "You've exceeded your target! Consider setting a higher goal to maintain momentum."
                                                : `Gap to target: ${(data.cgpa.targetCGPA - data.cgpa.currentCGPA).toFixed(2)}. Maintain high attendance and study hours to close this gap.`}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                                        <BookOpen className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-text-secondary font-medium mb-4">No GPA data available</p>
                                    <Button variant="outline" onClick={() => navigate('/dashboard')}>
                                        Set Goal
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* 3. Lifestyle Summary Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="h-full border-t-4 border-t-purple-500">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-bold flex items-center text-text-primary">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <Activity className="w-5 h-5 text-purple-600" />
                                </div>
                                Lifestyle Avg.
                            </h2>
                            <Button variant="ghost" size="sm" onClick={handleDetailedAnalysis}>
                                <Eye className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100 rounded-2xl hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                        <BookOpen className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <span className="text-sm font-semibold text-text-secondary">Study</span>
                                </div>
                                <p className="text-3xl font-bold text-text-primary mt-2">{data.averages.studyHours}<span className="text-sm font-normal text-text-muted ml-1">hrs</span></p>
                            </div>

                            <div className="p-5 bg-gradient-to-br from-purple-50/50 to-white border border-purple-100 rounded-2xl hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                        <Moon className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <span className="text-sm font-semibold text-text-secondary">Sleep</span>
                                </div>
                                <p className="text-3xl font-bold text-text-primary mt-2">{data.averages.sleepHours}<span className="text-sm font-normal text-text-muted ml-1">hrs</span></p>
                            </div>

                            <div className="col-span-1 sm:col-span-2 p-5 bg-gradient-to-br from-green-50/50 to-white border border-green-100 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        </div>
                                        <span className="text-sm font-semibold text-text-secondary">Attendance</span>
                                    </div>
                                    <p className="text-3xl font-bold text-text-primary mt-1">{data.averages.attendance}<span className="text-sm font-normal text-text-muted ml-1">%</span></p>
                                </div>

                                <div className="h-14 w-14 relative">
                                    <svg className="transform -rotate-90 w-full h-full">
                                        <circle cx="28" cy="28" r="24" stroke="#E5E7EB" strokeWidth="4" fill="none" />
                                        <circle cx="28" cy="28" r="24" stroke="#10B981" strokeWidth="4" fill="none" strokeDasharray={150} strokeDashoffset={150 - (150 * data.averages.attendance) / 100} />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <Button variant="outline" className="w-full" onClick={handleRecalculate}>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Recalculate Risk
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Clear History Modal */}
            <Modal
                isOpen={showClearModal}
                onClose={() => setShowClearModal(false)}
                title="Clear History?"
            >
                <div className="space-y-4">
                    <p className="text-text-secondary">
                        Are you sure you want to delete all past risk analysis reports? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={() => setShowClearModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleClearHistory}>Yes, Delete All</Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
