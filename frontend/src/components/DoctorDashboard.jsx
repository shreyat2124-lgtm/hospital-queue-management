import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Video, CheckCircle, TestTube, Clock, Megaphone, MoreVertical, Loader2, UserX } from 'lucide-react';
import api from '../services/api';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Fetch doctor's own queue
  const fetchMyQueue = async () => {
    try {
      const { data } = await api.get('/queues/my-queue');
      setQueueData(data);
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyQueue();

    // Listen for real-time updates
    socket.connect();
    socket.on('queue-update', () => {
      fetchMyQueue(); // Refetch whenever any queue event happens
    });

    return () => {
      socket.off('queue-update');
    };
  }, []);

  // Call next patient
  const handleCallNext = async () => {
    setCalling(true);
    try {
      await api.post('/queues/call-next');
      await fetchMyQueue(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to call next patient');
    } finally {
      setCalling(false);
    }
  };

  // Complete current consultation
  const handleComplete = async () => {
    if (!queueData?.currentPatient) return;
    setCompleting(true);
    try {
      await api.post('/queues/complete', {
        tokenId: queueData.currentPatient.tokenId,
      });
      await fetchMyQueue();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to complete consultation');
    } finally {
      setCompleting(false);
    }
  }; 

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="text-on-surface font-body-md min-h-screen flex flex-col antialiased bg-transparent relative">
      {/* TopNavBar */}
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm w-full top-0 sticky z-50"
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max-width mx-auto">
          <Link to="/" className="font-brand text-headline-md font-bold text-primary dark:text-primary-fixed">
            Cura
          </Link>
          <div className="flex items-center gap-stack-md">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-outline-variant/30 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-label-sm text-label-sm text-on-surface">Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="font-label-md text-label-md text-on-surface">{user?.name || 'Doctor'}</div>
              </div>
              <button onClick={logout} className="text-label-sm text-on-surface-variant hover:text-red-500 transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Canvas */}
      <main className="flex-grow px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max-width mx-auto w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-stack-lg flex justify-between items-end"
        >
          <div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Queue & Dashboard</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your consultations and patient flow.</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className="bg-white/70 backdrop-blur-xl rounded-lg px-4 py-2 shadow-premium-glass border border-white/50">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Waiting</span>
              <span className="font-title-lg text-title-lg text-primary font-bold">{queueData?.remainingCount || 0}</span>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-lg px-4 py-2 shadow-premium-glass border border-white/50">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Done</span>
              <span className="font-title-lg text-title-lg text-secondary font-bold">{queueData?.completedCount || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Current Patient */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 flex flex-col gap-stack-md"
          >
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex-grow flex flex-col relative overflow-hidden border border-white/50 group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-fixed rounded-full opacity-20 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
              
              {queueData?.currentPatient ? (
                <>
                  <div className="flex justify-between items-start mb-stack-md relative z-10">
                    <div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-secondary font-label-sm text-label-sm mb-2">
                        <Video className="w-4 h-4" /> Active Consultation
                      </span>
                      <div className="flex items-baseline gap-3">
                        <h2 className="font-display-lg text-display-lg text-primary">#{queueData.currentPatient.tokenNumber}</h2>
                      </div>
                    </div>
                    {queueData.currentPatient.priority !== 'NORMAL' && (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 font-label-sm text-label-sm uppercase">
                        {queueData.currentPatient.priority}
                      </span>
                    )}
                  </div>

                  <div className="border-t border-b border-outline-variant/20 py-stack-md mb-stack-lg relative z-10 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                      <div>
                        <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Patient</h3>
                        <div className="font-headline-md text-headline-md text-primary mb-1">{queueData.currentPatient.name}</div>
                      </div>
                      <div>
                        <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Reported Symptoms</h3>
                        <div className="font-body-md text-body-md text-on-error-container bg-error-container/30 px-3 py-2 rounded-lg inline-block border border-error-container">
                          {queueData.currentPatient.symptoms || 'No symptoms reported'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-stack-md mt-auto relative z-10">
                    <motion.button 
                      onClick={handleComplete}
                      disabled={completing}
                      whileHover={{ scale: completing ? 1 : 1.02 }}
                      whileTap={{ scale: completing ? 1 : 0.98 }}
                      className="flex-1 bg-secondary text-on-primary font-label-md text-label-md py-4 px-6 rounded-xl hover:bg-secondary-container transition-colors duration-200 flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {completing ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Completing...</>
                      ) : (
                        <><CheckCircle className="w-5 h-5" /> Mark as Completed</>
                      )}
                    </motion.button>
                  </div>
                </>
              ) : (
                /* No current patient */
                <div className="flex flex-col items-center justify-center py-16 relative z-10">
                  <UserX className="w-16 h-16 text-outline-variant mb-4" />
                  <h2 className="font-title-lg text-title-lg text-primary mb-2">No Active Consultation</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">Call the next patient to begin</p>
                  <motion.button
                    onClick={handleCallNext}
                    disabled={calling || queueData?.remainingCount === 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-secondary text-white font-label-md text-label-md py-4 px-8 rounded-xl hover:bg-secondary-container transition-colors flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {calling ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Calling...</>
                    ) : (
                      <><Megaphone className="w-5 h-5" /> Call Next Patient</>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Up Next */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass h-[calc(100vh-200px)] flex flex-col border border-white/50">
              <div className="flex justify-between items-center mb-stack-md">
                <h2 className="font-title-lg text-title-lg text-primary">Up Next</h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{queueData?.remainingCount || 0} patients</span>
              </div>

              {/* Next Patient Highlight */}
              {queueData?.upcoming?.length > 0 && (
                <div className="bg-secondary-fixed/30 border border-secondary-fixed rounded-2xl p-4 mb-stack-md shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-title-lg text-title-lg text-secondary shadow-sm font-bold">
                        #{queueData.upcoming[0].tokenNumber}
                      </div>
                      <div>
                        <div className="font-label-md text-label-md text-primary font-bold">{queueData.upcoming[0].name}</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">{queueData.upcoming[0].symptoms}</div>
                        {queueData.upcoming[0].priority !== 'NORMAL' && (
                          <span className="text-label-sm font-label-sm text-red-500 uppercase">{queueData.upcoming[0].priority}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!queueData?.currentPatient && (
                    <motion.button 
                      onClick={handleCallNext}
                      disabled={calling}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-secondary text-white font-label-md text-label-md py-3 rounded-lg hover:bg-secondary-container transition-colors duration-200 flex justify-center items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {calling ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Calling...</>
                      ) : (
                        <><Megaphone className="w-5 h-5" /> Call Next Patient</>
                      )}
                    </motion.button>
                  )}
                </div>
              )}

              {/* Queue List */}
              <div className="flex flex-col gap-2 overflow-y-auto flex-grow pr-2" style={{ maxHeight: '400px' }}>
                {queueData?.upcoming?.length === 0 ? (
                  <div className="text-center py-12 text-on-surface-variant">
                    <p className="font-body-md">Queue is empty</p>
                    <p className="font-label-sm text-outline mt-2">No patients waiting</p>
                  </div>
                ) : (
                  queueData?.upcoming?.slice(1).map((patient, i) => (
                    <motion.div 
                      key={patient.tokenNumber}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 backdrop-blur-md transition-colors duration-200 group cursor-pointer border border-transparent hover:border-white shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-variant/50 rounded-full flex items-center justify-center font-label-md text-label-md text-on-surface-variant group-hover:bg-white transition-colors">
                          #{patient.tokenNumber}
                        </div>
                        <div>
                          <div className="font-label-md text-label-md text-on-surface">{patient.name}</div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant">{patient.symptoms}</div>
                        </div>
                      </div>
                      {patient.priority !== 'NORMAL' && (
                        <span className="text-label-sm font-label-sm text-red-500 uppercase">{patient.priority}</span>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
  
}
