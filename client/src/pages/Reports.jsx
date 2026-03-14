import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, RefreshCw, Download, Trash2 } from 'lucide-react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Reports() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showClearModal, setShowClearModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    
    const chartRef = useRef(null);
    const navigate = useNavigate();

    const fetchReports = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get('/reports');
            setData(res.data);
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
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleExport = React.useCallback(async () => {
        if (!data || data.riskHistory.length === 0) return;
        
        setIsExporting(true);
        const toastId = toast.loading("Preparing your report...");
        
        try {
            const chartElement = chartRef.current;
            const canvas = await html2canvas(chartElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const chartImage = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            
            pdf.setFontSize(22);
            pdf.setTextColor(79, 70, 229);
            pdf.text("Academic Risk Analysis Report", pageWidth / 2, 20, { align: 'center' });
            
            pdf.setFontSize(12);
            pdf.setTextColor(100, 116, 139);
            pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });

            pdf.setFontSize(16);
            pdf.setTextColor(30, 41, 59);
            pdf.text("Risk Trend Analysis", 20, 45);
            
            const imgWidth = 170;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(chartImage, 'PNG', 20, 50, imgWidth, imgHeight);

            let yPos = 50 + imgHeight + 20;
            
            pdf.setFontSize(16);
            pdf.text("Recent Analysis Records", 20, yPos);
            yPos += 10;

            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255);
            pdf.setFillColor(79, 70, 229);
            pdf.rect(20, yPos, 170, 8, 'F');
            
            pdf.text("Date", 22, yPos + 5);
            pdf.text("Study", 55, yPos + 5);
            pdf.text("Sleep", 75, yPos + 5);
            pdf.text("Stress", 95, yPos + 5);
            pdf.text("Attendance", 120, yPos + 5);
            pdf.text("Score", 155, yPos + 5);
            pdf.text("Level", 170, yPos + 5);
            
            yPos += 8;

            pdf.setTextColor(30, 41, 59);
            data.riskHistory.slice(0, 10).forEach((item, index) => {
                if (yPos > 270) {
                    pdf.addPage();
                    yPos = 20;
                }
                
                if (index % 2 === 0) {
                    pdf.setFillColor(248, 250, 252);
                    pdf.rect(20, yPos, 170, 8, 'F');
                }
                
                const dateStr = new Date(item.date).toLocaleDateString();
                pdf.text(dateStr, 22, yPos + 5);
                pdf.text(`${item.studyHours}h`, 55, yPos + 5);
                pdf.text(`${item.sleepHours}h`, 75, yPos + 5);
                pdf.text(item.stressLevel, 95, yPos + 5);
                pdf.text(`${item.attendance}%`, 120, yPos + 5);
                pdf.text(item.riskScore.toString(), 155, yPos + 5);
                pdf.text(item.riskLevel.split(' ')[0], 170, yPos + 5);
                
                yPos += 8;
            });

            pdf.setFontSize(8);
            pdf.setTextColor(148, 163, 184);
            pdf.text("Academic Lifestyle Risk Analyzer © 2026", pageWidth / 2, 285, { align: 'center' });

            pdf.save("Academic_Risk_Report.pdf");
            toast.success("Report downloaded successfully!", { id: toastId });
        } catch (err) {
            console.error("PDF Export Error:", err);
            toast.error("Failed to generate PDF.", { id: toastId });
        } finally {
            setIsExporting(false);
        }
    }, [data]);

    const handleClearHistory = React.useCallback(async () => {
        try {
            await API.delete('/reports/clear');
            toast.success("History cleared successfully", { icon: '🗑️' });
            setShowClearModal(false);
            fetchReports();
        } catch (err) {
            console.error("Clear History Error:", err);
            toast.error("Failed to clear history");
            setShowClearModal(false);
        }
    }, [fetchReports]);

    const handleRecalculate = React.useCallback(() => {
        navigate('/analyze-risk');
    }, [navigate]);

    // Reverse to show chronological order (Oldest -> Newest) in chart
    const chartData = React.useMemo(() => {
        if (!data || !data.riskHistory) return [];
        return [...data.riskHistory].reverse().map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: new Date(item.date).toLocaleDateString(),
            score: item.riskScore,
            level: item.riskLevel
        }));
    }, [data]);

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
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleExport}
                        isLoading={isExporting}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setShowClearModal(true)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear History
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                {/* 1. Risk Trend Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div ref={chartRef}>
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
                                            padding={{ left: 30, right: 30 }}
                                        />
                                        <YAxis
                                            domain={[0, 9]}
                                            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                                            dx={-10}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div style={{
                                                            backgroundColor: '#fff',
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                                            padding: '12px'
                                                        }}>
                                                            <p className="font-semibold text-text-primary mb-1">{label}</p>
                                                            <p className="text-primary font-medium">Risk Score: {data.score}</p>
                                                            <p className="text-text-secondary mt-1">
                                                                Risk Level: <span className="font-medium capitalize text-text-primary">{data.level}</span>
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
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
                    </div>
                </motion.div>
            </div>

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
