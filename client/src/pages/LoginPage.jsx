import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import bnkLogo from '../assets/BNKLOGO.png';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bnk-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <img src={bnkLogo} alt="BNK Physiotherapy" className="w-20 h-20 mx-auto mb-3 object-contain" />
          <h1 className="text-3xl font-bold text-bnk-primary tracking-tight">BNK</h1>
          <p className="text-sm font-semibold uppercase tracking-widest text-bnk-secondary mt-1">Healthcare</p>
        </div>
        <h2 className="mt-8 text-center text-2xl font-bold text-gray-900">
          Billing Management System
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-bnk-primary/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bnk-secondary focus:border-bnk-secondary sm:text-sm transition-colors"
                  placeholder="admin@bnk.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bnk-secondary focus:border-bnk-secondary sm:text-sm transition-colors pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-bnk-primary hover:bg-[#1a5a4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bnk-primary disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;