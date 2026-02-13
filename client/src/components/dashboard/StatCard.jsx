import React from 'react';
import { Card } from '../ui/Card';

export const StatCard = ({ title, value, unit, icon: Icon, trend, color = 'indigo' }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <Card className="p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {value}
                    {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
                </h3>
                {trend && (
                    <p className={`text-xs mt-1 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {trend.value}
                    </p>
                )}
            </div>
        </Card>
    );
};
