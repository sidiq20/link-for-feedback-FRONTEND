import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ExamPortalAPI } from '../../services/api';
import { 
  Calendar, 
  Clock, 
  Timer, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  Bell
} from 'lucide-react';

// Define types for API response
interface Exam {
  exam_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
}

interface ExamResult {
  exam_title: string;
  final_score: number;
  graded: boolean;
  submitted_at: string;
}

interface DashboardData {
  registered: any[];
  upcoming: Exam[];
  recent_results: ExamResult[];
}

export default function ExamDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['exam-dashboard'],
    queryFn: async () => {
      const response = await ExamPortalAPI.dashboard();
      return response.data as DashboardData;
    },
  });

  const upcomingExams = data?.upcoming || [];
  const registeredExams = data?.registered || [];
  const recentResults = data?.recent_results || [];
  const completedCount = recentResults.length;

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full min-h-[500px]">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary"></div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar / Search (Desktop) */}
      <div className="hidden lg:flex w-full items-center justify-between border-b border-card-dark/50 bg-[#111a22]/95 backdrop-blur-md px-8 py-4 sticky top-0 z-10">
        <div className="flex flex-1 max-w-xl">
           <label className="relative flex w-full items-center">
             <span className="absolute left-4 flex items-center justify-center text-text-secondary">
               <Search size={20} />
             </span>
             <input className="w-full rounded-full border-none bg-card-dark py-3 pl-12 pr-4 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-student-primary/50" placeholder="Search for exams..." type="text"/>
           </label>
        </div>
        <div className="flex items-center gap-4 pl-8">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card-dark text-white hover:bg-card-dark/80 transition-colors">
                <Bell size={20} />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[#111a22]"></span>
            </button>
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-card-dark bg-student-primary/20 flex items-center justify-center">
                 <span className="text-white font-bold">{user?.name?.[0].toUpperCase()}</span>
            </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 px-4 py-6 lg:px-8 lg:py-8">
         {/* Welcome Section */}
         <div className="flex flex-col gap-6">
            <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black leading-tight tracking-tight text-white">Welcome back, {user?.name?.split(' ')[0]}</h2>
                    <p className="text-text-secondary text-base">You have {upcomingExams.length} exams coming up.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-secondary">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-card-dark to-[#1e2e3e] p-6 shadow-sm border border-card-dark hover:border-student-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-text-secondary text-sm font-medium">Upcoming Exams</p>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Calendar className="text-student-primary" size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{upcomingExams.length}</p>
                </div>
                <div className="flex flex-col justify-between rounded-xl bg-card-dark p-6 shadow-sm border border-card-dark">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-text-secondary text-sm font-medium">Registered</p>
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <BookOpen className="text-purple-400" size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{registeredExams.length}</p>
                </div>
                <div className="flex flex-col justify-between rounded-xl bg-card-dark p-6 shadow-sm border border-card-dark">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-text-secondary text-sm font-medium">Completed</p>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <CheckCircle2 className="text-green-400" size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white tracking-tight">{completedCount}</p>
                </div>
            </div>
         </div>

         {/* Upcoming Exams Grid */}
         <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Upcoming Exams</h3>
                <Link to="/exam/register" className="text-sm font-medium text-student-primary hover:text-student-primary/80">Register New</Link>
             </div>
             
             {upcomingExams.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {upcomingExams.map((exam) => (
                        <div key={exam.exam_id} className="group relative flex flex-col justify-between rounded-xl bg-card-dark p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-student-primary/5 border border-transparent hover:border-student-primary">
                             <div className="absolute right-4 top-4">
                                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500">
                                    {new Date(exam.start_time).toLocaleDateString()}
                                </span>
                             </div>
                             <div className="flex flex-col gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#111a22]">
                                    <BookOpen className="text-white" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{exam.title}</h4>
                                    <p className="text-sm text-text-secondary line-clamp-1">{exam.description || 'No description'}</p>
                                </div>
                                <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Clock size={18} />
                                        <span className="text-sm">{new Date(exam.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Timer size={18} />
                                        <span className="text-sm">{exam.duration_minutes}m duration</span>
                                    </div>
                                </div>
                             </div>
                             <button 
                                onClick={() => navigate(`/exam/take/${exam.exam_id}`)}
                                className="mt-6 w-full rounded-lg bg-student-primary py-2.5 text-sm font-bold text-white shadow-md shadow-student-primary/20 transition-transform active:scale-95"
                            >
                                Start Exam
                            </button>
                        </div>
                    ))}
                </div>
             ) : (
                <div className="text-center py-10 bg-card-dark rounded-xl border border-dashed border-gray-700">
                    <p className="text-gray-400">No upcoming exams. Register for one!</p>
                </div>
             )}
         </div>

         {/* Registered & Results */}
         <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Registered List */}
            <div className="flex flex-col gap-4">
                 <h3 className="text-xl font-bold text-white">My Registered Exams</h3>
                 <div className="flex flex-col gap-3">
                    {registeredExams.length > 0 ? registeredExams.slice(0, 3).map((exam) => (
                        <div key={exam.id || exam.exam_id} className="flex items-center justify-between rounded-xl bg-card-dark p-4 transition-colors hover:bg-[#2c4053]">
                            <div className="flex items-center gap-4">
                                <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-student-primary/10 sm:flex">
                                    <BookOpen className="text-student-primary" size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-white">{exam.title}</p>
                                    <p className="text-xs text-text-secondary">ID: {exam.exam_id?.substring(0,8)}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-text-secondary text-sm">No registered exams found.</p>
                    )}
                 </div>
            </div>

             {/* Recent Results */}
             <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold text-white">Recent Results</h3>
                     <Link to="/exam/results" className="text-sm font-medium text-text-secondary hover:text-white">View All</Link>
                 </div>
                 <div className="overflow-hidden rounded-xl border border-card-dark bg-card-dark">
                    <table className="w-full text-left text-sm text-text-secondary">
                        <thead className="bg-[#1e2e3e] text-xs uppercase text-text-secondary">
                            <tr>
                                <th className="px-6 py-3 font-medium">Exam Name</th>
                                <th className="px-6 py-3 font-medium text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e2e3e]">
                            {recentResults.length > 0 ? recentResults.slice(0, 5).map((result, idx) => (
                                <tr key={idx} className="hover:bg-[#2c4053] transition-colors">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                        {result.final_score >= 50 ? <CheckCircle2 size={16} className="text-green-400" /> : <AlertTriangle size={16} className="text-yellow-500" />}
                                        {result.exam_title}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${result.final_score >= 50 ? 'text-student-primary' : 'text-yellow-500'}`}>
                                        {result.final_score}%
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td className="px-6 py-4 text-center" colSpan={2}>No results yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
             </div>
         </div>

      </div>
    </div>
  );
}
