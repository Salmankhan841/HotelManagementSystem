import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Wifi, Tv, Coffee, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useRoomStore from '../store/useRoomStore';

const Rooms = () => {
  const { rooms, fetchRooms, isLoading } = useRoomStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const categories = ['All', 'Standard', 'Deluxe', 'Suite', 'Family', 'Presidential'];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || room.type === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#fdfdfd] min-h-screen pb-24 overflow-x-hidden">
      
      {/* Hero Header */}
      <section className="bg-gray-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-400 uppercase tracking-widest text-xs sm:text-sm font-semibold mb-3"
          >
            Sanctuary of Comfort
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-serif mb-4"
          >
            Our Accommodations
          </motion.h1>
          <p className="text-gray-400 text-sm sm:text-base font-light max-w-xl mx-auto">
            Discover bespoke suites featuring artisanal Italian furnishings, panoramic views, and dedicated concierge care.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar - Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border-t-4 border-gold-600 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search by suite name or room #..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold-600 transition-colors"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-all ${
                  category === cat 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gold-50 hover:text-gold-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Rooms Grid - 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-light">Loading suites...</div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8">
            <p className="text-gray-600 font-medium mb-4">No accommodations found matching your filter.</p>
            <button 
              onClick={() => { setSearchTerm(''); setCategory('All'); }}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-gold-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredRooms.map((room, index) => (
              <motion.div 
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  {room.images && room.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5000${room.images[0]}`} 
                      alt={room.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-serif">LuxuryStay Suite</div>
                  )}
                  
                  <div className="absolute top-4 right-4 bg-gray-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-white font-bold text-sm shadow-lg border border-white/10">
                    ${room.price} <span className="text-gold-400 font-normal text-xs uppercase tracking-wider">/ night</span>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold text-gray-900 uppercase tracking-widest">
                    {room.type}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-serif text-gray-900 group-hover:text-gold-600 transition-colors">{room.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                        <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                        <span>{room.ratingsAverage || 4.5}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 font-light leading-relaxed mb-4">
                      {room.description || "Experience the pinnacle of luxury and comfort in our thoughtfully designed spaces."}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-gold-600" /> {room.capacity} Guests</span>
                      <span className="flex items-center gap-1"><Wifi className="h-3.5 w-3.5 text-gold-600" /> Free WiFi</span>
                      <span className="flex items-center gap-1"><Tv className="h-3.5 w-3.5 text-gold-600" /> HD TV</span>
                    </div>

                    <Link 
                      to={`/rooms/${room._id}`} 
                      className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl uppercase tracking-[0.15em] text-xs font-bold hover:bg-gold-600 transition-colors shadow-sm"
                    >
                      <span>Explore & Book</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Rooms;
