import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AuthAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const setUser = useAuthStore((state) => state.setUser);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormInputs) => {
      try {
          const response = await AuthAPI.login({ email: data.email, password: data.password });
          console.log("Login API Response:", response.data); // Debugging
          return response.data;
      } catch (error) {
          console.error("Login API Error:", error);
          throw error;
      }
    },
    onSuccess: (data) => {
      if (data?.access_token) {
          localStorage.setItem('access_token', data.access_token);
          if (data.refresh_token) {
              localStorage.setItem('refresh_token', data.refresh_token);
          }
          setUser(data.user || { email: 'user@example.com', name: 'User' }); // Fallback if user object is missing
          // Force a check auth to ensure state is consistent
          // checkAuth(); // Optional: might be redundant if setUser works
          console.log("Login Successful, navigating to:", from);
          navigate(from, { replace: true });
      } else {
          console.error("Login succeeded but no access_token in response:", data);
          // Handle case where backend might returns success but no token (e.g. 2FA?)
      }
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = async () => {
      try {
          const res = await AuthAPI.googleURL();
          window.location.href = res.data.url;
      } catch (error) {
          console.error("Google login failed", error);
      }
  };


  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans min-h-screen flex flex-col antialiased transition-colors duration-300">
      <nav className="w-full px-6 py-5 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <span className="material-icons-round text-xl">chat_bubble_outline</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Whisper</span>
        </div>
        <div className="hidden md:block">
          <span className="text-sm text-gray-500 dark:text-gray-400">Don't have an account?</span>
          <Link to="/register" className="ml-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
            Sign up for free
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center relative p-4 z-10">
        <div className="absolute inset-0 glow-bg pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(245, 78, 134, 0.15) 0%, rgba(10, 10, 10, 0) 50%)' }}></div>
        <div className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-2xl shadow-2xl p-8 md:p-10 relative z-10 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {loginMutation.isError && (
               <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-md">
                 {(loginMutation.error as any)?.response?.data?.error || 'Login failed. Please try again.'}
               </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons-round text-gray-400 text-lg">mail</span>
                </div>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow outline-none"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons-round text-gray-400 text-lg">lock</span>
                </div>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800"
                />
                <label className="ml-2 block text-sm text-gray-600 dark:text-gray-400" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-hover transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-white dark:focus:ring-offset-surface-dark transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-surface-dark text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-[#1A1A1A] text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <svg aria-hidden="true" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"></path>
                </svg>
                Google
              </button>
              <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-[#1A1A1A] text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <svg aria-hidden="true" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M16.318 13.714v5.484h9.078c-0.381 2.309-2.079 6.556-8.598 6.556-5.877 0-9.429-4.305-9.429-9.144 0-4.839 3.552-9.144 9.429-9.144 2.853 0 5.466 1.623 7.029 4.149l6.392-3.869c-2.457-3.975-6.681-6.396-11.817-6.396-9.117 0-16.5 7.383-16.5 16.5s7.383 16.5 16.5 16.5c8.385 0 15.549-5.631 16.326-13.821h-12.41z" transform="scale(0.5) translate(12,12)"></path>
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.18 13.88l-1.07 1.07c-0.2.2-0.51.2-0.71 0l-1.61-1.61c-0.2-.2-0.51-.2-0.71 0l-1.61 1.61c-0.2.2-0.51.2-0.71 0l-1.07-1.07c-0.2-.2-0.2-.51 0-.71l1.61-1.61c0.2-.2 0.2-.51 0-.71l-1.61-1.61c-.2-.2-.2-.51 0-.71l1.07-1.07c0.2-.2 0.51-.2 0.71 0l1.61 1.61c0.2.2 0.51.2 0.71 0l1.61-1.61c0.2-.2 0.51-.2 0.71 0l1.07 1.07c0.2.2 0.2.51 0 .71l-1.61 1.61c-.2.2-.2.51 0 .71l1.61 1.61c0.2.2 0.2.51 0 .71z"></path>
                </svg>
                Microsoft
              </button>
            </div>

            <div className="mt-6 text-center md:hidden">
              <span className="text-sm text-gray-500 dark:text-gray-400">Don't have an account?</span>
              <Link to="/register" className="text-sm font-semibold text-primary hover:text-primary-hover">Sign up</Link>
            </div>
          </div>
        </div>
      </main>
      
       <footer className="w-full py-6 px-6 z-10">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-500">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <span className="material-icons-round text-lg text-primary">chat_bubble_outline</span>
          <span>© 2025 Whisper. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Support</a>
        </div>
        </div>
      </footer>
    </div>
  );
}
