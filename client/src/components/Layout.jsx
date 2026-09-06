import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import { MapPin, Phone, Mail, Globe, Share2, Compass, ArrowRight } from 'lucide-react';
import LuxuryLogo from './LuxuryLogo';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fdfdfd] text-gray-900 overflow-x-hidden">
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Toaster position="top-right" />
      
      {/* Luxury Responsive Footer */}
      <footer className="bg-gray-950 text-gray-400 pt-16 pb-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand Vision */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <LuxuryLogo variant="light" size="md" />
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                An international benchmark of luxury and refined tranquility. Experience bespoke hospitality curated for the discerning traveler.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="p-2.5 bg-gray-900 hover:bg-gold-600 hover:text-white rounded-full transition-colors text-gray-400">
                  <Globe className="h-4 w-4" />
                </a>
                <a href="#" className="p-2.5 bg-gray-900 hover:bg-gold-600 hover:text-white rounded-full transition-colors text-gray-400">
                  <Compass className="h-4 w-4" />
                </a>
                <a href="#" className="p-2.5 bg-gray-900 hover:bg-gold-600 hover:text-white rounded-full transition-colors text-gray-400">
                  <Share2 className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold-400 font-bold mb-5">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home Experience</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Heritage</Link></li>
                <li><Link to="/rooms" className="hover:text-white transition-colors">Suites & Accommodations</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Concierge & Contact</Link></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold-400 font-bold mb-5">Contact & Location</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                  <span>123 Luxury Avenue, Beverly Hills, CA 90210</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-gold-400 shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-gold-400 shrink-0" />
                  <span>concierge@luxurystay.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold-400 font-bold mb-5">Privilege Club</h4>
              <p className="text-xs text-gray-400 mb-4">Subscribe for exclusive seasonal offers and private events.</p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to LuxuryStay Newsletter!'); }} className="space-y-2">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2.5 px-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                  />
                  <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-gold-600 hover:bg-gold-500 text-white rounded-md transition-colors">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>

          </div>

          <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>&copy; {new Date().getFullYear()} LuxuryStay Hotel & Resort. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-400">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400">Terms of Service</a>
              <a href="#" className="hover:text-gray-400">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
