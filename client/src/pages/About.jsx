import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-[#fdfdfd] min-h-screen font-light text-gray-800 overflow-x-hidden">
      
      {/* Aesthetic Hero */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-16 sm:py-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80" 
            alt="Hotel facade" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold-400 uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold mb-4"
          >
            Our Heritage
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-serif text-white mb-6 leading-tight"
          >
            Redefining <br/><span className="italic text-gold-400">Hospitality</span> Since 1998.
          </motion.h1>
        </div>
      </section>

      {/* The Story - Responsive Asymmetrical Layout */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5 md:sticky top-32"
          >
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-4 sm:mb-6">A Legacy of Excellence</h2>
            <div className="w-16 h-0.5 bg-gold-600 mb-6 sm:mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-600 font-serif italic border-l-2 border-gold-600 pl-4">
              "We don't merely offer a place of rest; we craft an environment where every waking moment is an experience in refinement."
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-7 space-y-6 sm:space-y-8 text-base sm:text-lg text-gray-600 leading-relaxed font-light"
          >
            <p>
              Founded on the timeless principles of personalized service and uncompromising architectural grace, LuxuryStay began as a single boutique retreat. Our vision was steadfast: to cultivate a sanctuary that felt more like an aristocratic private residence than a hotel.
            </p>
            <p>
              Over the decades, we have continuously elevated the art of hospitality. Every texture, artisanal ornament, and culinary nuance is curated to evoke a sense of calm and subtle grandeur.
            </p>
            
            <div className="my-8 sm:my-12 aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80" 
                alt="Lobby details" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <p>
              Today, we welcome guests from across the globe into our distinguished community. From our Michelin-decorated culinary team to our dedicated concierges, our team ensures your journey is memorable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Responsive Stats/Values Banner */}
      <section className="bg-gray-950 text-white py-16 sm:py-24 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-center">
          <div className="p-4">
            <p className="text-4xl sm:text-5xl font-serif text-gold-400 mb-2">25+</p>
            <p className="uppercase tracking-widest text-xs sm:text-sm text-gray-400 font-medium">Years of Excellence</p>
          </div>
          <div className="p-4">
            <p className="text-4xl sm:text-5xl font-serif text-gold-400 mb-2">120</p>
            <p className="uppercase tracking-widest text-xs sm:text-sm text-gray-400 font-medium">Luxury Suites</p>
          </div>
          <div className="p-4">
            <p className="text-4xl sm:text-5xl font-serif text-gold-400 mb-2">3</p>
            <p className="uppercase tracking-widest text-xs sm:text-sm text-gray-400 font-medium">Michelin Stars</p>
          </div>
          <div className="p-4">
            <p className="text-4xl sm:text-5xl font-serif text-gold-400 mb-2">24/7</p>
            <p className="uppercase tracking-widest text-xs sm:text-sm text-gray-400 font-medium">Dedicated Service</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
