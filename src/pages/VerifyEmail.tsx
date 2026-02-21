import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully! You can now login.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed.');
      });
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
      <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 dark:border-gray-700">
        <div className="mb-6 flex justify-center">
          {status === 'loading' && <Loader2 size={48} className="text-primary animate-spin" />}
          {status === 'success' && <CheckCircle size={48} className="text-green-500" />}
          {status === 'error' && <XCircle size={48} className="text-red-500" />}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Verified!' : 'Verification Failed'}
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>
        
        <Link to="/login">
          <Button fullWidth variant={status === 'success' ? 'primary' : 'secondary'}>
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
