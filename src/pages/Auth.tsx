import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const { login, signup, resetPassword } = useAuth();
  const navigate = useNavigate();

  const clearErrors = () => {
    setError(null);
    setSuccessMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg(`Password reset link sent to ${email}`);
      setTimeout(() => setMode('login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 bg-gray-50 dark:bg-dark-bg">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-10 dark:opacity-20 blur-sm" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-dark-card/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="bg-primary text-white p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-8 h-8" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {mode === 'login' && 'Enter your credentials to access your account.'}
            {mode === 'signup' && 'Join the community and start downloading.'}
            {mode === 'forgot' && 'Enter your email to receive a reset link.'}
          </p>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
          {successMsg && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm flex items-center gap-2"
            >
              <CheckCircle size={16} /> {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <button 
                  type="button"
                  onClick={() => { clearErrors(); setMode('forgot'); }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button className="w-full mt-6" size="lg" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Confirm Password</label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <Button className="w-full mt-6" size="lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <Button className="w-full mt-6" size="lg" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <button 
              type="button"
              onClick={() => { clearErrors(); setMode('login'); }}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mt-4 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          </form>
        )}

        {/* Footer Links */}
        {mode !== 'forgot' && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => { clearErrors(); setMode(mode === 'login' ? 'signup' : 'login'); }}
                className="text-primary hover:text-primary-hover font-bold transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
