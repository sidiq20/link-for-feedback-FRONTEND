import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Home,
  BookOpen,
  ClipboardList,
  Users,
  Settings,
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  ArrowLeft,
  AudioWaveform // Using this for "graphic_eq" from material symbols
} from 'lucide-react';

const ExaminerLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/examiner', icon: Home },
    { name: 'My Exams', href: '/examiner/exams', icon: BookOpen },
    { name: 'Question Bank', href: '/examiner/questions', icon: BookOpen }, // Placeholder path
    { name: 'Grading Queue', href: '/examiner/grading', icon: ClipboardList },
    { name: 'Students', href: '/examiner/students', icon: Users }, // Placeholder path
    { name: 'Settings', href: '/examiner/settings', icon: Settings }, // Placeholder path
  ];

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans overflow-hidden flex antialiased selection:bg-examiner-primary selection:text-white">
      
      {/* Sidebar - Desktop */}
      <div className={`hidden lg:flex w-72 flex-col justify-between border-r border-card-dark/50 bg-[#111a22] p-6`}>
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-examiner-primary/20 text-examiner-primary">
                        <AudioWaveform size={20} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-xl font-bold leading-none tracking-tight">Whisper</h1>
                        <p className="text-text-secondary text-xs font-normal">Examiner Portal</p>
                    </div>
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link 
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors group ${isActive ? 'bg-examiner-primary text-white shadow-md' : 'hover:bg-card-dark hover:text-white text-text-secondary'}`}
                        >
                            <item.icon className="transition-colors" size={20} />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>

        <div className="mt-auto flex flex-col gap-4">
             {/* Switch / Back */}
             <div className="flex flex-col gap-2 pt-4 border-t border-card-dark/50">
                <Link
                    to="/exam"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:text-white hover:bg-card-dark/50 transition-colors"
                >
                    <GraduationCap size={20} />
                    <span>Student Mode</span>
                </Link>
                <Link
                    to="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:text-white hover:bg-card-dark/50 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Whisper</span>
                </Link>
             </div>


            <div className="px-4 py-4 rounded-xl bg-card-dark/50 border border-card-dark flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-examiner-primary/30 flex items-center justify-center bg-gray-700">
                        <span className="font-bold text-white">{user?.name?.[0]}</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm font-bold text-white">{user?.name}</span>
                        <span className="truncate text-xs text-text-secondary">Examiner</span>
                    </div>
                    <button onClick={handleLogout} className="ml-auto text-text-secondary hover:text-red-400">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </div>
      </div>

       {/* Sidebar - Mobile Overlay */}
       {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)}></div>
       )}

      {/* Sidebar - Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111a22] border-r border-card-dark/50 p-6 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:hidden flex flex-col justify-between`}>
         <div className="flex flex-col gap-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-examiner-primary/20 text-examiner-primary">
                        <AudioWaveform size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-white">Whisper</h1>
                </div>
                <button onClick={() => setSidebarOpen(false)}><X className="text-text-secondary" /></button>
            </div>
            
            <nav className="flex flex-col gap-2">
                {navigation.map((item) => (
                    <Link 
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${location.pathname === item.href ? 'bg-examiner-primary text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        <item.icon size={20} />
                        <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
         </div>
      </div>


      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-background-dark h-full relative w-full">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-card-dark/50 bg-[#111a22]">
            <button onClick={() => setSidebarOpen(true)} className="text-text-secondary"><Menu /></button>
            <span className="font-bold text-white">Examiner Portal</span>
            <div className="w-8"></div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default ExaminerLayout;
