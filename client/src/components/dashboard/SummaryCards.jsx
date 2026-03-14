import React from 'react';
import { BookOpen, Moon, Activity, CalendarCheck } from 'lucide-react';
import Card from '../ui/Card';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const dummyData = [
  { value: 40 }, { value: 30 }, { value: 45 }, { value: 50 }, { value: 65 }, { value: 60 }, { value: 80 }
];

const StatCard = ({ title, value, unit, icon: Icon, trend, trendText, isGraphReversed }) => {
    // We remove Recharts to perfectly match the clean requested SaaS style with trend text
    return (
        <Card className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-text-secondary font-medium text-sm mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-text-primary tracking-tight">
                        {value}
                        {unit && <span className="text-lg text-text-muted ml-1 font-medium">{unit}</span>}
                    </h3>
                </div>
                <div className="p-3 bg-gray-50 rounded-full text-text-secondary">
                    <Icon size={20} />
                </div>
            </div>

            {trend !== undefined && trendText && (
                <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${trend > 0 ? (isGraphReversed ? 'text-danger' : 'text-success') : (isGraphReversed ? 'text-success' : 'text-danger')}`}>
                        {trendText}
                    </span>
                </div>
            )}
        </Card>
    );
};

export default function SummaryCards({ data }) {
    // Determine display unit based on backend data (if missing, use defaults from prompt)
    const stats = [
        {
            title: 'Study Hours',
            value: data.studyHours || '0',
            unit: data.studyHours ? 'hrs' : 'hrs',
            icon: BookOpen,
            trend: 5,
            trendText: '(+5% vs last week)',
        },
        {
            title: 'Avg Sleep',
            value: data.sleepHours || '0',
            unit: data.sleepHours ? 'hrs' : 'hrs',
            icon: Moon,
            trend: undefined,
            trendText: '',
            isGraphReversed: true,
        },
        {
            title: 'Stress Level',
            value: data.stressLevel || 'Not Assessed',
            unit: '',
            icon: Activity,
        },
        {
            title: 'Attendance',
            value: data.attendance || '0',
            unit: data.attendance ? '%' : '%',
            icon: CalendarCheck,
            trend: undefined,
            trendText: '',
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
