import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Clock, RefreshCw, Activity, RefreshCcw, Check, Play, BellRing } from 'lucide-react';
import api from '../services/api';
import socket from '../services/socket';

export default function QueueDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        setDoctors(data.doctors);
        if (data.doctors.length > 0) {
          setSelectedDoctorId(data.doctors[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch queue status whenever selected doctor changes
  useEffect(() => {
    if (!selectedDoctorId) return;

    const fetchQueue = async () => {
      try {
        const { data } = await api.get(`/queues/status/${selectedDoctorId}`);
        setQueueData(data);
      } catch (err) {
        console.error('Failed to fetch queue:', err);
      }
    };
    fetchQueue();

    // Socket.io — listen for real-time queue updates
    const handleQueueUpdate = (payload) => {
      if (payload.doctorId === selectedDoctorId) {
        fetchQueue(); // Refetch when this doctor's queue changes
      }
    };
    socket.connect();
    socket.on('queue-update', handleQueueUpdate);

    return () => {
      socket.off('queue-update', handleQueueUpdate);
    };
  }, [selectedDoctorId]);


    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="font-body-md text-on-surface antialiased bg-transparent min-h-screen flex flex-col w-full relative">
      {/* Top Navigation */}
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-surface/70 backdrop-blur-2xl border-b border-outline-variant/30 shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16"
      >
        <div className="flex items-center gap-gutter">
          <Link to="/" className="font-brand text-title-lg font-bold text-primary">Cura</Link>
        </div>
        <div className="flex items-center gap-stack-md">
          <select
            value={selectedDoctorId || ''}
            onChange={(e) => setSelectedDoctorId(parseInt(e.target.value))}
            className="bg-white/50 border border-outline-variant/50 rounded-xl px-4 py-2 font-label-md text-label-md text-on-surface focus:outline-none focus:border-secondary"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name} — {doc.department}</option>
            ))}
          </select>
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
          <p className="text-body-md font-body-md text-on-surface-variant mt-stack-sm">
            {queueData ? `${queueData.department} Department — ${queueData.doctor}` : 'Select a doctor to view queue'}
          </p>
        </motion.div>

        {queueData && (
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
                  <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-unit">Now Serving</span>
                  <div className="text-[48px] font-bold text-primary-container leading-none">
                    {queueData.currentToken ? `#${queueData.currentToken}` : '—'}
                  </div>
                  <p className="text-label-sm font-label-sm text-outline mt-unit">
                    {queueData.currentToken ? 'In consultation' : 'No patient being served'}
                  </p>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} className="bg-secondary-fixed/90 backdrop-blur-xl rounded-[24px] shadow-premium-glass border-2 border-secondary p-stack-lg flex flex-col items-center justify-center text-center relative overflow-hidden hover:shadow-premium-hover transition-all">
                  <span className="text-label-md font-label-md text-secondary uppercase tracking-wider mb-unit">Waiting</span>
                  <div className="text-[48px] font-bold text-primary leading-none">{queueData.totalWaiting}</div>
                  <div className="mt-stack-sm inline-flex items-center gap-unit px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm shadow-sm">
                    <Check className="w-4 h-4" />
                    <span className="text-label-sm font-label-sm text-on-surface">{queueData.totalCompleted} completed today</span>
                  </div>
                </motion.div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {/* Estimated Wait */}
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-premium-glass border border-white/50 p-stack-lg flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-premium-hover transition-all">
                  <div className="text-label-md font-label-md text-on-surface-variant mb-stack-md">Estimated Wait</div>
                  <div className="flex flex-col items-center justify-center py-stack-md">
                    <div className="text-[48px] font-bold text-primary leading-none">
                      {queueData.queue.length > 0 ? queueData.queue[queueData.queue.length - 1].estimatedWaitMinutes : 0}
                    </div>
                    <div className="text-[20px] font-medium text-secondary mt-unit">mins</div>
                  </div>
                  <div className="text-label-sm font-label-sm text-outline flex items-center gap-1 mt-stack-md">
                    <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                    Live updates
                  </div>
                </motion.div>

                {/* Department Info */}
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-premium-glass border border-white/50 p-stack-lg flex flex-col justify-between hover:shadow-premium-hover transition-all">
                  <div className="flex items-center justify-between mb-stack-md">
                    <div className="w-12 h-12 rounded-full bg-error-container text-[#93000a] flex items-center justify-center shadow-sm border border-error-container">
                      <Activity className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <div className="text-label-md font-label-md text-on-surface-variant mb-unit">Department</div>
                    <div className="text-[20px] font-medium text-primary">{queueData.department}</div>
                    <p className="text-body-md font-body-md text-outline mt-stack-sm">{queueData.doctor}</p>
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
                  <h3 className="text-[20px] font-medium text-primary">Waiting Queue</h3>
                  <button
                    onClick={() => setSelectedDoctorId(prev => prev)}
                    className="text-secondary hover:text-primary transition-colors hover:rotate-180 transform duration-300"
                  >
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-stack-sm overflow-y-auto pr-2" style={{ maxHeight: '500px' }}>
                  {queueData.queue.length === 0 ? (
                    <div className="text-center py-12 text-on-surface-variant">
                      <p className="font-body-md">No patients waiting</p>
                      <p className="font-label-sm text-outline mt-2">Queue is empty</p>
                    </div>
                  ) : (
                    queueData.queue.map((token, i) => (
                      <div
                        key={token.tokenNumber}
                        className={`flex items-center justify-between p-stack-sm rounded-xl transition-colors ${
                          i === 0
                            ? 'bg-blue-50/80 backdrop-blur-sm border border-blue-200 shadow-sm'
                            : 'hover:bg-white/50'
                        }`}
                      >
                        <div className="flex items-center gap-stack-md">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                            i === 0 ? 'bg-blue-600 text-white' : 'bg-white border border-outline-variant'
                          }`}>
                            <span className="text-body-md font-body-md">#{token.tokenNumber}</span>
                          </div>
                          <div>
                            <span className="text-body-md font-body-md text-on-surface">{token.patientName}</span>
                            {token.priority !== 'NORMAL' && (
                              <span className="ml-2 text-label-sm font-label-sm text-red-500 uppercase">{token.priority}</span>
                            )}
                          </div>
                        </div>
                        <span className={`text-label-sm font-label-sm uppercase ${
                          i === 0 ? 'text-blue-700' : 'text-outline'
                        }`}>
                          {i === 0 ? 'Next' : `~${token.estimatedWaitMinutes}m`}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
