import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient'); // 'Patient' | 'Doctor' | 'Admin'

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Login attempt: ${email} as ${role}`);
    alert(`Signing in as ${role}...`);
  };

  return (
    <div className="flex-grow flex flex-col relative w-full h-full">
      {/* Top Navbar */}
      <nav className="bg-surface shadow-sm border-b border-outline-variant/30 w-full top-0 z-50">
        <div className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max-width mx-auto">
          <div className="flex items-center gap-stack-md">
            <Link className="font-headline-md text-headline-md font-bold text-primary" to="/">Mediso</Link>
            <div className="hidden md:flex gap-stack-md ml-stack-lg">
              <Link className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="#">Help</Link>
              <Link className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="#">Contact Support</Link>
            </div>
          </div>
          <div>
            <Link className="font-label-md text-label-md text-secondary font-bold hover:text-secondary transition-colors duration-200" to="/login">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero/Header Section */}
      <div className="hero-bg w-full h-[409px] absolute top-0 left-0 z-0 flex items-center justify-center">
        {/* Abstract background pattern placeholder for a premium feel */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>

      {/* Content Container */}
      <div className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-section-gap z-10 relative mt-[102px]">
        {/* Main Login Card */}
        <div className="bg-surface-container-lowest custom-shadow border border-outline-variant/30 rounded-[32px] w-full max-w-[480px] p-stack-lg md:p-[40px] flex flex-col gap-stack-lg">
          
          {/* Card Header */}
          <div className="text-center space-y-stack-sm">
            <h1 className="font-headline-lg text-headline-lg text-primary-container">Welcome Back</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Please enter your details to sign in.</p>
          </div>

          {/* Role Switcher */}
          <div className="flex bg-surface-container-low p-1 rounded-full w-full mx-auto">
            {['Patient', 'Doctor', 'Admin'].map(r => (
              <button 
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 px-4 rounded-full font-label-md text-label-md transition-all text-center ${role === r ? 'bg-surface-container-lowest text-primary-container shadow-sm' : 'text-on-surface-variant hover:text-primary-container'}`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="flex flex-col gap-unit">
              <label className="font-label-md text-label-md text-primary-container" htmlFor="email">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input 
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border-2 border-[#e2e8f0] rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus-glow transition-all duration-200" 
                  id="email" 
                  placeholder="Enter your email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-unit">
              <label className="font-label-md text-label-md text-primary-container" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input 
                  className="w-full pl-11 pr-11 py-3 bg-surface-container-lowest border-2 border-[#e2e8f0] rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus-glow transition-all duration-200" 
                  id="password" 
                  placeholder="Enter your password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end mt-1">
                <a className="font-label-md text-label-md text-[#8178ff] hover:underline" href="#">Forgot Password?</a>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className="w-full bg-[#14234c] hover:bg-[#14234c]/90 text-white font-label-md text-label-md py-4 px-8 rounded-xl mt-stack-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98]" 
              type="submit"
            >
              Sign In as {role}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-stack-sm">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account? <a className="font-label-md text-label-md text-[#8178ff] hover:underline ml-1" href="#">Sign Up</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <footer className="bg-surface border-t border-outline-variant/30 full-width mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-stack-lg max-w-container-max-width mx-auto gap-stack-md">
          <div>
            <Link className="font-headline-md text-headline-md font-bold text-primary" to="/">Mediso</Link>
            <p className="font-label-sm text-label-sm text-secondary mt-1">© 2024 Mediso Healthcare. All rights reserved.</p>
          </div>
          <div className="flex gap-stack-md font-label-sm text-label-sm text-on-surface-variant">
            <Link className="hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100" to="#">Terms of Service</Link>
            <Link className="hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100" to="#">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100" to="#">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
