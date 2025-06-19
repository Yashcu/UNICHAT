import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail, User, UserCircle } from 'lucide-react';
import { UserRole } from '../../types';
import toast from 'react-hot-toast';
import FormField from '../shared/FormField';
import ButtonSpinner from '../shared/ButtonSpinner';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
};

const RegisterForm = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'student'
    }
  });
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');
  const [registerError, setRegisterError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    setRegisterError(null); // Clear previous errors
    try {
      console.log('Attempting registration with data:', { ...data, password: '***' });
      await registerUser(data.name, data.email, data.password, data.role);
      toast.success('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: { response?: { data?: { message?: string }, status?: number }, message?: string }) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      setRegisterError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md animate-fade-in">
      <FormField
        label="Full Name"
        name="name"
        type="text"
        icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
        register={register}
        error={errors}
        placeholder="John Doe"
        validationRules={{ required: 'Name is required' }}
      />

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

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        icon={<Lock size={18} className="text-gray-400 dark:text-gray-500" />}
        register={register}
        error={errors}
        placeholder="••••••••"
        validationRules={{
          required: 'Please confirm your password',
          validate: value => value === password || 'Passwords do not match'
        }}
      />

      <div> {/* Role selection doesn't fit FormField structure directly */}
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Role
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserCircle size={18} className="text-gray-400 dark:text-gray-500" /> {/* Icon color for dark mode */}
          </div>
          <select
            id="role"
            {...register('role')}
            className="input pl-10" // .input handles dark mode
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {/* No error display needed for role based on current validation */}
      </div>

      {registerError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">{registerError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full flex justify-center" // .btn-primary handles dark mode
      >
        {isSubmitting ? <ButtonSpinner /> : 'Register'}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;