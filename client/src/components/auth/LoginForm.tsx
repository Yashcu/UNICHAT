import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail } from 'lucide-react';
import FormField from '../shared/FormField';
import ButtonSpinner from '../shared/ButtonSpinner';

type LoginFormData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null); // Clear previous errors
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error: { response?: { data?: { message?: string }, status?: number }, message?: string }) {
      console.error('Login error:', error);
      if (error.response?.status === 429) {
        setLoginError('Too many login attempts. Please try again later.');
      } else {
        setLoginError(error.message || 'An unexpected error occurred during login.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md animate-fade-in">
      <FormField
        label="Email Address"
        name="email"
        type="email"
        icon={<Mail size={18} className="text-gray-400 dark:text-gray-500" />}
        register={register}
        error={errors}
        placeholder="your.email@university.edu"
        validationRules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        }}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        icon={<Lock size={18} className="text-gray-400 dark:text-gray-500" />}
        register={register}
        error={errors}
        placeholder="••••••••"
        validationRules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <Link to="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Forgot password?
          </Link>
        </div>
      </div>

      {loginError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">{loginError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full flex justify-center" // .btn-primary handles dark mode
      >
        {isSubmitting ? <ButtonSpinner /> : 'Sign in'}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/auth/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
          Register here
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
