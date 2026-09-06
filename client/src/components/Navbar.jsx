import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import LuxuryLogo from './LuxuryLogo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <LuxuryLogo variant="dark" size="md" />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`font-medium uppercase tracking-widest text-xs transition-colors py-1 ${
                  location.pathname === link.path
                    ? 'text-gold-600 border-b-2 border-gold-600'
                    : 'text-gray-600 hover:text-gold-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pl-6 flex items-center gap-4 border-l border-gray-200">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <UserIcon className="h-4 w-4 text-gold-600" />
                    <span className="font-medium text-xs max-w-[120px] truncate">{user?.name}</span>
                  </div>

                  <button 
                    onClick={handleLogout} 
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/login" 
                    className="text-gray-800 font-medium hover:text-gold-600 transition-colors text-xs uppercase tracking-widest px-3 py-2"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-gray-900 text-white px-5 py-2.5 hover:bg-gold-600 transition-colors duration-300 uppercase tracking-widest text-xs font-semibold shadow-sm"
                  >
                    Book Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                <UserIcon className="h-3.5 w-3.5 text-gold-600" />
                <span className="max-w-[80px] truncate">{user?.name}</span>
              </div>
            )}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              aria-label="Toggle navigation menu"
              className="p-2 text-gray-700 hover:text-gold-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-gold-50 text-gold-700 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-100 space-y-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link 
                  to="/login" 
                  className="w-full text-center py-3 border border-gray-300 rounded-lg text-xs font-semibold uppercase tracking-widest text-gray-800 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="w-full text-center py-3 bg-gray-900 text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-gold-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
