import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Bell, Settings, Receipt, AlertTriangle, Heart, Baby, Brain, Bone, Droplet, Eye, History, Volume2, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Framer motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="text-on-background min-h-screen bg-transparent flex flex-col antialiased relative">
      {/* TopNavBar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-surface-container-lowest/70 backdrop-blur-2xl border-b border-outline-variant/30 shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20"
      >
        <div className="flex items-center gap-gutter">
          <Link to="/" className="font-brand text-headline-md font-bold text-primary dark:text-primary-fixed">Cura Command Center</Link>
          <nav className="hidden md:flex gap-stack-lg ml-stack-lg">
            <Link to="/admin-dashboard" className="font-title-lg text-title-lg text-secondary border-b-2 border-secondary pb-1 cursor-pointer active:opacity-80">Dashboard</Link>
            <Link to="/departments" className="font-title-lg text-title-lg text-on-surface-variant hover:text-secondary transition-colors cursor-pointer active:opacity-80">Departments</Link>
            <Link to="#" className="font-title-lg text-title-lg text-on-surface-variant hover:text-secondary transition-colors cursor-pointer active:opacity-80">Staffing</Link>
            <Link to="#" className="font-title-lg text-title-lg text-on-surface-variant hover:text-secondary transition-colors cursor-pointer active:opacity-80">Analytics</Link>
          </nav>
        </div>
        <div className="flex items-center gap-stack-lg">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input className="pl-10 pr-4 py-2 bg-white/50 backdrop-blur-md border-[1.5px] border-surface-dim rounded-[12px] focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all font-body-md text-body-md w-64 placeholder:text-outline-variant" placeholder="Search patient or token..." type="text" />
          </div>
          {/* Digital Clock */}
          <div className="hidden sm:flex items-center bg-white/50 backdrop-blur-md py-2 px-4 rounded-[12px] border border-outline-variant/30">
            <Clock className="text-secondary mr-2 w-5 h-5" />
            <span className="font-label-md text-label-md font-semibold text-primary tracking-wider">{timeString}</span>
          </div>
          {/* Trailing Icons */}
          <div className="flex items-center gap-stack-sm text-secondary">
            <button className="p-2 hover:bg-surface-container rounded-full transition-colors"><Clock className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-surface-container rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-surface-container rounded-full transition-colors"><Settings className="w-5 h-5" /></button>
          </div>
          <img alt="Administrator Profile" className="w-10 h-10 rounded-full object-cover border-2 border-surface-container-highest shadow-sm" src="/images/admin_headshot_1784658368965.jpg" />
        </div>
      </motion.header>

      {/* Main Layout */}
      <main className="pt-[100px] px-margin-mobile md:px-margin-desktop pb-section-gap max-w-container-max-width mx-auto flex flex-col xl:flex-row gap-gutter w-full relative z-10">
        {/* Left Column: Quick Actions & Bento Grid */}
        <div className="flex-1 flex flex-col gap-gutter">
          {/* Quick Actions */}
          <motion.section 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
          >
            {/* Generate Token Card */}
            <motion.div variants={item} className="md:col-span-2 bg-white/70 backdrop-blur-2xl rounded-[32px] p-[32px] shadow-premium-glass hover:shadow-premium-hover flex items-center justify-between hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden group border border-white/50">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary-container/20 rounded-full blur-3xl group-hover:bg-secondary-container/30 transition-colors"></div>
              <div>
                <h2 className="font-headline-md text-headline-md text-primary mb-2">Generate Walk-in Token</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Issue new queue ticket for unregistered patients.</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shadow-lg text-white">
                <Receipt className="w-8 h-8" />
              </div>
            </motion.div>
            
            {/* Emergency Override */}
            <motion.div variants={item} className="bg-error-container/90 backdrop-blur-xl rounded-[32px] p-[32px] shadow-premium-glass hover:shadow-premium-hover flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-error/20">
              <div className="flex justify-between items-start mb-4">
                <AlertTriangle className="text-error w-8 h-8" />
                <span className="px-3 py-1 bg-error/10 text-error rounded-full font-label-sm text-label-sm uppercase tracking-wider">Priority</span>
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-error-container font-semibold">Emergency Override</h2>
              </div>
            </motion.div>
          </motion.section>

          {/* Department Bento Grid */}
          <section>
            <div className="flex justify-between items-end mb-stack-md">
              <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Department Status</h3>
              <span className="font-label-md text-label-md text-secondary cursor-pointer hover:underline">View Details</span>
            </div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
            >
              {/* Cardiology */}
              <motion.div variants={item} className="bg-primary/90 backdrop-blur-xl text-on-primary rounded-[32px] p-stack-lg flex flex-col justify-between relative overflow-hidden shadow-premium-glass hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 border border-primary">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-title-lg text-title-lg font-semibold flex items-center gap-2"><Heart className="text-secondary w-5 h-5 fill-secondary" />Cardiology</h4>
                    <span className="bg-success/10 text-emerald-300 px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Normal
                    </span>
                  </div>
                  <div className="mb-6">
                    <span className="block font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider mb-1">Average Wait</span>
                    <span className="font-display-lg text-display-lg text-secondary-fixed">24<span className="text-title-lg text-secondary-fixed-dim ml-1">mins</span></span>
                  </div>
                  <div className="flex justify-between items-center border-t border-surface-tint/30 pt-4">
                    <div>
                      <span className="block font-label-sm text-label-sm text-primary-fixed-dim">Doctors on Shift</span>
                      <span className="font-title-lg text-title-lg font-medium">3 Active</span>
                    </div>
                    <div>
                      <span className="block font-label-sm text-label-sm text-primary-fixed-dim">Queue</span>
                      <span className="font-title-lg text-title-lg font-medium">12</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Pediatrics */}
              <motion.div variants={item} className="bg-primary/90 backdrop-blur-xl text-on-primary rounded-[32px] p-stack-lg flex flex-col justify-between relative overflow-hidden shadow-premium-glass hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 border border-primary">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-title-lg text-title-lg font-semibold flex items-center gap-2"><Baby className="text-secondary w-5 h-5 fill-secondary" />Pediatrics</h4>
                    <span className="bg-warning/10 text-amber-300 px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 border border-amber-500/30">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span> Busy
                    </span>
                  </div>
                  <div className="mb-6">
                    <span className="block font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider mb-1">Average Wait</span>
                    <span className="font-display-lg text-display-lg text-tertiary-fixed-dim">45<span className="text-title-lg text-primary-fixed-dim ml-1">mins</span></span>
                  </div>
                  <div className="flex justify-between items-center border-t border-surface-tint/30 pt-4">
                    <div>
                      <span className="block font-label-sm text-label-sm text-primary-fixed-dim">Doctors on Shift</span>
                      <span className="font-title-lg text-title-lg font-medium">4 Active</span>
                    </div>
                    <div>
                      <span className="block font-label-sm text-label-sm text-primary-fixed-dim">Queue</span>
                      <span className="font-title-lg text-title-lg font-medium">28</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {[
                { name: 'Neurology', wait: 15, docs: 2, queue: 5, icon: <Brain className="text-secondary w-5 h-5" />, status: 'Normal', color: 'emerald' },
                { name: 'Orthopedics', wait: 20, docs: 3, queue: 8, icon: <Bone className="text-secondary w-5 h-5" />, status: 'Normal', color: 'emerald' },
                { name: 'Dermatology', wait: 12, docs: 2, queue: 4, icon: <Droplet className="text-secondary w-5 h-5 fill-secondary" />, status: 'Normal', color: 'emerald' },
                { name: 'Ophthalmology', wait: 55, docs: 1, queue: 14, icon: <Eye className="text-secondary w-5 h-5 fill-secondary" />, status: 'Delayed', color: 'error' }
              ].map((dept, index) => (
                <motion.div key={index} variants={item} className="bg-white/70 backdrop-blur-xl rounded-[32px] p-stack-lg flex flex-col justify-between shadow-premium-glass hover:shadow-premium-hover border border-white/50 hover:-translate-y-1 transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-title-lg text-title-lg font-semibold text-primary flex items-center gap-2">{dept.icon}{dept.name}</h4>
                      {dept.status === 'Normal' ? (
                        <span className="bg-success/10 text-emerald-600 px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal
                        </span>
                      ) : (
                        <span className="bg-error/10 text-error px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 border border-error/20">
                          <span className="w-2 h-2 rounded-full bg-error"></span> Delayed
                        </span>
                      )}
                    </div>
                    <div className="mb-6">
                      <span className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Average Wait</span>
                      <span className={`font-display-lg text-display-lg ${dept.status === 'Normal' ? 'text-primary' : 'text-error'}`}>{dept.wait}<span className="text-title-lg text-outline ml-1">mins</span></span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-outline-variant/30 pt-4">
                    <div>
                      <span className="block font-label-sm text-label-sm text-outline">Doctors</span>
                      <span className="font-title-lg text-title-lg font-medium text-primary">{dept.docs} Active</span>
                    </div>
                    <div>
                      <span className="block font-label-sm text-label-sm text-outline">Queue</span>
                      <span className="font-title-lg text-title-lg font-medium text-primary">{dept.queue}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>

        {/* Right Column: Live Activity Log */}
        <motion.aside 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full xl:w-[400px] flex-shrink-0"
        >
          <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass border border-white/50 h-full max-h-[800px] flex flex-col">
            <div className="flex items-center gap-2 mb-stack-lg pb-4 border-b border-outline-variant/30">
              <History className="text-secondary w-6 h-6" />
              <h3 className="font-headline-md text-headline-md text-primary">Live Activity</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {[
                { icon: <Receipt className="w-4 h-4" />, title: 'Token A-12 Generated', subtitle: 'Cardiology Walk-in', time: 'Just now', bg: 'bg-secondary-container text-white', statusColor: 'text-secondary' },
                { icon: <Volume2 className="w-4 h-4" />, title: 'Dr. Chen called B-104', subtitle: 'Pediatrics • Room 3', time: '2 mins ago', bg: 'bg-surface-variant text-on-surface-variant border border-outline-variant/30', statusColor: 'text-outline' },
                { icon: <CheckCircle className="w-4 h-4" />, title: 'Consultation Completed', subtitle: 'Patient C-45 • Neurology', time: '5 mins ago', bg: 'bg-emerald-100 text-emerald-700 border border-emerald-200', statusColor: 'text-outline' },
                { icon: <AlertTriangle className="w-4 h-4" />, title: 'Emergency Admission', subtitle: 'Trauma Center • Code Blue', time: '12 mins ago', bg: 'bg-error-container text-on-error-container', statusColor: 'text-error' },
                { icon: <Receipt className="w-4 h-4" />, title: 'Token D-88 Generated', subtitle: 'Orthopedics Walk-in', time: '15 mins ago', bg: 'bg-secondary-container text-white', statusColor: 'text-outline' }
              ].map((log, index) => (
                <div key={index} className="flex gap-4 relative">
                  {index !== 4 && <div className="w-px h-full bg-outline-variant/50 absolute left-[15px] top-8"></div>}
                  <div className={`w-8 h-8 rounded-full ${log.bg} flex items-center justify-center flex-shrink-0 z-10`}>
                    {log.icon}
                  </div>
                  <div>
                    <p className="font-body-md text-body-md text-primary font-medium">{log.title}</p>
                    <p className="font-label-sm text-label-sm text-outline">{log.subtitle}</p>
                    <span className={`font-label-sm text-label-sm ${log.statusColor} block mt-1`}>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-3 bg-white/50 hover:bg-white text-primary font-label-md text-label-md rounded-[12px] transition-colors border border-outline-variant/30 shadow-sm">
              View Full History
            </button>
          </div>
        </motion.aside>
      </main>
    </div>
  );
}
