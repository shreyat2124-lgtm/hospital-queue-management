import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
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
            <div className="hidden md:flex gap-stack-md ml-stack-lg">
              <Link className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="#">Help</Link>
              <Link className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="#">Contact Support</Link>
            </div>
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
          {/* Subtle card glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-2xl rounded-full"></div>

          <div className="text-center mb-stack-lg relative z-10">
            <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-outline-variant/20">
              <ShieldCheck className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary-container mb-2">Welcome Back</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Sign in to access your dashboard</p>
          </div>

          <form className="flex flex-col gap-stack-md relative z-10">
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-primary-container font-medium" htmlFor="email">Email Address</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all focus-glow" 
                id="email" 
                placeholder="doctor@cura.com" 
                type="email" 
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-primary-container font-medium" htmlFor="password">Password</label>
                <Link className="font-label-sm text-label-sm text-secondary hover:underline" to="#">Forgot Password?</Link>
              </div>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all focus-glow" 
                id="password" 
                placeholder="••••••••" 
                type="password" 
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input 
                className="w-5 h-5 rounded-[4px] border-outline-variant text-secondary focus:ring-secondary cursor-pointer" 
                id="remember" 
                type="checkbox" 
              />
              <label className="font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="remember">Remember me for 30 days</label>
            </div>

            <motion.button 
              onClick={() => navigate('/admin-dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary-container text-white rounded-xl py-4 font-label-md text-label-md shadow-md hover:bg-primary transition-colors mt-4 flex justify-center items-center gap-2 group"
              type="button"
            >
              Sign In to Workspace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
          <div className="flex gap-stack-md font-label-sm text-label-sm text-on-surface-variant">
            <Link className="hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100" to="#">Terms of Service</Link>
            <Link className="hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100" to="#">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
