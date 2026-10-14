import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login({ email, password });
      showToast('success', 'Welcome back!', 'Signed in successfully.');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setError(msg);
      showToast('error', 'Login Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-panel border-slate-200/80 dark:border-corporate-800 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Sign in to FitCorp</CardTitle>
        <CardDescription>
          Enter your corporate credentials to access your dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div className="mb-5 p-3 rounded-lg bg-slate-50 dark:bg-corporate-800/50 border border-slate-200 dark:border-corporate-700 space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
            Instant Demo Sign-in
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('alex@fitcorp.com');
                setPassword('User@123');
              }}
              className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-corporate-900 border border-slate-200 dark:border-corporate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-corporate-800 hover:border-brand-400 transition-colors shadow-xs"
            >
              💼 Alex (Demo User)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@fitcorp.com');
                setPassword('Admin@123');
              }}
              className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-corporate-900 border border-slate-200 dark:border-corporate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-corporate-800 hover:border-brand-400 transition-colors shadow-xs"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Work Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign In to Dashboard
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-corporate-800 pt-4">
        <div>
          Don't have an account yet?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500 underline">
            Create an account
          </Link>
        </div>
        <Link to="/" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          &larr; Back to Home
        </Link>
      </CardFooter>
    </Card>
  );
};
