import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, Download, Trash2, History } from 'lucide-react';
import API from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { toast } from 'react-hot-toast';

export default function AnalysisHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showClearModal, setShowClearModal] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get('/reports');
            // Support both keys for maximum compatibility
            const historyData = res.data.analysis || res.data.riskHistory || [];
            setHistory(historyData);
        } catch (err) {
            console.error("History Fetch Error:", err);
            setError(err.response?.data?.message || err.message || "Failed to fetch history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleExport = () => {
        toast.success("Analysis history exported successfully (Demo)", { icon: '📥' });
    };

    const handleClearHistory = async () => {
        try {
            await API.delete('/reports/clear');
            toast.success("History cleared successfully", { icon: '🗑️' });
            setHistory([]);
            setShowClearModal(false);
        } catch (err) {
            console.error("Clear History Error:", err);
            toast.error("Failed to clear history");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mx-auto"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <History className="text-primary" />
                        Detailed Analysis History
                    </h1>
                    <p className="text-text-secondary mt-1">Review your past risk assessment records.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={fetchHistory}>
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

            <Card className="overflow-hidden p-0 shadow-soft">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-dark-light text-text-muted text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-4 py-4">Study Hours</th>
                                <th className="px-4 py-4">Sleep Hours</th>
                                <th className="px-4 py-4">Stress Level</th>
                                <th className="px-4 py-4">Attendance (%)</th>
                                <th className="px-4 py-4 text-center">Risk Score</th>
                                <th className="px-6 py-4 text-right">Risk Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {history.length > 0 ? (
                                history.map((report, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-dark/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-text-primary dark:text-text-inverted">
                                                {new Date(report.createdAt || report.date).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-text-muted">
                                                {new Date(report.createdAt || report.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-text-secondary">{report.studyHours || 0} hrs</td>
                                        <td className="px-4 py-4 text-sm font-medium text-text-secondary">{report.sleepHours || 0} hrs</td>
                                        <td className="px-4 py-4">
                                            <Badge variant={report.stressLevel === 'High' ? 'danger' : report.stressLevel === 'Medium' ? 'warning' : 'success'} size="sm">
                                                {report.stressLevel || 'Low'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-text-secondary">{report.attendance || 0} %</td>
                                        <td className="px-4 py-4 text-center font-bold text-text-primary dark:text-text-inverted">{report.riskScore !== undefined ? report.riskScore : 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Badge variant={report.riskLevel === 'High Risk' ? 'danger' : report.riskLevel === 'Medium Risk' ? 'warning' : 'success'}>
                                                {report.riskLevel || 'Low Risk'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-text-secondary">
                                        No analysis history available. Perform a risk analysis to see results.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

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
