import React from 'react';
import { Users, Search, MoreVertical } from 'lucide-react';

const ExaminerStudents = () => {
    return (
        <div className="flex flex-col gap-8 p-6 lg:p-10 w-full h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Students</h1>
                <button className="flex items-center gap-2 rounded-lg bg-examiner-primary px-4 py-2 text-sm font-bold text-white">
                    <Users size={16} />
                    Add Student
                </button>
            </div>

             <div className="bg-card-dark rounded-xl border border-card-dark overflow-hidden flex flex-col flex-1 min-h-[400px]">
                <div className="p-4 border-b border-card-dark">
                    <label className="flex items-center gap-2 rounded-lg bg-[#111a22] px-4 py-2 ring-1 ring-transparent focus-within:ring-examiner-primary/50 transition-all max-w-sm">
                        <Search className="text-text-secondary" size={16} />
                        <input className="w-full bg-transparent text-sm text-white placeholder-text-secondary focus:outline-none" placeholder="Search students..." type="text"/>
                    </label>
                </div>
                
                <div className="flex-1 flex items-center justify-center text-text-secondary">
                    <div className="text-center">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Student list integration coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExaminerStudents;
