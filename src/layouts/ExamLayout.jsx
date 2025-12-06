import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home,
  BookOpen,
  ClipboardList,
  Award,
  Settings,
  User, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';

const ExamLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Exam Dashboard', href: '/exam', icon: Home },
    { name: 'My Exams', href: '/exam/my-exams', icon: BookOpen },
    { name: 'Results', href: '/exam/results', icon: ClipboardList },
    { name: 'Certificates', href: '/exam/certificates', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex">
      {/* Arc Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-emerald-600/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-emerald-400 font-mono">
              Exam Mode
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className='flex flex-col flex-1 min-h-0'>
          <nav className="flex-1 mt-6 px-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Back to Main App */}
            <div className="mt-8 pt-4 border-t border-slate-800/50">
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-gray-400 hover:text-white hover:bg-slate-800/50"
              >
                <ArrowLeft className="mr-3 h-5 w-5" />
                Back to Whisper
              </Link>
            </div>
          </nav>

          {/* User Profile - Sticky at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-slate-800/50 bg-slate-900/90">
            <div className="flex items-center justify-between bg-slate-800/30 rounded-xl p-3 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-white truncate max-w-[120px]">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 p-1 rounded-lg hover:bg-red-900/20 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50 relative z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
              <GraduationCap className="w-3 h-3 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-emerald-400 font-mono">
              Exam Mode
            </h1>
          </div>
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Page Content */}
        <main className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ExamLayout;
