import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import LuxuryLogo from '../components/LuxuryLogo';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    const result = await registerUser(data.name, data.email, data.password);
    if (result.success) {
      toast.success('Registration successful! Welcome to LuxuryStay.');
      navigate('/');
    } else {
      toast.error(result.error || 'Failed to register');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fdfdfd] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-xl border-t-4 border-gold-600">
        <div className="flex flex-col items-center text-center">
          <LuxuryLogo variant="dark" size="md" />
          <h2 className="mt-4 text-center text-xl sm:text-2xl font-serif text-gray-900">
            Create an Account
          </h2>
          <p className="mt-1 text-center text-xs sm:text-sm text-gray-500 font-light">
            Join the Privilege Club for exclusive suites and private rates
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                className={`block w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 bg-gray-50/50`}
                placeholder="e.g. Eleanor Vance"
                {...register('name')}
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                className={`block w-full border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 bg-gray-50/50`}
                placeholder="eleanor@example.com"
                {...register('email')}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 pr-9 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 bg-gray-50/50`}
                  placeholder="••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Confirm</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`block w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 pr-9 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 bg-gray-50/50`}
                  placeholder="••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-xs font-bold uppercase tracking-widest text-white bg-gray-900 hover:bg-gold-600 focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="text-center text-xs sm:text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-gold-600 hover:text-gold-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
