import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await resetPassword(token, password);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative z-10 max-w-md w-full p-8">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Password Updated</h2>
            <p className="text-gray-400 mb-2">You can now log in with your new password.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full p-8">
        <Link to="/login" className="inline-flex items-center text-whisper-accent-pink mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>

        <h2 className="text-3xl text-center font-bold text-white mb-2">Reset Password</h2>
        <p className="text-center text-gray-400 mb-6">Enter your new password.</p>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-300">New Password</label>
              <div className="relative mt-1">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-3 pl-10 pr-10 bg-slate-800/50 text-white border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-3.5"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-whisper-accent-pink text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin border-b-2 border-white w-4 h-4 rounded-full mx-auto"></div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
