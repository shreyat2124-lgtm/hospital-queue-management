import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Bell, Settings, Receipt, AlertTriangle, Heart, Baby, Brain, Bone, Droplet, Eye, History, Volume2, CheckCircle, BarChart3, Users, Clock4, X } from 'lucide-react';
import api from '../services/api';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [timeString, setTimeString] = useState('');
  const [departments, setDepartments] = useState([]);
  const [deptStats, setDeptStats] = useState({});
  const [dailyAnalytics, setDailyAnalytics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorsList, setDoctorsList] = useState([]);
  
  // Modal State
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [modalPriority, setModalPriority] = useState('NORMAL');
  const [modalForm, setModalForm] = useState({ patientEmail: '', doctorId: '', symptoms: '' });

  // Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch departments + doctors + queue stats
  const fetchAllData = async () => {
    try {
      const [deptRes, docRes, dailyRes, trendsRes] = await Promise.all([
        api.get('/departments'),
        api.get('/doctors'),
        api.get('/analytics/daily'),
        api.get('/analytics/trends')
      ]);

      setDepartments(deptRes.data.departments);
      setDailyAnalytics(dailyRes.data);
      setTrends(trendsRes.data);
      setDoctorsList(docRes.data.doctors);

      // For each doctor, fetch their queue status and group by department
      const stats = {};
      for (const doc of docRes.data.doctors) {
        try {
          const { data } = await api.get(`/queues/status/${doc.id}`);
          const deptName = doc.department;
          if (!stats[deptName]) {
            stats[deptName] = { totalWaiting: 0, totalCompleted: 0, doctorCount: 0 };
          }
          stats[deptName].totalWaiting += data.totalWaiting;
          stats[deptName].totalCompleted += data.totalCompleted;
          stats[deptName].doctorCount += 1;
        } catch (e) {
          // skip if queue fetch fails for this doctor
        }
      }
      setDeptStats(stats);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    socket.connect();
    socket.on('queue-update', () => {
      fetchAllData();
    });
    return () => socket.off('queue-update');
  }, []);

  const openTokenModal = (priority) => {
    setModalPriority(priority);
    setModalForm({ patientEmail: '', doctorId: doctorsList[0]?.id || '', symptoms: '' });
    setShowTokenModal(true);
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tokens/emergency', { ...modalForm, priority: modalPriority });
      setShowTokenModal(false);
      // Socket event will automatically refresh the data via queue-update
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate token');
    }
  };

  // Icon mapping
  const iconMap = {
    'Cardiology': <Heart className="text-secondary w-5 h-5 fill-secondary" />,
    'Neurology': <Brain className="text-secondary w-5 h-5" />,
    'Orthopedics': <Bone className="text-secondary w-5 h-5" />,
    'Pediatrics': <Baby className="text-secondary w-5 h-5 fill-secondary" />,
    'Dermatology': <Droplet className="text-secondary w-5 h-5 fill-secondary" />,
    'Ophthalmology': <Eye className="text-secondary w-5 h-5 fill-secondary" />,
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

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
          <button onClick={logout} className="font-label-sm text-on-surface-variant hover:text-red-500 transition-colors">Logout</button>
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
            <motion.div onClick={() => openTokenModal('NORMAL')} variants={item} className="md:col-span-2 bg-white/70 backdrop-blur-2xl rounded-[32px] p-[32px] shadow-premium-glass hover:shadow-premium-hover flex items-center justify-between hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden group border border-white/50">
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
            <motion.div onClick={() => openTokenModal('EMERGENCY')} variants={item} className="bg-error-container/90 backdrop-blur-xl rounded-[32px] p-[32px] shadow-premium-glass hover:shadow-premium-hover flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-error/20">
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
            </div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
            >
              {departments.map((dept, index) => {
                const stats = deptStats[dept.name] || { totalWaiting: 0, totalCompleted: 0, doctorCount: 0 };
                
                return (
                  <motion.div 
                    key={dept.id} 
                    variants={item} 
                    className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[32px] p-stack-lg flex flex-col justify-between shadow-premium-glass hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-title-lg text-title-lg font-semibold flex items-center gap-2 text-primary">
                          {iconMap[dept.name] || <Heart className="text-secondary w-5 h-5" />}
                          {dept.name}
                        </h4>
                        <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 ${
                          stats.totalWaiting > 10
                            ? 'bg-error/10 text-error border border-error/20'
                            : 'bg-success/10 text-emerald-600 border border-emerald-200'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${stats.totalWaiting > 10 ? 'bg-error' : 'bg-emerald-500'}`}></span>
                          {stats.totalWaiting > 10 ? 'Busy' : 'Normal'}
                        </span>
                      </div>
                      <div className="mb-6">
                        <span className="block font-label-sm text-label-sm uppercase tracking-wider mb-1 text-outline">Waiting</span>
                        <span className={`font-display-lg text-display-lg ${stats.totalWaiting > 10 ? 'text-error' : 'text-primary'}`}>
                          {stats.totalWaiting}<span className="text-title-lg ml-1 text-outline">patients</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t pt-4 border-outline-variant/30">
                      <div>
                        <span className="block font-label-sm text-label-sm text-outline">Doctors</span>
                        <span className="font-title-lg text-title-lg font-medium text-primary">{stats.doctorCount} Active</span>
                      </div>
                      <div>
                        <span className="block font-label-sm text-label-sm text-outline">Done Today</span>
                        <span className="font-title-lg text-title-lg font-medium text-primary">{stats.totalCompleted}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>
        </div>

        {/* Right Column: Analytics & Stats */}
        <motion.aside 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full xl:w-[400px] flex-shrink-0 flex flex-col gap-gutter"
        >
          {/* Today's Overview */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass border border-white/50 flex flex-col gap-4">
            <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
              <BarChart3 className="text-secondary w-6 h-6" />
              Today's Overview
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 flex flex-col">
                <span className="text-outline flex items-center gap-1 font-label-sm uppercase tracking-wider mb-2"><Users className="w-4 h-4"/> Patients</span>
                <span className="text-display-sm text-primary font-bold">{dailyAnalytics?.totalPatients || 0}</span>
                <span className="text-label-sm text-emerald-600 bg-emerald-100 w-fit px-2 py-0.5 rounded-full mt-1">Total Today</span>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 flex flex-col">
                <span className="text-outline flex items-center gap-1 font-label-sm uppercase tracking-wider mb-2"><CheckCircle className="w-4 h-4"/> Completed</span>
                <span className="text-display-sm text-secondary font-bold">{dailyAnalytics?.completed || 0}</span>
                <span className="text-label-sm text-secondary bg-secondary-container w-fit px-2 py-0.5 rounded-full mt-1">Consultations</span>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 flex flex-col col-span-2">
                <span className="text-outline flex items-center gap-1 font-label-sm uppercase tracking-wider mb-2"><Clock4 className="w-4 h-4"/> Avg Wait Time</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-display-sm text-error font-bold">{dailyAnalytics?.avgWaitMinutes || 0}</span>
                  <span className="text-title-md text-outline">minutes</span>
                </div>
                <span className="text-label-sm text-on-surface-variant mt-1">Busiest Hour: {dailyAnalytics?.busiestHour || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* 7-Day Trend (Simple CSS Bar Chart) */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass border border-white/50 flex-1 flex flex-col">
             <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2 mb-6">
              <History className="text-secondary w-6 h-6" />
              7-Day Patient Trend
            </h3>
            
            <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto border-b border-outline-variant/30 pb-2">
              {trends?.dailyData?.map((day, i) => {
                const maxVal = Math.max(...(trends?.dailyData?.map(d => d.totalPatients) || [1]), 1);
                const heightPct = Math.round((day.totalPatients / maxVal) * 100);
                return (
                  <div key={i} className="flex flex-col items-center justify-end h-full gap-2 group flex-1">
                    <span className="text-label-sm text-outline opacity-0 group-hover:opacity-100 transition-opacity">{day.totalPatients}</span>
                    <div 
                      className="w-full max-w-[32px] bg-secondary/80 hover:bg-secondary rounded-t-md transition-all duration-300"
                      style={{ height: `${heightPct}%`, minHeight: '4px' }}
                    ></div>
                    <span className="text-label-sm text-on-surface-variant">{day.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.aside>
      </main>

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-[32px] shadow-2xl p-stack-lg border ${modalPriority === 'EMERGENCY' ? 'bg-error-container/95 border-error/30 text-on-error-container' : 'bg-surface-container-lowest/95 border-outline-variant/30 text-on-surface'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm font-bold flex items-center gap-2">
                {modalPriority === 'EMERGENCY' ? <AlertTriangle className="text-error" /> : <Receipt className="text-secondary" />}
                {modalPriority === 'EMERGENCY' ? 'Emergency Token' : 'Generate Walk-in'}
              </h3>
              <button onClick={() => setShowTokenModal(false)} className="hover:opacity-70"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleTokenSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-label-sm mb-1 opacity-80">Patient Email (Must be registered)</label>
                <input required type="email" value={modalForm.patientEmail} onChange={e=>setModalForm({...modalForm, patientEmail: e.target.value})} className="w-full bg-white/50 border border-outline-variant rounded-xl px-4 py-2 focus:ring-2 focus:ring-secondary/50 outline-none text-on-surface" placeholder="patient@gmail.com" />
              </div>
              <div>
                <label className="block text-label-sm mb-1 opacity-80">Doctor</label>
                <select required value={modalForm.doctorId} onChange={e=>setModalForm({...modalForm, doctorId: parseInt(e.target.value)})} className="w-full bg-white/50 border border-outline-variant rounded-xl px-4 py-2 focus:ring-2 focus:ring-secondary/50 outline-none text-on-surface">
                  {doctorsList.map(doc => <option key={doc.id} value={doc.id}>{doc.name} ({doc.department})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-label-sm mb-1 opacity-80">Symptoms / Notes</label>
                <input required type="text" value={modalForm.symptoms} onChange={e=>setModalForm({...modalForm, symptoms: e.target.value})} className="w-full bg-white/50 border border-outline-variant rounded-xl px-4 py-2 focus:ring-2 focus:ring-secondary/50 outline-none text-on-surface" placeholder="e.g. Fever, chest pain..." />
              </div>
              <button type="submit" className={`mt-4 w-full py-3 rounded-xl font-title-md text-white shadow-sm transition-all ${modalPriority === 'EMERGENCY' ? 'bg-error hover:bg-error/90' : 'bg-primary hover:bg-primary/90'}`}>
                {modalPriority === 'EMERGENCY' ? 'Override Queue' : 'Print Token'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}