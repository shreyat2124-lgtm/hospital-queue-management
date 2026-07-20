import React from 'react';
import { Link } from 'react-router-dom';

export default function Departments() {
  return (
    <div className="bg-surface text-on-surface antialiased selection:bg-secondary/20 selection:text-primary-container min-h-screen flex flex-col w-full">
      {/* TopNavBar */}
      <header className="bg-surface border-b border-outline-variant/30 shadow-sm w-full top-0 z-50 transition-all duration-300">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max-width mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href='/'}>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            <span className="font-headline-md text-headline-md font-bold text-primary">Mediso</span>
          </div>
          <nav className="hidden md:flex items-center gap-gutter">
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-label-md text-label-md" to="/">Home</Link>
            <Link className="text-secondary border-b-2 border-secondary pb-1 hover:text-secondary transition-colors duration-200 font-label-md text-label-md" to="/departments">Departments</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-label-md text-label-md" to="#">Contact Support</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link className="hidden md:block font-label-md text-label-md text-primary-container hover:text-secondary transition-colors duration-200" to="/login">Sign In</Link>
            <button className="bg-secondary text-white px-6 py-2.5 rounded-full font-label-md text-label-md hover:bg-secondary/90 transition-colors duration-200 active:scale-95 shadow-sm hidden md:block">
              Book Appointment
            </button>
            <button className="md:hidden text-primary-container">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Specialized Departments Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full pt-20">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-primary-container mb-4">Our Specialized Departments</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Comprehensive care across a wide range of medical specialties, delivered by world-class experts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out group">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Cardiology</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Expert care for your heart, from routine checkups to advanced surgical procedures.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out group">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Pediatrics</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Specialized medical attention for infants, children, and adolescents in a friendly environment.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out group">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Neurology</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Advanced diagnosis and treatment for disorders of the nervous system and brain health.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out group">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>orthopedics</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Orthopedics</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Comprehensive care for bones, joints, and muscles to help you stay active and mobile.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out group">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dermatology</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Dermatology</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Expert treatment for skin, hair, and nail conditions using the latest medical technologies.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out group">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Ophthalmology</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Complete eye care services, from vision testing to complex ophthalmic surgeries.</p>
            </div>
          </div>
        </section>

        {/* Meet Our Specialists Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full bg-surface-container-low/50 rounded-[40px] mb-section-gap">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-primary-container mb-4">Meet Our Specialists</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Dedicated professionals committed to your health and well-being.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] overflow-hidden shadow-ambient hover:shadow-glass group border border-white transition-all duration-500 ease-out hover:-translate-y-2">
              <div className="h-64 overflow-hidden">
                <img src="/images/doctor_anya_sharma_1784582327191.jpg" alt="Dr. Anya Sharma" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-title-lg text-title-lg text-primary-container font-bold">Dr. Anya Sharma</h3>
                <p className="font-label-md text-label-md text-secondary mb-4">Cardiology</p>
                <button className="w-full py-2.5 border border-outline-variant text-primary-container rounded-full font-label-md text-label-md hover:bg-primary-container hover:text-white transition-colors">View Profile</button>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] overflow-hidden shadow-ambient hover:shadow-glass group border border-white transition-all duration-500 ease-out hover:-translate-y-2">
              <div className="h-64 overflow-hidden">
                <img src="/images/doctor_arthur_evans_1784582336910.jpg" alt="Dr. Arthur Evans" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-title-lg text-title-lg text-primary-container font-bold">Dr. Arthur Evans</h3>
                <p className="font-label-md text-label-md text-secondary mb-4">Pediatrics</p>
                <button className="w-full py-2.5 border border-outline-variant text-primary-container rounded-full font-label-md text-label-md hover:bg-primary-container hover:text-white transition-colors">View Profile</button>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] overflow-hidden shadow-ambient hover:shadow-glass group border border-white transition-all duration-500 ease-out hover:-translate-y-2">
              <div className="h-64 overflow-hidden">
                <img src="/images/doctor_sarah_jenkins_1784582346157.jpg" alt="Dr. Sarah Jenkins" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-title-lg text-title-lg text-primary-container font-bold">Dr. Sarah Jenkins</h3>
                <p className="font-label-md text-label-md text-secondary mb-4">Surgery</p>
                <button className="w-full py-2.5 border border-outline-variant text-primary-container rounded-full font-label-md text-label-md hover:bg-primary-container hover:text-white transition-colors">View Profile</button>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] overflow-hidden shadow-ambient hover:shadow-glass group border border-white transition-all duration-500 ease-out hover:-translate-y-2">
              <div className="h-64 overflow-hidden">
                <img src="/images/doctor_michael_chen_1784582356065.jpg" alt="Dr. Michael Chen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-title-lg text-title-lg text-primary-container font-bold">Dr. Michael Chen</h3>
                <p className="font-label-md text-label-md text-secondary mb-4">Internal Medicine</p>
                <button className="w-full py-2.5 border border-outline-variant text-primary-container rounded-full font-label-md text-label-md hover:bg-primary-container hover:text-white transition-colors">View Profile</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant/30 mt-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max-width mx-auto gap-stack-md">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            <span className="font-headline-md text-headline-md font-bold text-primary">Mediso</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant text-center md:text-left">
            © 2024 Mediso Healthcare. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" to="#">Terms of Service</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" to="#">Privacy Policy</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" to="#">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
