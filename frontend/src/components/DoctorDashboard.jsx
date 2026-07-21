import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Video, CheckCircle, TestTube, Clock, Megaphone, MoreVertical } from 'lucide-react';

export default function DoctorDashboard() {
  return (
    <div className="text-on-surface font-body-md min-h-screen flex flex-col antialiased bg-transparent relative">
      {/* TopNavBar */}
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm w-full top-0 sticky z-50"
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max-width mx-auto">
          {/* Brand */}
          <Link to="/" className="font-brand text-headline-md font-bold text-primary dark:text-primary-fixed">
            Cura
          </Link>
          {/* Navigation Links */}
          <nav className="hidden md:flex gap-gutter items-center">
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-label-md text-label-md" to="/">Help</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-label-md text-label-md" to="#">Contact Support</Link>
          </nav>
          {/* Profile & Status */}
          <div className="flex items-center gap-stack-md">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-outline-variant/30 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-label-sm text-label-sm text-on-surface">Online</span>
              <ChevronDown className="text-outline w-4 h-4 ml-1 cursor-pointer" />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="font-label-md text-label-md text-on-surface">Dr. Sarah Jenkins</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Cardiology</div>
              </div>
              <img alt="Dr. Sarah Jenkins" className="w-10 h-10 rounded-full object-cover border border-outline-variant/30" src="/images/doctor_sarah_jenkins_1784582346157.jpg" />
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
            {/* Quick stats */}
            <div className="bg-white/70 backdrop-blur-xl rounded-lg px-4 py-2 shadow-premium-glass border border-white/50">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Waiting</span>
              <span className="font-title-lg text-title-lg text-primary font-bold">12</span>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Current Patient (Span 7) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 flex flex-col gap-stack-md"
          >
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex-grow flex flex-col relative overflow-hidden border border-white/50 group">
              {/* Subtle background decoration */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-fixed rounded-full opacity-20 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="flex justify-between items-start mb-stack-md relative z-10">
                <div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-secondary font-label-sm text-label-sm mb-2">
                    <Video className="w-4 h-4" /> Active Consultation
                  </span>
                  <div className="flex items-baseline gap-3">
                    <h2 className="font-display-lg text-display-lg text-primary">B-103</h2>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Time Elapsed</div>
                  <div className="font-title-lg text-title-lg text-primary font-mono animate-pulse">14:22</div>
                </div>
              </div>

              <div className="border-t border-b border-outline-variant/20 py-stack-md mb-stack-lg relative z-10 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Patient Details</h3>
                    <div className="font-headline-md text-headline-md text-primary mb-1">James Wilson</div>
                    <div className="font-body-md text-body-md text-on-surface">45 yrs &bull; Male &bull; ID: JW-8921</div>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant mb-1">Reported Symptoms</h3>
                    <div className="font-body-md text-body-md text-on-error-container bg-error-container/30 px-3 py-2 rounded-lg inline-block border border-error-container">
                      Chest tightness, shortness of breath
                    </div>
                  </div>
                </div>

                {/* Vitals placeholder area */}
                <div className="mt-stack-md grid grid-cols-3 gap-2">
                  <div className="bg-white/50 backdrop-blur-md rounded-xl p-3 border border-outline-variant/10 shadow-sm">
                    <div className="font-label-sm text-label-sm text-on-surface-variant">Heart Rate</div>
                    <div className="font-title-lg text-title-lg text-primary">88 <span className="text-[12px] text-on-surface-variant font-normal">bpm</span></div>
                  </div>
                  <div className="bg-white/50 backdrop-blur-md rounded-xl p-3 border border-outline-variant/10 shadow-sm">
                    <div className="font-label-sm text-label-sm text-on-surface-variant">Blood Pressure</div>
                    <div className="font-title-lg text-title-lg text-primary">135/85 <span className="text-[12px] text-on-surface-variant font-normal">mmHg</span></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-stack-md mt-auto relative z-10">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-secondary text-on-primary font-label-md text-label-md py-4 px-6 rounded-xl hover:bg-secondary-container transition-colors duration-200 flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Completed
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-white/50 backdrop-blur-md border-[1.5px] border-primary-container text-primary-container font-label-md text-label-md py-4 px-6 rounded-xl hover:bg-white transition-colors duration-200 flex justify-center items-center gap-2"
                >
                  <TestTube className="w-5 h-5" />
                  Transfer to Lab
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Up Next (Span 5) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass h-[calc(100vh-200px)] flex flex-col border border-white/50">
              <div className="flex justify-between items-center mb-stack-md">
                <h2 className="font-title-lg text-title-lg text-primary">Up Next</h2>
                <span className="font-label-sm text-label-sm text-secondary cursor-pointer hover:underline">View All</span>
              </div>

              {/* Next Patient Highlight */}
              <div className="bg-secondary-fixed/30 border border-secondary-fixed rounded-2xl p-4 mb-stack-md shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-title-lg text-title-lg text-secondary shadow-sm font-bold">
                      A
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-primary font-bold">A-110 &bull; Elena Ross</div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 5 min wait
                      </div>
                    </div>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-secondary text-white font-label-md text-label-md py-3 rounded-lg hover:bg-secondary-container transition-colors duration-200 flex justify-center items-center gap-2 shadow-sm"
                >
                  <Megaphone className="w-5 h-5" />
                  Call Next Patient
                </motion.button>
              </div>

              {/* Queue List */}
              <div className="flex flex-col gap-2 overflow-y-auto flex-grow pr-2" style={{ maxHeight: '400px' }}>
                {[
                  { token: 'B', id: 'B-104', name: 'Alex Reed', wait: '12 min' },
                  { token: 'C', id: 'C-22', name: 'Sarah Miller', wait: '18 min' },
                  { token: 'A', id: 'A-111', name: 'David Chen', wait: '25 min' },
                  { token: 'B', id: 'B-105', name: 'Maya Patel', wait: '30 min' }
                ].map((patient, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 backdrop-blur-md transition-colors duration-200 group cursor-pointer border border-transparent hover:border-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-variant/50 rounded-full flex items-center justify-center font-label-md text-label-md text-on-surface-variant group-hover:bg-white transition-colors">
                        {patient.token}
                      </div>
                      <div>
                        <div className="font-label-md text-label-md text-on-surface">{patient.id} &bull; {patient.name}</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">{patient.wait} wait</div>
                      </div>
                    </div>
                    <MoreVertical className="text-outline-variant group-hover:text-secondary transition-colors w-5 h-5" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
