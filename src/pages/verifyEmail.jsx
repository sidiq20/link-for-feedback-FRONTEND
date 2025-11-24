import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthAPI } from '../services/api';
import { CheckCircle , XCircle, ArrowLeft  } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const verify = async () => {
            try {
                await AuthAPI.verifyEmail(token);
                setStatus('success');
            } catch (err) {
                setStatus('error');
            }
        };
        verify();
    }, [token]);

    return (
        <div className='min-h-screen bg-slate-950 flex items-center justify-center relative'>
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 -left-32 w-96 bg-green-600/20 rounded-full blur-3xl animate-pulse'></div>
            </div>

            <div className='relative z-10 max-w-md w-full p-8 text-center'>
                <div className='bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl'>

                {status === 'loading' && (
                    <> 
                        <div className='animate-spin h-12 w-12 border-b-2 border-green-500 rounded-full mx-auto mb-4'>
                        <p className='text-gray-400'>Verifying email...</p>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
                        <h2 className='text-white text-2xl font-bold mb-2'> Email Verified</h2>
                        <p className='text-gray-400 mb-6'> Your email has been successfully verified.</p>
                        <Link to='/login' className='text-whisper-accent-pink'>Go to Login</Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                    <XCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
                    <h2 className='text-white text-2xl font-bold mb-2'> Invalid or Expired Link</h2>
                    <p className='text-gray-400 mb-6'>Place request a new veryfication email.</p>
                    <Link to='/login' className='text-whisper-accent-pink'>Back to Login</Link>
                    </>
                )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;