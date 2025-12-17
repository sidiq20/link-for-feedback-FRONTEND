import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ExamManageAPI } from '../../services/api';
import { 
  Calendar,
  Search,
  Bell,
  HelpCircle,
  Activity,
  FileClock,
  CheckCircle2,
  BarChart2,
  PlusCircle,
  UserPlus,
  Upload,
  MoreVertical,
  Edit2
} from 'lucide-react';

export default function ExaminerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['examiner-dashboard'],
    queryFn: async () => {
      const response = await ExamManageAPI.list(); // Assuming this returns list of exams
      // We might need a specific dashboard endpoint for examiner stats if available, 
      // otherwise calculate from list
      return {
        exams: response.data.exams || []
      };
    },
  });

  const exams = data?.exams || [];
  
  // Calculate Stats
  const activeExams = exams.filter((e: any) => e.status === 'published').length;
  // Placeholder pending calculation
  const pendingGrading = exams.reduce((acc: number, e: any) => acc + (e.pending_grading || 0), 0);
  const completedFromExams = exams.reduce((acc: number, e: any) => acc + (e.completed_count || 0), 0);
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full min-h-[500px]">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-examiner-primary"></div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Header (Desktop) */}
      <div className="hidden lg:flex sticky top-0 z-20 h-20 items-center justify-between border-b border-card-dark/50 bg-[#111a22]/80 px-8 py-3 backdrop-blur-md">
        <div className="flex flex-1 max-w-xl">
             <label className="flex w-full items-center gap-2 rounded-lg bg-card-dark px-4 py-2.5 ring-1 ring-transparent focus-within:ring-examiner-primary/50 transition-all">
                <Search className="text-text-secondary" size={20} />
                <input className="w-full bg-transparent text-sm text-white placeholder-text-secondary focus:outline-none" placeholder="Search for exams, students..." type="text"/>
             </label>
        </div>
        <div className="flex items-center gap-6">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-card-dark text-white hover:bg-[#2f4559] transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-card-dark"></span>
            </button>
            <button className="flex h-10 items-center gap-2 rounded-lg bg-card-dark px-3 text-sm font-bold text-white hover:bg-[#2f4559] transition-colors">
                <HelpCircle size={20} />
                <span>Support</span>
            </button>
        </div>
      </div>

      <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
         {/* Welcome Section */}
         <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Good morning, {user?.name?.split(' ')[0]}</h2>
                <p className="text-text-secondary text-base">Here is what is happening with your exams today.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary bg-card-dark px-4 py-2 rounded-full border border-card-dark">
                <Calendar className="text-examiner-primary" size={16} />
                <span>{new Date().toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}</span>
            </div>
         </div>

         {/* Metrics Grid */}
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Active Exams */}
            <div className="group flex flex-col gap-4 rounded-xl bg-card-dark p-6 border border-card-dark hover:border-examiner-primary/50 transition-all">
                <div className="flex items-center justify-between">
                    <p className="text-text-secondary text-sm font-medium">Active Exams</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-examiner-primary/20 text-examiner-primary">
                        <Activity size={14} />
                    </div>
                </div>
                <div>
                    <p className="text-3xl font-bold text-white">{activeExams}</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-background-dark overflow-hidden">
                        <div className="h-full w-[75%] rounded-full bg-examiner-primary"></div>
                    </div>
                    <p className="mt-2 text-xs text-text-secondary">active now</p>
                </div>
            </div>
             {/* Pending Grading */}
             <div className="group flex flex-col gap-4 rounded-xl bg-card-dark p-6 border border-card-dark hover:border-yellow-500/50 transition-all">
                <div className="flex items-center justify-between">
                    <p className="text-text-secondary text-sm font-medium">Pending Grading</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                        <FileClock size={14} />
                    </div>
                </div>
                <div>
                    <p className="text-3xl font-bold text-white">{pendingGrading}</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-background-dark overflow-hidden">
                        <div className="h-full w-[30%] rounded-full bg-yellow-500"></div>
                    </div>
                    <p className="mt-2 text-xs text-text-secondary">assignments to grade</p>
                </div>
            </div>
             {/* Completed Exams */}
             <div className="group flex flex-col gap-4 rounded-xl bg-card-dark p-6 border border-card-dark hover:border-green-500/50 transition-all">
                <div className="flex items-center justify-between">
                    <p className="text-text-secondary text-sm font-medium">Completed Exams</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                        <CheckCircle2 size={14} />
                    </div>
                </div>
                <div>
                    <p className="text-3xl font-bold text-white">{completedFromExams}</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-background-dark overflow-hidden">
                         <div className="h-full w-full rounded-full bg-green-500"></div>
                    </div>
                    <p className="mt-2 text-xs text-text-secondary">total completed</p>
                </div>
            </div>
             {/* Average Score */}
             <div className="group flex flex-col gap-4 rounded-xl bg-card-dark p-6 border border-card-dark hover:border-purple-500/50 transition-all">
                <div className="flex items-center justify-between">
                    <p className="text-text-secondary text-sm font-medium">Avg Score</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-500">
                        <BarChart2 size={14} />
                    </div>
                </div>
                <div>
                    <p className="text-3xl font-bold text-white">--%</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-background-dark overflow-hidden">
                         <div className="h-full w-[0%] rounded-full bg-purple-500"></div>
                    </div>
                    <p className="mt-2 text-xs text-text-secondary">across all exams</p>
                </div>
            </div>
         </div>

         {/* Content Columns */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Quick Actions Panel */}
                <div className="bg-card-dark rounded-xl border border-card-dark p-6">
                    <h3 className="text-white text-lg font-bold leading-tight mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/examiner/exams/new" className="flex items-center gap-2 rounded-lg bg-examiner-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-examiner-primary/20 hover:bg-blue-600 transition-all">
                            <PlusCircle size={20} />
                            Create New Exam
                        </Link>
                         <button className="flex items-center gap-2 rounded-lg bg-background-dark border border-card-dark px-5 py-3 text-sm font-medium text-white hover:bg-[#233648] transition-all">
                            <UserPlus size={20} />
                            Add Student
                        </button>
                        <button className="flex items-center gap-2 rounded-lg bg-background-dark border border-card-dark px-5 py-3 text-sm font-medium text-white hover:bg-[#233648] transition-all">
                            <BarChart2 size={20} />
                            View Analytics
                        </button>
                        <button className="flex items-center gap-2 rounded-lg bg-background-dark border border-card-dark px-5 py-3 text-sm font-medium text-white hover:bg-[#233648] transition-all">
                            <Upload size={20} />
                            Import Questions
                        </button>
                    </div>
                </div>

                {/* Exams List */}
                <div className="bg-card-dark rounded-xl border border-card-dark overflow-hidden flex flex-col flex-1">
                    <div className="flex items-center justify-between p-6 border-b border-card-dark">
                        <h3 className="text-white text-lg font-bold leading-tight">Recent Exams</h3>
                         <Link to="/examiner/exams" className="text-examiner-primary text-sm font-medium hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#111a22] text-text-secondary">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Exam Title</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-card-dark">
                                {exams.length > 0 ? exams.slice(0, 5).map((exam: any) => (
                                    <tr key={exam._id || exam.exam_id} className="group hover:bg-[#233648]/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                 <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                    <Activity size={20} />
                                                 </div>
                                                 <div>
                                                    <p className="font-bold text-white">{exam.title}</p>
                                                    <p className="text-xs text-text-secondary">{exam.exam_id?.substring(0,8)}</p>
                                                 </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                             <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
                                                 exam.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                                 exam.status === 'draft' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                             }`}>
                                                 {exam.status === 'published' && <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                                                 {exam.status}
                                             </span>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {new Date(exam.start_time).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-text-secondary hover:text-white transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td className="px-6 py-4 text-center" colSpan={4}>No exams found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
                 <div className="bg-card-dark rounded-xl border border-card-dark p-6 h-full">
                    <h3 className="text-white text-lg font-bold leading-tight mb-4">Recent Activity</h3>
                    <div className="flex flex-col gap-4 text-center py-6">
                        <p className="text-text-secondary text-sm">Activity feed coming soon...</p>
                    </div>
                 </div>
            </div>
         </div>
      </div>
    </div>
  );
}
