import React from 'react';
import { BookOpen, Moon, Activity, CalendarCheck } from 'lucide-react';
import Card from '../ui/Card';

const StatCard = ({ title, value, unit, icon: Icon, colorClass, trend }) => (
    <Card className="flex items-center justify-between hover:shadow-card transition-all duration-300 border border-gray-100 group">
        <div>
            <p className="text-sm font-medium text-text-secondary mb-1 group-hover:text-primary transition-colors">{title}</p>
            <div className="flex items-baseline gap-1">
                <h4 className="text-2xl font-bold text-text-primary">{value}</h4>
                <span className="text-sm font-medium text-text-muted">{unit}</span>
            </div>
            {trend && (
                <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${trend > 0 ? 'text-success' : 'text-danger'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                    <span className="text-text-muted font-normal">vs last week</span>
                </p>
            )}
        </div>
        <div className={`p-3 rounded-2xl ${colorClass}`}>
            <Icon size={24} />
        </div>
    </Card>
);

export default function SummaryCards({ data }) {
    const stats = [
        {
            title: 'Study Hours',
            value: data.studyHours || 0,
            unit: 'hrs',
            icon: BookOpen,
            colorClass: 'bg-blue-50 text-blue-600',
            trend: 5
        },
        {
            title: 'Avg. Sleep',
            value: data.sleepHours || 0,
            unit: 'hrs',
            icon: Moon,
            colorClass: 'bg-indigo-50 text-indigo-600',
            trend: -2
        },
        {
            title: 'Stress Level',
            value: data.stressLevel || 'N/A',
            unit: '',
            icon: Activity,
            colorClass: 'bg-purple-50 text-purple-600',
        },
        {
            title: 'Attendance',
            value: data.attendance || 0,
            unit: '%',
            icon: CalendarCheck,
            colorClass: 'bg-green-50 text-green-600',
            trend: 12
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
            ))}
        </div>
    );
}
