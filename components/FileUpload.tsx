
import React, { useCallback, useState } from 'react';
import { UploadIcon, SpinnerIcon } from './icons';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);
    
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (e.dataTransfer.files[0].type === "application/pdf") {
                 onFileSelect(e.dataTransfer.files[0]);
            }
        }
    }, [onFileSelect]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-gray-800 transition-all duration-300
                ${isDragging ? 'border-indigo-500 scale-105' : 'border-gray-600 hover:border-gray-500'}`}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    {isLoading ? (
                        <>
                            <SpinnerIcon className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
                            <p className="mb-2 text-sm text-gray-400">Processing PDF...</p>
                            <p className="text-xs text-gray-500">This may take a moment</p>
                        </>
                    ) : (
                        <>
                            <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-400">
                                <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
