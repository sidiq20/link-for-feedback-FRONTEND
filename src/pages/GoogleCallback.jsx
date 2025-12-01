import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      const access = params.get('access');
      const refresh = params.get('refresh');

      if (access && refresh) {
        try {
          // Store tokens and fetch user data
          await handleOAuthCallback(access, refresh);
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error('OAuth callback error:', error);
          navigate('/login', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    processCallback();
  }, [params, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-b-2 border-pink-500 rounded-full"></div>
    </div>
  );
};

export default GoogleCallback;
