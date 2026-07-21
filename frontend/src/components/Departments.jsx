import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Menu, Heart, Baby, Brain, Bone, Droplet, Eye } from 'lucide-react';

export default function Departments() {
  const navigate = useNavigate();
  return (
    <div className="text-on-surface antialiased selection:bg-secondary/20 selection:text-primary-container min-h-screen flex flex-col w-full relative">
      {/* TopNavBar */}
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-surface/70 backdrop-blur-2xl border-b border-outline-variant/30 shadow-sm w-full top-0 z-50 transition-all duration-300 sticky"
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max-width mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href='/'}>
            <Activity className="text-secondary w-8 h-8" />
            <span className="font-brand text-headline-md font-bold text-primary">Cura</span>
          </div>
          <nav className="hidden md:flex items-center gap-gutter">
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-label-md text-label-md" to="/">Home</Link>
            <Link className="text-secondary border-b-2 border-secondary pb-1 hover:text-secondary transition-colors duration-200 font-label-md text-label-md" to="/departments">Departments</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-label-md text-label-md" to="#">Contact Support</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link className="hidden md:block font-label-md text-label-md text-primary-container hover:text-secondary transition-colors duration-200" to="/login">Sign In</Link>
            <button onClick={() => navigate('/book-appointment')} className="bg-secondary text-white px-6 py-2.5 rounded-full font-label-md text-label-md hover:bg-secondary/90 transition-colors duration-200 active:scale-95 shadow-sm hidden md:block">
              Book Appointment
            </button>
            <button className="md:hidden text-primary-container">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative overflow-hidden z-10">
        {/* Specialized Departments Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <h2 className="font-headline-lg text-headline-lg text-primary-container mb-4">Our Specialized Departments</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Comprehensive care across a wide range of medical specialties, delivered by world-class experts.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {[
              { title: 'Cardiology', desc: 'Expert care for your heart, from routine checkups to advanced surgical procedures.', icon: <Heart className="w-6 h-6" /> },
              { title: 'Pediatrics', desc: 'Specialized medical attention for infants, children, and adolescents.', icon: <Baby className="w-6 h-6" /> },
              { title: 'Neurology', desc: 'Advanced diagnosis and treatment for disorders of the nervous system.', icon: <Brain className="w-6 h-6" /> },
              { title: 'Orthopedics', desc: 'Comprehensive care for bones, joints, and muscles to help you stay active.', icon: <Bone className="w-6 h-6" /> },
              { title: 'Dermatology', desc: 'Expert treatment for skin, hair, and nail conditions.', icon: <Droplet className="w-6 h-6" /> },
              { title: 'Ophthalmology', desc: 'Complete eye care services, from vision testing to complex surgeries.', icon: <Eye className="w-6 h-6" /> }
            ].map((dept, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white/70 backdrop-blur-xl rounded-[24px] p-8 shadow-premium-glass border border-white/50 hover:shadow-premium-hover transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                  {dept.icon}
                </div>
                <h3 className="font-title-lg text-title-lg text-primary-container font-semibold mb-2">{dept.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{dept.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Meet Our Specialists Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full mb-section-gap">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 shadow-premium-glass border border-white/50">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="font-headline-lg text-headline-lg text-primary-container mb-4">Meet Our Specialists</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Dedicated professionals committed to your health and well-being.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {[
                { name: 'Dr. Anya Sharma', specialty: 'Cardiology', img: '/images/doctor_anya_sharma_1784582327191.jpg' },
                { name: 'Dr. Arthur Evans', specialty: 'Pediatrics', img: '/images/doctor_arthur_evans_1784582336910.jpg' },
                { name: 'Dr. Sarah Jenkins', specialty: 'Surgery', img: '/images/doctor_sarah_jenkins_1784582346157.jpg' },
                { name: 'Dr. Michael Chen', specialty: 'Internal Medicine', img: '/images/doctor_michael_chen_1784582356065.jpg' }
              ].map((doc, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white/70 backdrop-blur-xl rounded-[24px] overflow-hidden shadow-premium-glass hover:shadow-premium-hover group border border-white transition-all duration-300"
                >
                  <div className="h-64 overflow-hidden">
                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-title-lg text-title-lg text-primary-container font-bold">{doc.name}</h3>
                    <p className="font-label-md text-label-md text-secondary mb-4">{doc.specialty}</p>
                    <button className="w-full py-2.5 border border-outline-variant text-primary-container rounded-full font-label-md text-label-md hover:bg-primary-container hover:text-white transition-colors">View Profile</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface/80 backdrop-blur-xl border-t border-outline-variant/30 mt-auto w-full z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max-width mx-auto gap-stack-md">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <Activity className="text-secondary w-6 h-6" />
            <span className="font-brand text-headline-md font-bold text-primary">Cura</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant text-center md:text-left">
            &copy; 2024 Cura Healthcare. All rights reserved.
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
