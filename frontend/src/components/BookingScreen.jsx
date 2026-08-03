import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, X, Check, Calendar, Clock, Sun, Sunset, Heart, CalendarCheck, ArrowRight, Loader2, Stethoscope } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookingScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ─── Data from backend ───────────────────────────────────
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // ─── User selections ────────────────────────────────────
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [symptoms, setSymptoms] = useState('');

  // ─── UI state ───────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  // ─── Fetch departments on mount ─────────────────────────
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/departments');
        setDepartments(data.departments);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // ─── Fetch doctors when department changes ──────────────
  useEffect(() => {
    if (!selectedDept) return;
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get(`/doctors?departmentId=${selectedDept.id}`);
        setDoctors(data.doctors);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      }
    };
    fetchDoctors();
  }, [selectedDept]);

  // ─── Book token ─────────────────────────────────────────
  const handleBooking = async () => {
    if (!selectedDoctor || !symptoms.trim()) {
      setError('Please select a doctor and describe your symptoms.');
      return;
    }
    setError('');
    setBooking(true);

    try {
      const { data } = await api.post('/tokens/book', {
        doctorId: selectedDoctor.id,
        symptoms: symptoms.trim(),
        priority: 'NORMAL',
      });
      setBookingResult(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Booking failed. Please try again.'
      );
    } finally {
      setBooking(false);
    }
  };

   // ─── Success screen ─────────────────────────────────────
  if (bookingResult) {
    return (
      <div className="antialiased min-h-screen flex flex-col items-center justify-center font-body-md bg-transparent text-on-background p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-12 shadow-premium-glass border border-white/50 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Token Booked!</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">Your queue token has been generated</p>

          <div className="bg-surface-container-low rounded-2xl p-6 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Token Number</span>
              <span className="font-bold text-primary text-2xl">#{bookingResult.tokenNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Doctor</span>
              <span className="font-medium text-primary">{bookingResult.doctor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Department</span>
              <span className="font-medium text-primary">{bookingResult.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Position in Queue</span>
              <span className="font-medium text-primary">#{bookingResult.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Est. Wait</span>
              <span className="font-bold text-secondary">{bookingResult.estimatedWaitMinutes} mins</span>
            </div>
          </div>

          <motion.button
            onClick={() => navigate('/queue')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-secondary-container text-on-secondary py-4 rounded-xl font-label-md text-label-md font-medium shadow-md hover:bg-secondary transition-colors flex justify-center items-center gap-2"
          >
            View Live Queue
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="antialiased min-h-screen flex flex-col font-body-md bg-transparent text-on-background relative">
      {/* Top Navigation */}
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-surface-container-lowest/70 backdrop-blur-2xl fixed top-0 w-full z-50 border-b border-outline-variant/30 shadow-sm transition-all duration-300 py-4 px-margin-mobile md:px-margin-desktop flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Activity className="text-primary w-6 h-6" />
          <span className="font-brand text-headline-md font-bold text-primary dark:text-primary-fixed">Cura</span>
        </div>
        <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-secondary transition-colors duration-300 flex items-center gap-1 font-label-md text-label-md">
          <X className="w-5 h-5" />
          <span className="hidden sm:inline">Cancel Booking</span>
        </button>
      </motion.header>
      
      {/* Main Content */}
      <main className="flex-grow pt-[100px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-stack-lg"
        >
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-2">Book a Consultation</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Select a department, choose your doctor, and join the queue</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-500 font-body-md text-body-md text-center mb-6"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left Column: Selection Steps */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 flex flex-col gap-gutter"
          >
            
            {/* Step 1: Department Selection */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass border border-white/50">
              <h2 className="font-title-lg text-title-lg text-primary mb-stack-md flex items-center gap-2">
                <Heart className="text-secondary w-5 h-5" />
                1. Select Department
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {departments.map((dept) => (
                  <motion.button
                    key={dept.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedDept(dept);
                      setSelectedDoctor(null);
                      setDoctors([]);
                    }}
                    className={`py-4 px-4 rounded-2xl border-[1.5px] font-label-md text-label-md transition-all shadow-sm hover:shadow-md text-left ${
                      selectedDept?.id === dept.id
                        ? 'border-secondary-container bg-white text-primary shadow-premium-hover font-bold'
                        : 'border-white/50 bg-white/50 text-on-surface hover:border-secondary'
                    }`}
                  >
                    {dept.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Step 2: Doctor Selection — only shows after department is picked */}
            {selectedDept && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass border border-white/50"
              >
                <h2 className="font-title-lg text-title-lg text-primary mb-stack-md flex items-center gap-2">
                  <Stethoscope className="text-secondary w-5 h-5" />
                  2. Choose Doctor
                </h2>
                {doctors.length === 0 ? (
                  <p className="text-on-surface-variant font-body-md">No doctors available in this department.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.map((doc) => (
                      <motion.button
                        key={doc.id}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`p-5 rounded-2xl border-[1.5px] text-left transition-all shadow-sm hover:shadow-md ${
                          selectedDoctor?.id === doc.id
                            ? 'border-secondary-container bg-white shadow-premium-hover'
                            : 'border-white/50 bg-white/50 hover:border-secondary'
                        }`}
                      >
                        <p className="font-title-lg text-title-lg text-primary font-bold">{doc.name}</p>
                        <p className="font-label-md text-label-md text-secondary">{doc.specialization}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                          ~{doc.avgConsultationMinutes} min per consultation
                          {doc.isAvailable ? (
                            <span className="text-green-600 ml-2">● Available</span>
                          ) : (
                            <span className="text-red-400 ml-2">● Unavailable</span>
                          )}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Symptoms — only shows after doctor is picked */}
            {selectedDoctor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass border border-white/50"
              >
                <h2 className="font-title-lg text-title-lg text-primary mb-stack-md flex items-center gap-2">
                  <Calendar className="text-secondary w-5 h-5" />
                  3. Describe Symptoms
                </h2>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Briefly describe your symptoms or reason for visit..."
                  rows={4}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all resize-none"
                />
              </motion.div>
            )}
          </motion.div>
          
          {/* Right Column: Summary Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 relative"
          >
            <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass sticky top-[100px] border border-white/50">
              <h3 className="font-title-lg text-title-lg text-primary mb-stack-md border-b border-outline-variant/20 pb-4">Booking Summary</h3>
              <div className="flex flex-col gap-stack-md">
                {/* Department */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-error-container/30 flex items-center justify-center text-error shadow-sm">
                    <Heart className="w-5 h-5 fill-error/20" />
                  </div>
                  
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Department</p>
                    <p className="font-body-md text-body-md text-primary font-medium">{selectedDept?.name || 'Not selected'}</p>
                  </div>
                </div>
                
                {/* Doctor */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary shadow-sm">
                    <Stethoscope className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Consultant</p>
                    <p className="font-body-md text-body-md text-primary font-medium">{selectedDoctor?.name || 'Not selected'}</p>
                    {selectedDoctor && (
                      <p className="font-label-sm text-label-sm text-secondary">{selectedDoctor.specialization}</p>
                    )}
                  </div>
                </div>
                
                {/* Symptoms */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary shadow-sm">
                    <CalendarCheck className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Symptoms</p>
                    <p className="font-body-md text-body-md text-primary font-medium">{symptoms || 'Not entered'}</p>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <motion.button 
                onClick={handleBooking}
                whileHover={{ scale: booking ? 1 : 1.02 }}
                whileTap={{ scale: booking ? 1 : 0.98 }}
                disabled={booking || !selectedDoctor || !symptoms.trim()}
                className="w-full mt-stack-lg bg-secondary-container text-on-secondary py-4 px-6 rounded-xl font-label-md text-label-md font-medium shadow-md hover:shadow-lg hover:bg-secondary transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    Confirm & Generate Token
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
              <p className="text-center font-label-sm text-label-sm text-outline mt-3">Token valid for today only</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
