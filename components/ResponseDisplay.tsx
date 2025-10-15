import React from 'react';
import { SparklesIcon } from './icons';

interface ResponseDisplayProps {
    answer: string;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ answer }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold text-gray-200 flex items-center mb-4">
                <SparklesIcon className="w-6 h-6 mr-2 text-indigo-400" />
                Answer
            </h2>
            <div 
                dir="auto" 
                className="prose prose-invert prose-p:text-gray-300 prose-strong:text-gray-100 whitespace-pre-wrap leading-relaxed">
                {answer}
            </div>
        </div>
    );
};

export default ResponseDisplay;