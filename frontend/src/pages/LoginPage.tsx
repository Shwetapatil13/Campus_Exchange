import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await login({ email, password });
      showToast('Welcome back to CampusExchange!', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid email or password. Please check your credentials.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xl flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Log in to CampusExchange
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your campus marketplace, wishlist, and listed items
          </p>
        </div>

        {/* Demo Account Filler Banner */}
        <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-700 dark:text-brand-300 space-y-2">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
            <span>Quick Demo Accounts (1-Click Fill):</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleDemoLogin('alex@campus.edu')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-brand-500/30 text-brand-600 dark:text-brand-300 font-semibold hover:bg-brand-50 transition-colors flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" /> Alex (CS Student)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('sarah@campus.edu')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-brand-500/30 text-brand-600 dark:text-brand-300 font-semibold hover:bg-brand-50 transition-colors flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" /> Sarah (Engineering)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('rahul@campus.edu')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-brand-500/30 text-brand-600 dark:text-brand-300 font-semibold hover:bg-brand-50 transition-colors flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" /> Rahul (IIT)
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <Input
            label="Campus Email Address"
            type="email"
            placeholder="student@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password
              </label>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2">
            Log In
          </Button>
        </form>

        {/* Footer link */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have a campus account?{' '}
            <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
