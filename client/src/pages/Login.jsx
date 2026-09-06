import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import LuxuryLogo from '../components/LuxuryLogo';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPassword = data.password.trim();
    const result = await login(cleanEmail, cleanPassword);
    if (result.success) {
      toast.success('Welcome back to LuxuryStay!');
      navigate('/');
    } else {
      toast.error(result.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fdfdfd] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-xl border-t-4 border-gold-600">
        <div className="flex flex-col items-center text-center">
          <LuxuryLogo variant="dark" size="md" />
          <h2 className="mt-4 text-center text-xl sm:text-2xl font-serif text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-1 text-center text-xs sm:text-sm text-gray-500 font-light">
            Sign in to access your luxury reservations & privileges
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  className={`block w-full border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 bg-gray-50/50`}
                  placeholder="name@example.com"
                  {...register('email')}
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 pr-10 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 bg-gray-50/50`}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="font-medium text-gold-600 hover:text-gold-500">
              Forgot password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-xs font-bold uppercase tracking-widest text-white bg-gray-900 hover:bg-gold-600 focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="text-center text-xs sm:text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-gold-600 hover:text-gold-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
