import React, { useState, useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import { QUOTES, RISK_MESSAGES } from '../../constants/quotes.const';

export default function MotivationCard({ riskScore = 0 }) {
    const [quoteData, setQuoteData] = useState({ quote: '', message: '' });

    useEffect(() => {
        const getRiskLevel = (score) => {
            if (score >= 7) return 'HIGH_RISK';
            if (score >= 4) return 'MEDIUM_RISK';
            return 'LOW_RISK';
        };

        const riskLevel = getRiskLevel(riskScore);
        const categoryQuotes = QUOTES[riskLevel];
        const riskMessage = RISK_MESSAGES[riskLevel];

        // Repetition prevention logic using sessionStorage
        const lastQuoteKey = `last_quote_${riskLevel}`;
        const lastQuote = sessionStorage.getItem(lastQuoteKey);

        let availableQuotes = categoryQuotes;
        if (categoryQuotes.length > 1 && lastQuote) {
            availableQuotes = categoryQuotes.filter(q => q !== lastQuote);
        }

        const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
        
        sessionStorage.setItem(lastQuoteKey, randomQuote);
        setQuoteData({ quote: randomQuote, message: riskMessage });
    }, [riskScore]);

    return (
        <Card className="h-full flex flex-col relative overflow-hidden group hover:shadow-card transition-all duration-300 border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-dark-lighter dark:to-dark">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-bold text-text-primary dark:text-text-inverted flex items-center gap-2">
                    <Sparkles size={20} className="text-primary animate-pulse" />
                    Daily Motivation
                </h3>
                <Quote size={24} className="text-primary/20 group-hover:text-primary/40 transition-colors" />
            </div>

            <div className="flex-grow flex flex-col justify-center relative z-10 py-4">
                <p className="text-xl font-medium text-text-primary dark:text-text-inverted leading-relaxed italic mb-6">
                    "{quoteData.quote}"
                </p>
                
                <div className="mt-auto p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        A Personal Note for You
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        {quoteData.message}
                    </p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                Updated Just Now
            </div>
        </Card>
    );
}
