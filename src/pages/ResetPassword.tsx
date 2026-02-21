import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Don't validate token on mount, only on submit to prevent premature error messages
  // unless token is completely missing
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
        <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl text-center border border-gray-100 dark:border-gray-700">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid Link</h2>
          <p className="text-gray-500 mb-6">This password reset link is invalid or missing.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
      <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your new secure password.</p>
        </div>

        {success ? (
          <div className="text-center text-green-600 dark:text-green-400">
            <CheckCircle size={48} className="mx-auto mb-4" />
            <p className="font-bold text-lg mb-2">Password Reset Successfully!</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button fullWidth size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} /> Resetting...
                </>
              ) : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
