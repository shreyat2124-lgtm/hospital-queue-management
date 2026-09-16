import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, ShieldCheck, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();

  const { login, register } = useAuth();

  // Form state — tracks what the user types
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Called when form is submitted
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isRegister) {
        user = await register(name, email, password, 'PATIENT');
      } else {
        user = await login(email, password);
      }

      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin-dashboard');
          break;
        case 'DOCTOR':
          navigate('/doctor-dashboard');
          break;
        case 'PATIENT':
          navigate('/book-appointment');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
       (isRegister ? 'Registration failed. Please try again.' : 'Login failed. Please check your credentials.')
      );
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="font-body-md text-on-surface antialiased bg-background min-h-screen flex flex-col w-full relative">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary-fixed/30 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-fixed/30 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
      {/* Top Navigation */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-surface/60 backdrop-blur-xl shadow-sm border-b border-outline-variant/30 w-full top-0 z-50 sticky"
      >
        <div className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max-width mx-auto">
          <div className="flex items-center gap-stack-md">
            <Link className="font-brand text-headline-md font-bold text-primary flex items-center gap-2" to="/">
              <Activity className="w-8 h-8 text-secondary" />
              Cura
            </Link>
          </div>
          <div>
            <Link className="font-label-md text-label-md text-primary-container hover:text-secondary transition-colors duration-200" to="/">Back to Home</Link>
          </div>
        </div>
      </motion.nav>
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-section-gap px-margin-mobile md:px-margin-desktop z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-stack-lg md:p-12 shadow-premium-glass border border-white/50 w-full max-w-[500px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-2xl rounded-full"></div>
          <div className="text-center mb-stack-lg relative z-10">
            <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-outline-variant/20">
              {isRegister ? <UserPlus className="w-8 h-8 text-secondary" /> : <ShieldCheck className="w-8 h-8 text-secondary" />}
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary-container mb-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isRegister ? 'Register as a new patient' : 'Sign in to access your dashboard'}
            </p>
          </div>
          {/* Login / Register Toggle */}
          <div className="flex bg-surface-container-low rounded-xl p-1 mb-6 relative z-10">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all ${!isRegister ? 'bg-white shadow-sm text-primary font-semibold' : 'text-on-surface-variant'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all ${isRegister ? 'bg-white shadow-sm text-primary font-semibold' : 'text-on-surface-variant'}`}
            >
              Register
            </button>
          </div>
          <form className="flex flex-col gap-stack-md relative z-10" onSubmit={handleLogin}>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 font-body-md text-body-md text-center"
              >
                {error}
              </motion.div>
            )}
            {/* Name field — only shown during registration */}
            {isRegister && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-primary-container font-medium" htmlFor="name">Full Name</label>
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all focus-glow" 
                  id="name" 
                  placeholder="John Doe" 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                  disabled={loading}
                />
              </motion.div>
            )}
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-primary-container font-medium" htmlFor="email">Email Address</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all focus-glow" 
                id="email" 
                placeholder="patient@cura.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <label className="font-label-md text-label-md text-primary-container font-medium" htmlFor="password">Password</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all focus-glow" 
                id="password" 
                placeholder="••••••••" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <motion.button 
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-primary-container text-white rounded-xl py-4 font-label-md text-label-md shadow-md hover:bg-primary transition-colors mt-4 flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isRegister ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isRegister ? 'Create Patient Account' : 'Sign In to Workspace'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>
      {/* Footer */}
      <footer className="bg-surface/80 backdrop-blur-xl border-t border-outline-variant/30 full-width mt-auto z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-stack-lg max-w-container-max-width mx-auto gap-stack-md">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-secondary" />
            <div>
              <Link className="font-brand text-title-lg font-bold text-primary" to="/">Cura</Link>
              <p className="font-label-sm text-label-sm text-secondary mt-1">&copy; 2024 Cura Healthcare. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}