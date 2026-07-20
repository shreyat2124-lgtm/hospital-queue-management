import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const slides = [
    { id: 'hero-slide-0', title: 'Compassionate Care', subtitle: 'Patient-Centered', icon: 'favorite' },
    { id: 'hero-slide-1', title: 'Premium Facility', subtitle: 'Modern Environment', icon: 'domain' },
    { id: 'hero-slide-2', title: 'Expert Team', subtitle: 'Advanced Diagnostics', icon: 'science' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="bg-surface text-on-surface antialiased selection:bg-secondary/20 selection:text-primary-container min-h-screen flex flex-col w-full">
      {/* TopNavBar */}
      <header className="bg-surface border-b border-outline-variant/30 shadow-sm w-full top-0 z-50 transition-all duration-300">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max-width mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            <span className="font-headline-md text-headline-md font-bold text-primary">Mediso</span>
          </div>
          <nav className="hidden md:flex items-center gap-gutter">
            <Link className="text-secondary border-b-2 border-secondary pb-1 font-label-md text-label-md hover:text-secondary transition-colors duration-200" to="/">Home</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-label-md text-label-md" to="/departments">Departments</Link>
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
        {/* Hero Section */}
        <section className="relative pt-12 md:pt-24 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full z-10 flex-grow flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary-fixed/30 rounded-bl-[120px] -z-10 hidden md:block opacity-70"></div>
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-gutter items-center">
            {/* Left Column */}
            <div className="md:col-span-6 flex flex-col gap-stack-lg z-10">
              <div className="flex flex-col gap-stack-md">
                <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-1.5 rounded-full w-fit">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm text-primary-container uppercase tracking-wider">Premium Healthcare</span>
                </div>
                <h1 className="font-display-lg text-display-lg md:text-[56px] leading-[1.1] tracking-[-0.02em] text-primary-container font-bold max-w-xl">
                  A modern, <br/>
                  <span className="relative inline-block">
                    <span className="relative z-10 text-secondary">safe and effective</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-secondary-fixed/60 -z-10 rounded-sm"></span>
                  </span> <br/>
                  approach to well being.
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mt-2">
                  Experience healthcare that prioritizes your comfort and clarity. Our top-tier specialists are dedicated to providing personalized, composed, and reassuring medical attention.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4">
                <button className="bg-primary-container text-white px-8 py-4 rounded-[12px] font-label-md text-label-md hover:bg-primary-container/90 transition-all duration-300 active:scale-95 shadow-md flex items-center gap-2 group">
                  Book Now
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300 text-sm">arrow_forward</span>
                </button>
                <Link className="font-label-md text-label-md text-primary-container hover:text-secondary flex items-center gap-2 group transition-colors duration-200 py-4" to="/departments">
                  Learn more
                  <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors duration-200">play_circle</span>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-outline-variant/30">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" src="/images/doctor_anya_sharma_1784582327191.jpg" alt="Patient" />
                  <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" src="/images/doctor_michael_chen_1784582356065.jpg" alt="Patient" />
                  <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" src="/images/doctor_sarah_jenkins_1784582346157.jpg" alt="Professional" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-[#fbbf24]">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>star</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Trusted by 10,000+ patients</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-6 relative mt-12 md:mt-0 flex justify-center md:justify-end h-[500px] md:h-auto md:min-h-[500px]">
              
              <div className="relative w-full max-w-[400px] aspect-[4/5] z-10 group mt-8 md:mt-0 mr-4 md:mr-12">
                {[
                  { src: "/images/hero_slideshow_1_1784582297246.jpg", alt: "Compassionate Care" },
                  { src: "/images/hero_slideshow_2_1784582307527.jpg", alt: "Premium Facility" },
                  { src: "/images/hero_slideshow_3_1784582317532.jpg", alt: "Expert Features" }
                ].map((img, index) => {
                  const offset = (index - currentSlide + 3) % 3;
                  return (
                    <div 
                      key={index}
                      className={`absolute inset-0 w-full h-full rounded-[32px] overflow-hidden border-4 border-white bg-white/20 backdrop-blur-md transition-all duration-700 ease-out`}
                      style={{
                        zIndex: 30 - offset * 10,
                        transform: `translate(-${offset * 30}px, -${offset * 20}px) scale(${1 - offset * 0.05}) rotate(-${offset * 4}deg)`,
                        opacity: 1 - offset * 0.15,
                        boxShadow: '0 20px 40px rgba(20, 35, 76, 0.12)'
                      }}
                    >
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover object-center" />
                      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Profile Card */}
              <div className={`absolute bottom-12 -left-8 md:left-4 bg-white/70 backdrop-blur-md rounded-[20px] p-4 flex items-center gap-4 z-40 animate-[bounce_4s_infinite_alternate] shadow-lg border border-white/30 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-12 h-12 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary border border-secondary/20">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{slides[currentSlide].icon}</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md font-bold text-primary-container">{slides[currentSlide].title}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{slides[currentSlide].subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-primary-container mb-4">Comprehensive Care Ecosystem</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">We provide a holistic approach to your health, combining advanced technology with empathetic, expert care.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            <div className="md:col-span-2 bg-white rounded-[32px] p-8 shadow-sm relative overflow-hidden group flex flex-col justify-end border border-white hover:border-secondary-fixed/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-secondary-fixed/10 z-0"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-0"></div>
              <div className="relative z-10 flex flex-col gap-4 max-w-md">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm mb-2">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-primary-container font-semibold">Advanced Diagnostics</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">State-of-the-art imaging and diagnostic tools for precise, immediate understanding of your health status.</p>
              </div>
            </div>
            
            <div className="md:col-span-1 flex flex-col gap-6">
              <div className="flex-1 bg-surface-container-low rounded-[24px] p-6 shadow-sm relative overflow-hidden group hover:bg-surface-container transition-colors duration-300 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="font-title-lg text-[18px] text-primary-container font-medium">Virtual Consultations</h3>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-container shadow-sm group-hover:bg-secondary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                  </div>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-4">Connect with our specialists securely.</p>
              </div>
              <div className="flex-1 bg-primary-container rounded-[24px] p-6 shadow-lg relative overflow-hidden group flex flex-col justify-between text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/30 rounded-full blur-2xl -z-0"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <h3 className="font-title-lg text-[18px] font-medium">Patient Portal</h3>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
                  </div>
                </div>
                <p className="font-label-sm text-label-sm text-white/70 mt-4 relative z-10">Access records and results anytime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Specialized Departments Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-primary-container mb-4">Our Specialized Departments</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Comprehensive care across a wide range of medical specialties, delivered by world-class experts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Cardiology</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Expert care for your heart, from routine checkups to advanced surgical procedures.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Pediatrics</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Specialized medical attention for infants, children, and adolescents in a friendly environment.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Neurology</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Advanced diagnosis and treatment for disorders of the nervous system and brain health.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>orthopedics</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Orthopedics</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Comprehensive care for bones, joints, and muscles to help you stay active and mobile.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dermatology</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">Dermatology</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Expert treatment for skin, hair, and nail conditions using the latest medical technologies.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-ambient border border-white hover:shadow-glass hover:-translate-y-2 transition-all duration-500 ease-out">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6">
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
