import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Wine, Sparkles, Compass, Calendar, Users, ShieldCheck, ChevronRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('All');

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/rooms');
  };

  return (
    <div className="w-full overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-gray-950 overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 z-0 opacity-50">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Palace Hotel" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ambient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 text-gold-400 mb-4 sm:mb-6 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold bg-gray-900/80 px-4 py-1.5 rounded-full border border-gold-400/30 backdrop-blur-sm"
          >
            <Star className="h-3.5 w-3.5 fill-gold-400" /> 5-Star Luxury Resort & Suites
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1] drop-shadow-xl"
          >
            Experience <br/> <span className="text-gold-400 italic">Unmatched</span> Elegance
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-base sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-2xl font-light drop-shadow-md px-2"
          >
            A sanctuary of sophisticated tranquility, curated for the modern connoisseur of fine living.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-4xl"
          >
            {/* Responsive Quick Reservation Bar */}
            <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-2xl border-t-4 border-gold-600 text-left text-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-gold-600" /> Check In
                </label>
                <input 
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-gold-600"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-gold-600" /> Check Out
                </label>
                <input 
                  type="date"
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-gold-600"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1.5 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-gold-600" /> Category
                </label>
                <select 
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-gold-600"
                >
                  <option value="All">All Suites</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gray-900 hover:bg-gold-600 text-white py-3 rounded-lg uppercase tracking-widest text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Find Room</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Intro Section - Responsive Asymmetrical */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#fdfdfd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            <div className="lg:w-1/2" data-aos="fade-right">
              <p className="text-gold-600 uppercase tracking-widest text-xs sm:text-sm font-semibold mb-3">Welcome to LuxuryStay</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight">
                A seamless blend of contemporary opulence and timeless grace.
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light mb-8">
                Nestled in an exclusive enclave, our sanctuary offers bespoke comfort. From our Michelin-caliber culinary craft to our customized wellness therapies, every moment is tuned to perfection.
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center gap-2 text-gray-900 uppercase tracking-widest text-xs font-bold border-b-2 border-gold-600 pb-1 hover:text-gold-600 transition-colors"
              >
                <span>Read Our Heritage</span>
                <ChevronRight className="h-4 w-4 text-gold-600" />
              </Link>
            </div>

            <div className="w-full lg:w-1/2 relative" data-aos="fade-left">
              <div className="aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Lobby details" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Curated Experiences - Responsive Cards */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-20" data-aos="fade-up">
            <p className="text-gold-400 uppercase tracking-widest text-xs sm:text-sm font-semibold mb-3">Indulge & Relax</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4">Curated Experiences</h2>
            <div className="w-20 h-0.5 bg-gold-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            
            <div className="group bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-gold-500/50 transition-all duration-300 flex flex-col" data-aos="fade-up" data-aos-delay="100">
              <div className="overflow-hidden mb-6 aspect-[4/3] rounded-xl">
                <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Dining" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              </div>
              <div className="p-2 bg-gold-400/10 w-fit rounded-lg mb-4 text-gold-400">
                <Wine className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif mb-2 text-white">Michelin Dining</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed flex-1">Savor exquisite culinary creations crafted by internationally acclaimed chefs.</p>
            </div>
            
            <div className="group bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-gold-500/50 transition-all duration-300 flex flex-col" data-aos="fade-up" data-aos-delay="200">
              <div className="overflow-hidden mb-6 aspect-[4/3] rounded-xl">
                <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Spa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              </div>
              <div className="p-2 bg-gold-400/10 w-fit rounded-lg mb-4 text-gold-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif mb-2 text-white">Holistic Spa & Thermal</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed flex-1">Rejuvenate your body and mind with bespoke aromatherapy and thermal plunge pools.</p>
            </div>

            <div className="group bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-gold-500/50 transition-all duration-300 flex flex-col sm:col-span-2 lg:col-span-1" data-aos="fade-up" data-aos-delay="300">
              <div className="overflow-hidden mb-6 aspect-[4/3] rounded-xl">
                <img src="https://images.unsplash.com/photo-1534430480872-3498386e7856?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Concierge" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              </div>
              <div className="p-2 bg-gold-400/10 w-fit rounded-lg mb-4 text-gold-400">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif mb-2 text-white">VIP Concierge Tours</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed flex-1">Discover elite experiences, private yacht charters, and hidden landmark access.</p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
