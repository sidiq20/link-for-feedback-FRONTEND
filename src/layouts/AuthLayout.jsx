import { MessageSquare } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden px-4">

      {/* Soft Gradients */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/70 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 bg-whisper-accent-pink rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
