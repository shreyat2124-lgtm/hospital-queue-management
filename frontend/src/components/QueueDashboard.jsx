import React from 'react';
import { Link } from 'react-router-dom';

export default function QueueDashboard() {
  return (
    <div className="font-body-md text-on-surface antialiased bg-background min-h-screen flex flex-col w-full">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max-width mx-auto bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-gutter">
          <Link to="/" className="text-title-lg font-title-lg font-bold text-primary">Mediso</Link>
          <nav className="hidden md:flex gap-stack-lg ml-stack-lg">
            {/* Nav items can go here */}
          </nav>
        </div>
        <div className="flex items-center gap-stack-md">
          <span className="text-label-md font-label-md text-on-surface-variant hidden md:block">Welcome, Alex</span>
          <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="pt-[100px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto flex-grow w-full">
        
        {/* Header */}
        <div className="mb-stack-lg text-center md:text-left">
          <h1 className="text-headline-lg-mobile md:text-[32px] font-bold text-primary">Queue Status</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-stack-sm">Cardiology Department</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          
          {/* Left Column: Primary Status */}
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            
            {/* Digital Waiting Room Ticket */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-surface-container-lowest rounded-[18px] shadow-ambient border border-surface-variant p-stack-lg flex flex-col items-center justify-center text-center">
                <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-unit">Current Ticket</span>
                <div className="text-[48px] font-bold text-primary-container leading-none">A-12</div>
                <p className="text-label-sm font-label-sm text-outline mt-unit">Room A</p>
              </div>
              
              <div className="bg-secondary-fixed rounded-[18px] shadow-ambient-deep border-2 border-secondary p-stack-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
                <span className="text-label-md font-label-md text-secondary uppercase tracking-wider mb-unit">Your Ticket</span>
                <div className="text-[48px] font-bold text-primary leading-none">B-104</div>
                <div className="mt-stack-sm inline-flex items-center gap-unit px-3 py-1 rounded-full bg-white/50">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span className="text-label-sm font-label-sm text-on-surface">Checked in 09:15 AM</span>
                </div>
              </div>
            </div>

            {/* Split Panel Grid below */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {/* Wait Time Card */}
              <div className="bg-surface-container-lowest rounded-[18px] shadow-ambient border border-surface-variant p-stack-lg flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="text-label-md font-label-md text-on-surface-variant mb-stack-md">Estimated Wait</div>
                <div className="flex flex-col items-center justify-center py-stack-md">
                  <div className="text-[48px] font-bold text-primary leading-none">12</div>
                  <div className="text-[20px] font-medium text-secondary mt-unit">mins left</div>
                </div>
                <div className="text-label-sm font-label-sm text-outline flex items-center gap-1 mt-stack-md">
                  <span className="material-symbols-outlined text-[16px] animate-spin" style={{ animationDuration: '3s' }}>sync</span>
                  Live updates
                </div>
              </div>

              {/* Department Info Card */}
              <div className="bg-surface-container-lowest rounded-[18px] shadow-ambient border border-surface-variant p-stack-lg flex flex-col justify-between">
                <div className="flex items-center justify-between mb-stack-md">
                  <div className="w-12 h-12 rounded-full bg-error-container text-[#93000a] flex items-center justify-center">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-surface-container text-label-sm font-label-sm text-on-surface-variant">Floor 3</span>
                </div>
                <div>
                  <div className="text-label-md font-label-md text-on-surface-variant mb-unit">Department</div>
                  <div className="text-[20px] font-medium text-primary">Cardiology</div>
                  <p className="text-body-md font-body-md text-outline mt-stack-sm">Dr. Sarah Jenkins<br/>Consultation Room C</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Queue List */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-surface-container-lowest rounded-[18px] shadow-ambient border border-surface-variant p-stack-lg flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-stack-lg">
                <h3 className="text-[20px] font-medium text-primary">Today's Tokens</h3>
                <button className="text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">refresh</span>
                </button>
              </div>

              <div className="flex flex-col gap-stack-sm overflow-y-auto pr-2" style={{ maxHeight: '500px' }}>
                {/* Completed */}
                <div className="flex items-center justify-between p-stack-sm rounded-lg opacity-60">
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </div>
                    <span className="text-body-md font-body-md text-outline line-through">A-11</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-outline uppercase">Completed</span>
                </div>
                
                {/* In Progress */}
                <div className="flex items-center justify-between p-stack-sm rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    </div>
                    <span className="text-body-md font-body-md text-blue-900 font-bold">A-12</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-blue-700 uppercase">Serving</span>
                </div>
                
                <div className="h-px w-full bg-surface-variant my-unit"></div>
                
                {/* Next in Line */}
                <div className="flex items-center justify-between p-stack-sm rounded-lg">
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-outline-variant">
                      <span className="text-body-md font-body-md">B</span>
                    </div>
                    <span className="text-body-md font-body-md text-on-surface">B-103</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-secondary uppercase">Next in Line</span>
                </div>
                
                {/* User (Waiting) */}
                <div className="flex items-center justify-between p-stack-sm rounded-lg bg-secondary-fixed border border-secondary">
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                    </div>
                    <span className="text-body-md font-body-md text-primary font-bold">B-104 (You)</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-secondary uppercase">Waiting</span>
                </div>
                
                {/* Waiting */}
                <div className="flex items-center justify-between p-stack-sm rounded-lg opacity-70">
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-outline-variant border-dashed">
                      <span className="text-body-md font-body-md">C</span>
                    </div>
                    <span className="text-body-md font-body-md text-on-surface">C-22</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-outline uppercase">Waiting</span>
                </div>
              </div>
              
              <div className="mt-auto pt-stack-lg">
                <button className="w-full py-4 px-8 bg-secondary hover:bg-primary-container text-white rounded-[12px] text-label-md font-label-md transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-95">
                  <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                  Notify Me When Ready
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
