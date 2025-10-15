import React from 'react';
import { SendIcon, SpinnerIcon } from './icons';

interface QueryInputProps {
    query: string;
    setQuery: (query: string) => void;
    onSubmit: () => void;
    isDisabled: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ query, setQuery, onSubmit, isDisabled }) => {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isDisabled) {
                onSubmit();
            }
        }
    };

    return (
        <div className="relative">
            <textarea
                dir="auto"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about the PDF content..."
                className="w-full p-4 pr-16 text-gray-200 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow shadow-sm"
                rows={3}
                disabled={isDisabled}
            />
            <button
                onClick={onSubmit}
                disabled={isDisabled || !query.trim()}
                className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                aria-label="Submit question"
            >
                {isDisabled ? (
                    <SpinnerIcon className="w-5 h-5 animate-spin" />
                ) : (
                    <SendIcon className="w-5 h-5" />
                )}
            </button>
        </div>
    );
};

export default QueryInput;