import React from 'react';
import { Settings, Bell, Lock, Database } from 'lucide-react';

const ExaminerSettings = () => {
    return (
        <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-4xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Settings /> Examiner Settings
            </h1>
            
            <div className="space-y-6">
                <div className="bg-card-dark rounded-xl border border-card-dark p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Database size={20} /> Exam Defaults
                    </h3>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Default Duration (mins)</span>
                            <span className="text-white font-mono bg-[#111a22] px-3 py-1 rounded">60</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Auto-Publish Results</span>
                            <div className="w-12 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExaminerSettings;
