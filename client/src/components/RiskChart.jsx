import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const RiskChart = ({ riskScore }) => {
    const data = [
        {
            name: 'Risk Score',
            uv: riskScore,
            pv: 2400,
            fill: riskScore > 6 ? '#EF4444' : riskScore > 3 ? '#F59E0B' : '#10B981',
        },
        {
            name: 'Max Risk',
            uv: 9,
            pv: 4567,
            fill: '#E5E7EB',
        },
    ];

    const style = {
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        lineHeight: '24px',
    };

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={data}>
                    <RadialBar
                        minAngle={15}
                        label={{ position: 'insideStart', fill: '#fff' }}
                        background
                        clockWise
                        dataKey="uv"
                    />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
                    <Tooltip />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center mt-[-10px]">
                <span className={`text-2xl font-bold ${riskScore > 6 ? 'text-red-500' : riskScore > 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {riskScore}/9
                </span>
            </div>
        </div>
    );
};

export default RiskChart;
