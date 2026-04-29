import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Already logged in → redirect to dashboard
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data);
      toast.success('Welcome back! 👋');
      navigate('/admin', { replace: true });
    } catch (err) {
      const msg = err.response?.status === 401
        ? 'Invalid username or password.'
        : err.response?.data?.detail || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-purple w-[400px] h-[400px] -top-20 -left-20" />
      <div className="orb orb-pink   w-[300px] h-[300px] bottom-0 right-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass p-8 rounded-2xl w-full max-w-md relative z-10"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-600/20 border border-primary-500/30
                          flex items-center justify-center">
            <LockClosedIcon className="w-8 h-8 text-primary-400" />
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-white text-center mb-1">
          Admin Login
        </h1>
        <p className="text-slate-400 text-sm text-center mb-8">
          Sign in to manage your portfolio content
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="login-username" className="input-label">Username</label>
            <input
              id="login-username"
              type="text"
              placeholder="admin"
              autoComplete="username"
              className={`input-field ${errors.username ? 'border-red-500' : ''}`}
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="input-label">Password</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`input-field pr-11 ${errors.password ? 'border-red-500' : ''}`}
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword
                  ? <EyeSlashIcon className="w-5 h-5" />
                  : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center py-3"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              <>
                <LockClosedIcon className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-6">
          This area is restricted to authorized administrators only.
        </p>
      </motion.div>
    </div>
  );
}
