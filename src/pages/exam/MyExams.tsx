import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ExamPortalAPI } from '../../services/api';
import {
  Search,
  BookOpen,
  Clock,
  Users,
  MoreHorizontal,
  ArrowRight,
  Play,
  CheckCircle,
  FileText
} from 'lucide-react';

interface Exam {
  exam_id: string;
  title: string;
  description?: string;
  start_time?: string;
  duration?: number;
  question_count?: number;
  status: 'upcoming' | 'registered' | 'completed';
  student_id?: string;
  completed?: boolean;
}

const MyExams = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['my-exams'],
    queryFn: async () => {
      // Fetch dashboard data which contains registered/upcoming exams
      // Or use ExamRegistrationAPI.list() if appropriate. 
      // Sticking to dashboard as per previous implementation for now.
      const response = await ExamPortalAPI.dashboard();
      const d = response.data;
      const allExams: Exam[] = [
        ...(d.registered || []).map((e: any) => ({ ...e, status: 'registered' })),
        ...(d.upcoming || []).map((e: any) => ({ ...e, status: 'upcoming' })),
        ...(d.completed || []).map((e: any) => ({ ...e, status: 'completed', completed: true })) 
      ];
      return allExams;
    }
  });

  const filteredExams = data?.filter((exam) => {
    const matchesSearch = exam.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'completed' ? exam.completed :
      !exam.completed; // 'upcoming' implies not completed
    
    return matchesSearch && matchesFilter;
  }) || [];

  const getStatusBadge = (exam: Exam) => {
    if (exam.completed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400">
           <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
           Closed
        </span>
      );
    }
    const isUpcoming = exam.start_time && new Date(exam.start_time) > new Date();
    if (isUpcoming) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
               <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
               Scheduled
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
           Active
        </span>
    );
  };

  if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary"></div>
        </div>
      );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">My Exams</h1>
            <p className="text-slate-500 dark:text-text-secondary">View and participate in your scheduled examinations</p>
          </div>
          <button 
            onClick={() => navigate('/exam/register')}
            className="flex items-center justify-center gap-2 bg-student-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <BookOpen size={20} />
            <span>Browse Catalog</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-slate-100 dark:border-card-dark">
            {/* Search Bar */}
            <div className="w-full lg:w-96 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-slate-400 dark:text-text-secondary group-focus-within:text-student-primary transition-colors" size={20} />
                </div>
                <input 
                    type="text"
                    placeholder="Search exams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-student-primary/50 sm:text-sm transition-all"
                />
            </div>
            
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-900 dark:bg-white text-white dark:text-background-dark shadow-sm' : 'bg-slate-100 dark:bg-[#111a22] text-slate-600 dark:text-text-secondary hover:bg-slate-200 dark:hover:bg-[#1c2a38]'}`}
                >
                    All Status
                </button>
                <button 
                   onClick={() => setFilter('upcoming')}
                   className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'upcoming' ? 'bg-slate-900 dark:bg-white text-white dark:text-background-dark shadow-sm' : 'bg-slate-100 dark:bg-[#111a22] text-slate-600 dark:text-text-secondary hover:bg-slate-200 dark:hover:bg-[#1c2a38]'}`}
                >
                    Upcoming
                </button>
                 <button 
                   onClick={() => setFilter('completed')}
                   className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-slate-900 dark:bg-white text-white dark:text-background-dark shadow-sm' : 'bg-slate-100 dark:bg-[#111a22] text-slate-600 dark:text-text-secondary hover:bg-slate-200 dark:hover:bg-[#1c2a38]'}`}
                >
                    Closed
                </button>
            </div>
        </div>

        {/* Exam List Grid */}
        <div className="grid gap-4">
            {filteredExams.length === 0 && (
                <div className="text-center py-12 text-text-secondary">
                    <p>No exams found matching your criteria.</p>
                </div>
            )}
            
            {filteredExams.map((exam) => (
                <div key={exam.exam_id} className="group relative flex flex-col md:flex-row gap-6 p-5 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-card-dark hover:border-student-primary/50 dark:hover:border-student-primary/50 transition-all shadow-sm hover:shadow-md">
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="flex items-center gap-3 mb-1">
                            {getStatusBadge(exam)}
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                {exam.start_time ? `Starts: ${new Date(exam.start_time).toLocaleString()}` : 'No date set'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-student-primary transition-colors">
                            {exam.title}
                        </h3>
                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-500 dark:text-text-secondary">
                            {exam.question_count !== undefined && (
                                <div className="flex items-center gap-2">
                                    <FileText size={18} />
                                    <span>{exam.question_count} Questions</span>
                                </div>
                            )}
                            {/* Dummy data for students count if not in API */}
                            {exam.duration !== undefined && (
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    <span>{exam.duration} Mins</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-[#111a22] pt-4 md:pt-0 md:pl-6">
                         <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-[#111a22] md:absolute md:top-4 md:right-4">
                            <MoreHorizontal size={24} />
                        </button>
                        
                        <button 
                            onClick={() => {
                                if (exam.completed) {
                                    navigate('/exam/results'); // Or specific result page
                                } else {
                                    navigate(`/exam/take/${exam.exam_id}`);
                                }
                            }}
                            disabled={exam.completed && false} // Allow viewing results if completed
                            className="w-full md:w-auto px-4 py-2 bg-slate-100 dark:bg-[#111a22] hover:bg-student-primary hover:text-white dark:hover:bg-student-primary text-slate-700 dark:text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <span>{exam.completed ? 'View Results' : 'Start Exam'}</span>
                            {exam.completed ? <FileText size={18} /> : <ArrowRight size={18} />}
                        </button>
                    </div>
                </div>
            ))}
        </div>
        
         {/* Pagination (Placeholder) */}
         <div className="flex justify-center pt-4 pb-12">
            <button className="text-sm font-medium text-slate-500 dark:text-text-secondary hover:text-student-primary transition-colors flex items-center gap-2">
                Show more
            </button>
        </div>

      </div>
    </div>
  );
};

export default MyExams;
