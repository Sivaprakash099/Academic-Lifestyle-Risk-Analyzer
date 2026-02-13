import React, { useEffect, useState } from 'react';
import riskService from '../services/riskService';
import { Lightbulb, CheckCircle, AlertTriangle, Info, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const Suggestions = () => {
    const [latestRisk, setLatestRisk] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRisk = async () => {
            try {
                const data = await riskService.getLatestRisk();
                setLatestRisk(data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRisk();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
        );
    }

    if (!latestRisk) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] p-4">
                <Card className="text-center max-w-lg w-full py-12">
                    <div className="mx-auto h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Lightbulb className="h-10 w-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">No Suggestions Yet</h2>
                    <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                        Submit your lifestyle data to receive personalized AI-driven academic advice.
                    </p>
                    <Link to="/input">
                        <Button variant="primary">Get Analyzed Now</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const getRiskColor = (level) => {
        if (level === 'High Risk') return 'border-danger bg-danger/10 text-danger';
        if (level === 'Medium Risk') return 'border-warning bg-warning/10 text-warning';
        return 'border-success bg-success/10 text-success';
    };

    const getIcon = (level) => {
        if (level === 'High Risk') return <AlertTriangle className="h-8 w-8" />;
        if (level === 'Medium Risk') return <Info className="h-8 w-8" />;
        return <CheckCircle className="h-8 w-8" />;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start mb-2">
                    <Lightbulb className="mr-3 text-warning h-8 w-8 animate-pulse-slow" />
                    Personalized Suggestions
                </h1>
                <p className="text-gray-400 ml-0 md:ml-11">
                    Analysis based on data from {new Date(latestRisk.createdAt).toLocaleDateString()}.
                </p>
            </div>

            <Card className={`p-8 mb-8 border-l-4 ${getRiskColor(latestRisk.riskLevel)} relative overflow-hidden backdrop-blur-xl`}>
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left relative z-10">
                    <div className="flex-shrink-0 p-4 rounded-full bg-white/10 mb-4 md:mb-0">
                        {getIcon(latestRisk.riskLevel)}
                    </div>
                    <div className="ml-0 md:ml-6">
                        <h3 className="text-xl font-bold text-white mb-2">Risk Assessment: {latestRisk.riskLevel}</h3>
                        <p className="text-gray-200 text-lg">
                            Calculated Risk Score: <span className="font-bold text-white text-2xl ml-2">{latestRisk.riskScore}/100</span>
                        </p>
                    </div>
                </div>
                {/* Background glow */}
                <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full mix-blend-overlay filter blur-3xl opacity-20 ${latestRisk.riskLevel === 'High Risk' ? 'bg-red-500' :
                        latestRisk.riskLevel === 'Medium Risk' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
            </Card>

            <div className="grid gap-6">
                {latestRisk.suggestions.map((suggestion, index) => (
                    <Card key={index} className="group hover:bg-white/10 transition-colors border-l-4 border-transparent hover:border-primary">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                                {index === 0 ? (
                                    <div className="bg-primary/20 p-2 rounded-full ring-1 ring-primary/50">
                                        <Lightbulb className="h-5 w-5 text-primary" />
                                    </div>
                                ) : (
                                    <div className="bg-white/10 p-2 rounded-full">
                                        <CheckCircle className="h-5 w-5 text-success" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-4">
                                <p className="text-lg text-gray-200 leading-relaxed font-medium group-hover:text-white transition-colors">
                                    {suggestion}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link to="/input">
                    <Button variant="outline" className="text-primary border-primary/50 hover:bg-primary/10">
                        Update Data & Get New Advice <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Suggestions;
