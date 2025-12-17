import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Home,
  BookOpen,
  User, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  Settings,
  ArrowLeft
} from 'lucide-react';

const ExamLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation matching uis/student_dashboard/code.html where possible
  const navigation = [
    { name: 'Dashboard', href: '/exam', icon: Home },
    { name: 'Exam Catalog', href: '/exam/register', icon: BookOpen }, // Mapping "Exam Catalog" to Register/List
    { name: 'My Exams', href: '/exam/my-exams', icon: GraduationCap },
    { name: 'Profile', href: '/profile', icon: User }, // Placeholder
    { name: 'Settings', href: '/settings', icon: Settings }, // Placeholder
  ];

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans overflow-hidden flex antialiased selection:bg-student-primary selection:text-white">
      
      {/* Sidebar - Desktop */}
      <div className={`hidden lg:flex w-72 flex-col justify-between border-r border-card-dark/50 bg-[#111a22] p-6`}>
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-student-primary text-white">
                        <GraduationCap size={20} />
                    </div>
                    <h1 className="text-xl font-bold leading-normal tracking-tight text-white">Whisper</h1>
                </div>
                <p className="text-text-secondary text-sm font-normal pl-10">Student Portal</p>
            </div>

            <nav className="flex flex-col gap-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link 
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors group ${isActive ? 'bg-card-dark text-white' : 'hover:bg-card-dark/50 hover:text-white text-text-secondary'}`}
                        >
                            <item.icon className={`text-[24px] ${isActive ? 'text-student-primary' : 'text-text-secondary group-hover:text-white'}`} size={24} />
                            <p className={`text-sm font-medium leading-normal ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>{item.name}</p>
                        </Link>
                    )
                })}
            </nav>
        </div>

        <div className="flex flex-col gap-4">
             {/* Back to Whisper Main App */}
             <Link
                to="/dashboard"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:text-white hover:bg-card-dark/50 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Apps</span>
            </Link>

            <button onClick={handleLogout} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-card-dark px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-card-dark/80 hover:text-red-400">
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
      </div>

       {/* Sidebar - Mobile Overlay */}
       {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)}></div>
       )}

      {/* Sidebar - Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111a22] border-r border-card-dark/50 p-6 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:hidden flex flex-col justify-between`}>
         {/* Same Content as Desktop Sidebar */}
         <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-student-primary text-white">
                        <GraduationCap size={20} />
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
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors group ${location.pathname === item.href ? 'bg-card-dark' : 'hover:bg-card-dark/50'}`}
                    >
                        <item.icon size={24} className={location.pathname === item.href ? 'text-student-primary' : 'text-text-secondary'} />
                        <p className={`text-sm font-medium ${location.pathname === item.href ? 'text-white' : 'text-text-secondary'}`}>{item.name}</p>
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
            <span className="font-bold text-white">Student Portal</span>
            <div className="w-8"></div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default ExamLayout;
