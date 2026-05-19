'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, Bot, Check, Info, ArrowRight, ShieldAlert, FileText 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate validation & network delay
    setTimeout(() => {
      if (email.trim() === 'admin@gmail.com' && password === 'admin123') {
        setSuccess(true);
        // Calculate max-age: 7 days if rememberMe is checked, else 1 day
        const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
        document.cookie = `nutralike_auth=authenticated; path=/; max-age=${maxAge}; samesite=lax`;
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setIsLoading(false);
        setError('Invalid credentials. Please use admin@gmail.com and admin123');
      }
    }, 1000);
  };

  const copyDemoCreds = () => {
    setEmail('admin@gmail.com');
    setPassword('admin123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen w-full flex bg-[#f2f6ef] font-sans selection:bg-[#7c9f43] selection:text-white overflow-hidden">
      
      {/* LEFT COLUMN: Rich Brand Showcase (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-8 lg:p-12"
           style={{ background: 'linear-gradient(135deg, #1e351b 0%, #314f2d 50%, #4b7045 100%)' }}>
        
        {/* Decorative ambient blurred circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#7c9f43]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#a6c86a]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl text-white flex flex-col justify-between h-full py-6">
          
          {/* Top Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="Nutralike" 
                width={26} 
                height={26} 
                className="object-contain brightness-0 invert"
              />
            </div>
            <span className="text-2xl font-black tracking-widest text-white">
              NUTRALIKE
            </span>
          </div>

          {/* Center Showcase Content */}
          <div className="space-y-6 my-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#c8e68e] shadow-lg">
              <Bot size={14} /> Enterprise Administration Portal
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight max-w-lg">
              Nutraceutical Excellence <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8e68e] via-white to-[#e5ffd4]">
                Made Effortless
              </span>
            </h1>

            <p className="text-base text-white/80 leading-relaxed font-normal max-w-md">
              Streamline raw ingredient imports, generate intelligent B2B quotations, and monitor real-time client analytics within an ultra-secure dashboard ecosystem.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl space-y-1.5 hover:bg-white/15 transition-all">
                <div className="w-9 h-9 rounded-xl bg-[#7c9f43] flex items-center justify-center text-white">
                  <FileText size={20} />
                </div>
                <h3 className="font-bold text-base text-white">Smart Ingredient Uploads</h3>
                <p className="text-xs text-white/70 leading-relaxed">Automated Excel & document parsing with real-time specification validation.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl space-y-1.5 hover:bg-white/15 transition-all">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c9f43] to-[#597a3e] flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <h3 className="font-bold text-base text-white">AI Quotation Engine</h3>
                <p className="text-xs text-white/70 leading-relaxed">Instant formulation pricing models with dynamic profit margin optimization.</p>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="border-t border-white/15 pt-5 flex items-center justify-between text-xs text-white/60">
            <span>© {new Date().getFullYear()} Nutralike Healthcare. All rights reserved.</span>
            <span>Version 2.4-Enterprise</span>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Login Form */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 sm:p-8 relative overflow-y-auto">
        
        {/* Subtle background ornamentation for mobile */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#7c9f43]/10 rounded-full blur-3xl pointer-events-none lg:hidden" />
        
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#e2ece0] p-6 sm:p-8 relative z-10 my-auto transition-all duration-300">
          
          {/* Mobile Header (Shown only on small screens) */}
          <div className="flex items-center gap-3 mb-6 lg:hidden pb-5 border-b border-[#f0f4ef]">
            <div className="w-10 h-10 rounded-xl bg-[#314f2d] flex items-center justify-center shadow-lg flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="Nutralike" 
                width={22} 
                height={22} 
                className="object-contain brightness-0 invert"
              />
            </div>
            <div>
              <span className="text-xl font-black tracking-widest text-[#314f2d] leading-none block">
                NUTRALIKE
              </span>
              <span className="text-[10px] text-[#7c9f43] font-semibold uppercase tracking-wider block mt-0.5">Admin Panel</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a] tracking-tight">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-[#555555]">
              Please sign in with your administrator credentials.
            </p>
          </div>
          

          {/* Error Message Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5 animate-shake">
              <ShieldAlert size={18} className="text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in">
              <ShieldCheck size={18} className="text-green-600 flex-shrink-0" />
              <span className="font-semibold">Authentication successful! Redirecting...</span>
            </div>
          )}

          {/* Main Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#373737]">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a3a29e] group-focus-within:text-[#314f2d] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#fbfdfb] border border-[#c3c3c3] rounded-xl text-xs sm:text-sm text-[#0a0a0a] placeholder:text-[#a3a29e] focus:outline-none focus:border-[#314f2d] focus:ring-4 focus:ring-[#314f2d]/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs sm:text-sm font-semibold text-[#373737]">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo Mode: Please use password "admin123"'); }} 
                   className="text-xs font-semibold text-[#7c9f43] hover:text-[#597a3e] hover:underline transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#a3a29e] group-focus-within:text-[#314f2d] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-[#fbfdfb] border border-[#c3c3c3] rounded-xl text-xs sm:text-sm text-[#0a0a0a] placeholder:text-[#a3a29e] focus:outline-none focus:border-[#314f2d] focus:ring-4 focus:ring-[#314f2d]/10 transition-all font-medium font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#a3a29e] hover:text-[#373737] transition-colors focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4.5 h-4.5 border-2 border-[#c3c3c3] rounded-md bg-white peer-checked:bg-[#314f2d] peer-checked:border-[#314f2d] group-hover:border-[#314f2d] transition-all flex items-center justify-center shadow-sm">
                    {rememberMe && <Check size={14} className="text-white stroke-[3]" />}
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#555555] group-hover:text-[#0a0a0a] transition-colors">
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl active:scale-[0.99] transition-all disabled:opacity-80 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group overflow-hidden relative"
              style={{ background: 'linear-gradient(90deg, #7c9f43 0%, #597a3e 100%)' }}
            >
              {isLoading || success ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          {/* Secure System Badge */}
          <div className="mt-6 pt-5 border-t border-[#f0f4ef] flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#888888] font-medium">
            <ShieldCheck size={16} className="text-[#7c9f43]" />
            <span>Secured by SSL & 256-Bit Advanced Encryption</span>
          </div>

        </div>

      </div>

    </div>
  );
}
