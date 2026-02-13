import React from 'react';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Link } from 'react-router-dom';

export default function RecentAnalysis({ history = [] }) {
    const getRiskVariant = (score) => {
        if (score <= 30) return 'success';
        if (score <= 70) return 'warning';
        return 'danger';
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
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                            <div className="flex items-center gap-4">
                                <div className={`w-1.5 h-10 rounded-full ${item.riskScore > 70 ? 'bg-red-500' : item.riskScore > 30 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`} />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Risk Assessment</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                        <Clock size={10} /> {new Date(item.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge variant={getRiskVariant(item.riskScore)} className="mb-1">
                                    {item.riskScore}% Risk
                                </Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
