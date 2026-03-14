import React from 'react';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Link } from 'react-router-dom';

export default function RecentAnalysis({ history = [] }) {
    const getRiskVariant = (level) => {
        if (!level) return 'success';
        if (level.includes('Very High')) return 'danger';
        if (level.includes('High')) return 'danger';
        if (level.includes('Medium')) return 'warning';
        return 'success';
    };

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Recent Analysis</h3>
                <Link to="/reports" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 transition-colors">
                    View All <ArrowRight size={16} />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <Calendar size={32} className="mb-2 opacity-50" />
                        <p>No analysis history yet.</p>
                    </div>
                ) : (
                    history.slice(0, 5).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-lighter hover:shadow-soft transition-all group">
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="font-semibold text-text-primary text-sm">{item.riskLevel || 'Risk Assessment'}</p>
                                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5 font-medium tracking-wide">
                                        <Clock size={12} className="opacity-70" /> {new Date(item.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge variant={getRiskVariant(item.riskLevel)} className="shadow-sm">
                                    Score: {item.riskScore}
                                </Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
