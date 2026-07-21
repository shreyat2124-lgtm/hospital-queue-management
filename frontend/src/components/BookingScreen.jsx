import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, X, Check, Calendar, Clock, Sun, Sunset, Heart, CalendarCheck, ArrowRight } from 'lucide-react';

export default function BookingScreen() {
  const navigate = useNavigate();

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
        {/* Header & Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-stack-lg flex flex-col gap-stack-md"
        >
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary">Book a Consultation</h1>
          
          {/* Progress Bar */}
          <div className="flex items-center w-full max-w-3xl">
            {/* Step 1 */}
            <div className="flex flex-col items-start flex-1 relative">
              <div className="flex items-center w-full">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center font-label-sm text-label-sm z-10 shrink-0 shadow-sm">
                  <Check className="w-4 h-4" />
                </div>
                <div className="h-[2px] bg-secondary-container flex-grow ml-2 mr-2"></div>
              </div>
              <span className="font-label-sm text-label-sm text-primary mt-2">1. Department</span>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-start flex-1 relative">
              <div className="flex items-center w-full">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center font-label-sm text-label-sm z-10 ring-4 ring-secondary-container/20 shrink-0 shadow-sm">
                  2
                </div>
                <div className="h-[2px] bg-outline-variant/30 flex-grow ml-2 mr-2"></div>
              </div>
              <span className="font-label-sm text-label-sm text-secondary-container font-bold mt-2">2. Doctor & Time</span>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-start shrink-0 relative">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-md text-on-surface-variant flex items-center justify-center font-label-sm text-label-sm z-10 border border-outline-variant/30 shadow-sm">
                  3
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-2">3. Details</span>
            </div>
          </div>
        </motion.div>

        {/* Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left Column: Selection */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 flex flex-col gap-gutter"
          >
            
            {/* Date Selection Card */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass border border-white/50">
              <h2 className="font-title-lg text-title-lg text-primary mb-stack-md flex items-center gap-2">
                <Calendar className="text-secondary w-5 h-5" />
                Select Date
              </h2>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {/* Date Cards */}
                <motion.button whileHover={{ y: -4 }} className="shrink-0 w-[100px] h-[120px] rounded-2xl border-[1.5px] border-white/50 bg-white/50 flex flex-col items-center justify-center gap-2 transition-colors hover:border-secondary shadow-sm hover:shadow-md">
                  <span className="font-label-md text-label-md text-on-surface-variant">Mon</span>
                  <span className="font-headline-md text-headline-md text-primary">12</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Oct</span>
                </motion.button>
                {/* Active Date */}
                <motion.button whileHover={{ y: -4 }} className="shrink-0 w-[100px] h-[120px] rounded-2xl border-[2px] border-secondary-container bg-white flex flex-col items-center justify-center gap-2 shadow-premium-hover transform -translate-y-1">
                  <span className="font-label-md text-label-md text-secondary-container font-bold">Tue</span>
                  <span className="font-headline-md text-headline-md text-primary">13</span>
                  <span className="font-label-sm text-label-sm text-secondary-container">Oct</span>
                </motion.button>
                <motion.button whileHover={{ y: -4 }} className="shrink-0 w-[100px] h-[120px] rounded-2xl border-[1.5px] border-white/50 bg-white/50 flex flex-col items-center justify-center gap-2 transition-colors hover:border-secondary shadow-sm hover:shadow-md">
                  <span className="font-label-md text-label-md text-on-surface-variant">Wed</span>
                  <span className="font-headline-md text-headline-md text-primary">14</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Oct</span>
                </motion.button>
                <motion.button whileHover={{ y: -4 }} className="shrink-0 w-[100px] h-[120px] rounded-2xl border-[1.5px] border-white/50 bg-white/50 flex flex-col items-center justify-center gap-2 transition-colors hover:border-secondary shadow-sm hover:shadow-md">
                  <span className="font-label-md text-label-md text-on-surface-variant">Thu</span>
                  <span className="font-headline-md text-headline-md text-primary">15</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Oct</span>
                </motion.button>
                <button className="shrink-0 w-[100px] h-[120px] rounded-2xl border-[1.5px] border-outline-variant/30 bg-surface-container-lowest/30 flex flex-col items-center justify-center gap-2 transition-all opacity-50 cursor-not-allowed">
                  <span className="font-label-md text-label-md text-on-surface-variant">Fri</span>
                  <span className="font-headline-md text-headline-md text-primary">16</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Oct</span>
                </button>
              </div>
            </div>

            {/* Time Selection Card */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-stack-lg shadow-premium-glass border border-white/50">
              <h2 className="font-title-lg text-title-lg text-primary mb-stack-md flex items-center gap-2">
                <Clock className="text-secondary w-5 h-5" />
                Available Time Slots
              </h2>
              {/* Morning */}
              <div className="mb-stack-md">
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-3 flex items-center gap-2">
                  <Sun className="text-amber-500 w-5 h-5" />
                  Morning
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <button className="py-3 px-4 rounded-xl bg-white/50 border border-white/50 shadow-sm font-label-md text-label-md text-on-surface hover:border-secondary hover:shadow-md transition-all">09:00 AM</button>
                  <button className="py-3 px-4 rounded-xl bg-white/50 border border-white/50 shadow-sm font-label-md text-label-md text-on-surface hover:border-secondary hover:shadow-md transition-all">09:30 AM</button>
                  <button className="py-3 px-4 rounded-xl bg-white/50 border border-white/50 shadow-sm font-label-md text-label-md text-on-surface hover:border-secondary hover:shadow-md transition-all">10:00 AM</button>
                  {/* Active Slot */}
                  <button className="py-3 px-4 rounded-xl bg-secondary-container text-on-secondary font-label-md text-label-md shadow-md transition-transform active:scale-95">10:30 AM</button>
                  <button className="py-3 px-4 rounded-xl bg-white/50 border border-white/50 shadow-sm font-label-md text-label-md text-on-surface hover:border-secondary hover:shadow-md transition-all">11:00 AM</button>
                  <button className="py-3 px-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30 font-label-md text-label-md text-on-surface opacity-50 cursor-not-allowed">11:30 AM</button>
                </div>
              </div>
              
              {/* Afternoon */}
              <div>
                <h3 className="font-label-md text-label-md text-on-surface-variant mb-3 flex items-center gap-2 mt-stack-md">
                  <Sunset className="text-orange-500 w-5 h-5" />
                  Afternoon
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <button className="py-3 px-4 rounded-xl bg-white/50 border border-white/50 shadow-sm font-label-md text-label-md text-on-surface hover:border-secondary hover:shadow-md transition-all">01:00 PM</button>
                  <button className="py-3 px-4 rounded-xl bg-white/50 border border-white/50 shadow-sm font-label-md text-label-md text-on-surface hover:border-secondary hover:shadow-md transition-all">01:30 PM</button>
                  <button className="py-3 px-4 rounded-xl bg-white/50 border border-white/50 shadow-sm font-label-md text-label-md text-on-surface hover:border-secondary hover:shadow-md transition-all">02:00 PM</button>
                  <button className="py-3 px-4 rounded-xl bg-white/50 border border-white/50 shadow-sm font-label-md text-label-md text-on-surface hover:border-secondary hover:shadow-md transition-all">02:30 PM</button>
                  <button className="py-3 px-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30 font-label-md text-label-md text-on-surface opacity-50 cursor-not-allowed">03:00 PM</button>
                </div>
              </div>
            </div>
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
                    <p className="font-body-md text-body-md text-primary font-medium">Cardiology</p>
                  </div>
                </div>
                
                {/* Doctor */}
                <div className="flex items-start gap-4">
                  <img alt="Dr. Sarah Jenkins avatar" className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white" src="/images/doctor_sarah_jenkins_1784582346157.jpg" />
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Consultant</p>
                    <p className="font-body-md text-body-md text-primary font-medium">Dr. Sarah Jenkins</p>
                    <p className="font-label-sm text-label-sm text-secondary">Senior Cardiologist</p>
                  </div>
                </div>
                
                {/* Time */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary shadow-sm">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Date & Time</p>
                    <p className="font-body-md text-body-md text-primary font-medium">Tue 13 Oct, 2024</p>
                    <p className="font-label-sm text-label-sm text-secondary-container font-medium mt-1">10:30 AM</p>
                  </div>
                </div>
                
                {/* Fees */}
                <div className="mt-4 pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface-variant">Consultation Fee</span>
                  <span className="font-title-lg text-title-lg text-primary">$150.00</span>
                </div>
              </div>
              
              {/* CTA */}
              <motion.button 
                onClick={() => navigate('/queue')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-stack-lg bg-secondary-container text-on-secondary py-4 px-6 rounded-xl font-label-md text-label-md font-medium shadow-md hover:shadow-lg hover:bg-secondary transition-colors flex justify-center items-center gap-2"
              >
                Confirm & Generate Token
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <p className="text-center font-label-sm text-label-sm text-outline mt-3">You won't be charged yet</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
