import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please complete all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the wellness disclaimer and terms to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register({
        fullName,
        email,
        password,
        confirmPassword,
      });
      showToast('success', 'Account Created!', 'Welcome to FitCorp. Let us set up your profile.');
      navigate('/onboarding', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(msg);
      showToast('error', 'Registration Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-panel border-slate-200/80 dark:border-corporate-800 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Create your Account</CardTitle>
        <CardDescription>
          Join thousands of corporate professionals optimizing their health & fitness
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Alex Morgan"
            leftIcon={<User className="w-4 h-4" />}
            required
            autoComplete="name"
          />

          <Input
            label="Work Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@company.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
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
            autoComplete="new-password"
            helperText="Include letters, numbers, and symbols"
          />

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="new-password"
          />

          <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
              required
            />
            <label htmlFor="terms">
              I acknowledge the <Link to="/disclaimer" className="text-brand-600 hover:underline">wellness disclaimer</Link> and agree to the <Link to="/terms" className="text-brand-600 hover:underline">Terms of Service</Link>.
            </label>
          </div>

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Create Account & Start Onboarding
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-corporate-800 pt-4">
        <div>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500 underline">
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
