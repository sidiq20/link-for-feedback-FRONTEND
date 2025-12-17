import React from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';

const ExaminerQuestions = () => {
    return (
        <div className="flex flex-col gap-8 p-6 lg:p-10 w-full h-full">
             <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Question Bank</h1>
                 <button className="flex items-center gap-2 rounded-lg bg-examiner-primary px-4 py-2 text-sm font-bold text-white">
                    <BookOpen size={16} />
                    Add Question
                </button>
            </div>

             <div className="bg-card-dark rounded-xl border border-card-dark overflow-hidden flex flex-col flex-1 min-h-[400px]">
                 <div className="p-4 border-b border-card-dark flex gap-4">
                    <label className="flex flex-1 items-center gap-2 rounded-lg bg-[#111a22] px-4 py-2 ring-1 ring-transparent focus-within:ring-examiner-primary/50 transition-all">
                        <Search className="text-text-secondary" size={16} />
                        <input className="w-full bg-transparent text-sm text-white placeholder-text-secondary focus:outline-none" placeholder="Search questions..." type="text"/>
                    </label>
                    <button className="flex items-center gap-2 rounded-lg bg-[#111a22] px-4 py-2 text-white border border-card-dark hover:bg-card-dark">
                        <Filter size={16} /> Filter
                    </button>
                </div>
                
                <div className="flex-1 flex items-center justify-center text-text-secondary">
                    <div className="text-center">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Question bank integration coming soon.</p>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default ExaminerQuestions;
