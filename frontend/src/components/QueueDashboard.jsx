import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Clock, RefreshCw, Activity, RefreshCcw, Check, Play, BellRing } from 'lucide-react';

export default function QueueDashboard() {
  return (
    <div className="font-body-md text-on-surface antialiased bg-transparent min-h-screen flex flex-col w-full relative">
      {/* Top Navigation */}
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-surface/70 backdrop-blur-2xl border-b border-outline-variant/30 shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max-width mx-auto"
      >
        <div className="flex items-center gap-gutter">
          <Link to="/" className="font-brand text-title-lg font-bold text-primary">Cura</Link>
          <nav className="hidden md:flex gap-stack-lg ml-stack-lg">
            {/* Nav items can go here */}
          </nav>
        </div>
        <div className="flex items-center gap-stack-md">
          <span className="text-label-md font-label-md text-on-surface-variant hidden md:block">Welcome, Alex</span>
          <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant hover:bg-surface-variant transition-colors shadow-sm">
            <User className="text-primary-container w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Main Canvas */}
      <main className="pt-[100px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto flex-grow w-full z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-stack-lg text-center md:text-left"
        >
          <h1 className="text-headline-lg-mobile md:text-[32px] font-bold text-primary">Queue Status</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-stack-sm">Cardiology Department</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          
          {/* Left Column: Primary Status */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 flex flex-col gap-gutter"
          >
            
            {/* Digital Waiting Room Ticket */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-premium-glass border border-white/50 p-stack-lg flex flex-col items-center justify-center text-center hover:shadow-premium-hover transition-all">
                <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-unit">Current Ticket</span>
                <div className="text-[48px] font-bold text-primary-container leading-none">A-12</div>
                <p className="text-label-sm font-label-sm text-outline mt-unit">Room A</p>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} className="bg-secondary-fixed/90 backdrop-blur-xl rounded-[24px] shadow-premium-glass border-2 border-secondary p-stack-lg flex flex-col items-center justify-center text-center relative overflow-hidden hover:shadow-premium-hover transition-all">
                <span className="text-label-md font-label-md text-secondary uppercase tracking-wider mb-unit">Your Ticket</span>
                <div className="text-[48px] font-bold text-primary leading-none">B-104</div>
                <div className="mt-stack-sm inline-flex items-center gap-unit px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm shadow-sm">
                  <Clock className="w-4 h-4" />
                  <span className="text-label-sm font-label-sm text-on-surface">Checked in 09:15 AM</span>
                </div>
              </motion.div>
            </div>

            {/* Split Panel Grid below */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {/* Wait Time Card */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-premium-glass border border-white/50 p-stack-lg flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-premium-hover transition-all">
                <div className="text-label-md font-label-md text-on-surface-variant mb-stack-md">Estimated Wait</div>
                <div className="flex flex-col items-center justify-center py-stack-md">
                  <div className="text-[48px] font-bold text-primary leading-none">12</div>
                  <div className="text-[20px] font-medium text-secondary mt-unit">mins left</div>
                </div>
                <div className="text-label-sm font-label-sm text-outline flex items-center gap-1 mt-stack-md">
                  <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                  Live updates
                </div>
              </motion.div>

              {/* Department Info Card */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-premium-glass border border-white/50 p-stack-lg flex flex-col justify-between hover:shadow-premium-hover transition-all">
                <div className="flex items-center justify-between mb-stack-md">
                  <div className="w-12 h-12 rounded-full bg-error-container text-[#93000a] flex items-center justify-center shadow-sm border border-error-container">
                    <Activity className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-label-sm font-label-sm text-on-surface-variant shadow-sm">Floor 3</span>
                </div>
                <div>
                  <div className="text-label-md font-label-md text-on-surface-variant mb-unit">Department</div>
                  <div className="text-[20px] font-medium text-primary">Cardiology</div>
                  <p className="text-body-md font-body-md text-outline mt-stack-sm">Dr. Sarah Jenkins<br/>Consultation Room C</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Queue List */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 flex flex-col"
          >
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-premium-glass border border-white/50 p-stack-lg flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-stack-lg">
                <h3 className="text-[20px] font-medium text-primary">Today's Tokens</h3>
                <button className="text-secondary hover:text-primary transition-colors hover:rotate-180 transform duration-300">
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-stack-sm overflow-y-auto pr-2" style={{ maxHeight: '500px' }}>
                {/* Completed */}
                <div className="flex items-center justify-between p-stack-sm rounded-xl opacity-60">
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline shadow-sm">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-body-md font-body-md text-outline line-through">A-11</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-outline uppercase">Completed</span>
                </div>
                
                {/* In Progress */}
                <div className="flex items-center justify-between p-stack-sm rounded-xl bg-blue-50/80 backdrop-blur-sm border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                    <span className="text-body-md font-body-md text-blue-900 font-bold">A-12</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-blue-700 uppercase">Serving</span>
                </div>
                
                <div className="h-px w-full bg-outline-variant/30 my-unit"></div>
                
                {/* Next in Line */}
                <div className="flex items-center justify-between p-stack-sm rounded-xl hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-outline-variant shadow-sm">
                      <span className="text-body-md font-body-md">B</span>
                    </div>
                    <span className="text-body-md font-body-md text-on-surface">B-103</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-secondary uppercase">Next in Line</span>
                </div>
                
                {/* User (Waiting) */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-stack-sm rounded-xl bg-secondary-fixed/80 backdrop-blur-md border border-secondary shadow-md cursor-pointer"
                >
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-inner">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-body-md font-body-md text-primary font-bold">B-104 (You)</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-secondary uppercase">Waiting</span>
                </motion.div>
                
                {/* Waiting */}
                <div className="flex items-center justify-between p-stack-sm rounded-xl opacity-70 hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-outline-variant border-dashed">
                      <span className="text-body-md font-body-md">C</span>
                    </div>
                    <span className="text-body-md font-body-md text-on-surface">C-22</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-outline uppercase">Waiting</span>
                </div>
              </div>
              
              <div className="mt-auto pt-stack-lg">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-8 bg-secondary hover:bg-primary-container text-white rounded-[12px] text-label-md font-label-md transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <BellRing className="w-5 h-5" />
                  Notify Me When Ready
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
