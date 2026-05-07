import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Activity, ShieldCheck, User } from 'lucide-react';

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('admin'); // 'admin' or 'candidate'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Handle Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        onLogin(data.session);
      } else {
        // Handle Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;

        // If signing up as admin, we should normally insert into `profiles` table.
        // For demonstration, we'll try to insert the profile
        if (data.user) {
           await supabase.from('profiles').insert([
             { id: data.user.id, role: role }
           ]);
        }

        alert('Registration successful! Check your email or login now.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 p-8 border-b border-slate-700 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4 border border-blue-500/20">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">AI SkillFit Portal</h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Sign in to access your dashboard' : 'Create a new account'}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          
          {/* Role Selector */}
          {!isLogin && (
            <div className="flex bg-slate-900 p-1 rounded-lg mb-6 border border-slate-700">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  role === 'candidate' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User size={16} /> Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  role === 'admin' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck size={16} /> Admin
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 text-sm hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
