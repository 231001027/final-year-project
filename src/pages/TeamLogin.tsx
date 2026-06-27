import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Users, User, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function TeamLogin() {
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ teamId?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const { loginTeam } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!teamId.trim()) {
      newErrors.teamId = 'Team ID is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const result = await loginTeam(teamId.trim(), password);
    setIsLoading(false);

    if (result.success) {
      showNotification('success', 'Login successful! Welcome back.');
      navigate('/student/dashboard');
    } else {
      showNotification('error', result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Login</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Access your team dashboard to select projects
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Team ID"
              placeholder="Enter your Team ID"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              error={errors.teamId}
              leftIcon={<User className="w-5 h-5" />}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter team password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">
              Demo Credentials
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs font-mono">
              <p className="text-slate-600 dark:text-slate-400">Team ID (Batch ID): <span className="text-teal-600 dark:text-teal-400">27A01</span></p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Password (Roll No): <span className="text-teal-600 dark:text-teal-400">2116231001001</span></p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login/faculty"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Login as Faculty instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
