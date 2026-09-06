import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Bell,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import toast from 'react-hot-toast';
import LuxuryLogo, { LuxuryLogoIcon } from './LuxuryLogo';

const getNotifIcon = (type) => {
  switch (type) {
    case 'security':
      return <ShieldAlert className="h-4 w-4 text-purple-600" />;
    case 'booking':
      return <CalendarCheck className="h-4 w-4 text-emerald-600" />;
    case 'room':
      return <BedDouble className="h-4 w-4 text-blue-600" />;
    case 'staff':
      return <Users className="h-4 w-4 text-blue-600" />;
    case 'system':
      return <Sparkles className="h-4 w-4 text-gold-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getNotificationTarget = (n) => {
  switch (n.type) {
    case 'booking':
      return { path: '/admin/bookings', label: 'Reservations' };
    case 'room':
      return { path: '/admin/rooms', label: 'Room Inventory' };
    case 'staff':
    case 'guest':
    case 'users':
      return { path: '/admin/users', label: 'Guests & Staff' };
    case 'security':
    case 'system':
      return { path: '/admin/settings', label: 'System Settings' };
    default:
      if (n.title?.toLowerCase().includes('room')) return { path: '/admin/rooms', label: 'Room Inventory' };
      if (n.title?.toLowerCase().includes('reservation') || n.title?.toLowerCase().includes('booking') || n.title?.toLowerCase().includes('stripe')) return { path: '/admin/bookings', label: 'Reservations' };
      if (n.title?.toLowerCase().includes('staff') || n.title?.toLowerCase().includes('guest')) return { path: '/admin/users', label: 'Guests & Staff' };
      if (n.title?.toLowerCase().includes('setting') || n.title?.toLowerCase().includes('credential') || n.title?.toLowerCase().includes('password')) return { path: '/admin/settings', label: 'Settings' };
      return { path: '/admin', label: 'Dashboard' };
  }
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const { user, isAuthenticated, login, logout, isLoading: authLoading } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, clearAll, addNotification } = useNotificationStore();
  const navigate = useNavigate();

  // Admin Login Gatekeeper State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authError, setAuthError] = useState('');

  const isStaffOrAdmin = isAuthenticated && user && ['admin', 'manager', 'receptionist', 'housekeeping'].includes(user.role?.toLowerCase());

  useEffect(() => {
    if (isStaffOrAdmin) {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications();
      }, 15000); // 15s live sync
      return () => clearInterval(interval);
    }
  }, [isStaffOrAdmin, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthorizing(true);

    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPassword = adminPassword.trim();

    const res = await login(cleanEmail, cleanPassword);
    setIsAuthorizing(false);

    if (res.success) {
      // Re-check role from store
      const currentUser = useAuthStore.getState().user;
      if (currentUser && ['admin', 'manager', 'receptionist', 'housekeeping'].includes(currentUser.role)) {
        toast.success(`Welcome to Management Portal, ${currentUser.name}!`);
        addNotification(
          'Admin Session Authenticated',
          `${currentUser.name} (${currentUser.role}) accessed the management dashboard.`,
          'security'
        );
      } else {
        logout();
        setAuthError('Access Denied: Your account does not have administrative privileges.');
        toast.error('Access Denied: Administrative privileges required.');
      }
    } else {
      setAuthError(res.error || 'Authentication failed. Please check server connection.');
      toast.error(res.error || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    logout();
    setAdminEmail('');
    setAdminPassword('');
    toast.success('Signed out from Admin Portal.');
  };

  // If user is not an authenticated Admin / Staff, show the Admin Credentials Gatekeeper Login
  if (!isStaffOrAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full space-y-8 bg-gray-900/90 border border-gray-800 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <LuxuryLogo variant="light" size="lg" withLink={false} />
            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-xs">
              Management Portal • Enter authorized admin credentials to unlock the dashboard.
            </p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-xs text-red-400 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form className="mt-6 space-y-5" onSubmit={handleAdminLoginSubmit}>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1.5">
                Staff / Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@luxurystay.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-gray-950/70 border border-gray-700 text-white rounded-xl p-3.5 pl-10 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 placeholder:text-gray-500 transition-colors"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1.5">
                System Password
              </label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-gray-950/70 border border-gray-700 text-white rounded-xl p-3.5 pl-10 pr-10 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 placeholder:text-gray-500 transition-colors"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                  title={showAdminPassword ? "Hide password" : "Show password"}
                >
                  {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-950 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 focus:outline-none transition-all duration-200 shadow-lg shadow-gold-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAuthorizing ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span>Authorize & Enter Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Return to Public Website */}
          <div className="text-center pt-2">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gold-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Website</span>
            </Link>
          </div>

        </div>

      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Rooms Inventory', path: '/admin/rooms', icon: BedDouble },
    { name: 'Reservations', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Guests & Staff', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleNotificationClick = (n) => {
    markAsRead(n._id || n.id);
    setIsNotifOpen(false);
    const target = getNotificationTarget(n);
    navigate(target.path);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50 font-sans">
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Fixed Sticky Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-gray-900 text-white flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-5 bg-gray-950 border-b border-gray-800 flex-shrink-0">
          <LuxuryLogo variant="light" size="sm" />
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded-md"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Scrollable Nav & Footer */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto pb-6">
          <nav className="px-4 pt-6 space-y-1.5">
            <div className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Management</div>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-gold-600 text-white shadow-lg shadow-gold-600/20' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </NavLink>
            ))}
          </nav>

          <div className="px-4 space-y-3 pt-6 flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold text-gold-400 bg-gold-400/10 hover:bg-gold-400/20 transition-colors border border-gold-400/20"
            >
              View Public Website
            </Link>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-sm font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              aria-label="Open sidebar menu"
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="lg:hidden font-serif font-bold text-gray-900">Admin Portal</span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none"
                title="System Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-gold-400" />
                      <h3 className="text-sm font-bold">Activity Notifications</h3>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-gold-500/20 text-gold-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold-500/30">
                        {unreadCount} New
                      </span>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-400">
                        No notifications recorded.
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const target = getNotificationTarget(n);
                        return (
                          <div 
                            key={n._id || n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer group ${!n.isRead ? 'bg-gold-50/30' : ''}`}
                          >
                            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gold-100/50 mt-0.5 shrink-0 transition-colors">
                              {getNotifIcon(n.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className={`text-xs font-bold truncate ${!n.isRead ? 'text-gray-900 font-extrabold' : 'text-gray-600'}`}>
                                  {n.title}
                                </h4>
                                <span className="text-[10px] text-gray-400 shrink-0">
                                  {new Date(n.createdAt || n.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                {n.message}
                              </p>
                              <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-gold-600 group-hover:text-gold-700">
                                <span>Go to {target.label}</span>
                                <span className="transition-transform group-hover:translate-x-0.5">→</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                      <button
                        onClick={markAllAsRead}
                        className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100"
                      >
                        <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Mark Read</span>
                      </button>
                      <button
                        onClick={clearAll}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 px-2 py-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Clear All</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Profile Info */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="h-9 w-9 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center text-gold-800 font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-semibold text-gray-900 text-xs truncate max-w-[140px]">{user?.name || 'Administrator'}</p>
                <p className="text-gold-600 text-[10px] uppercase font-bold tracking-wider">{user?.role || 'Admin'}</p>
              </div>
            </div>

          </div>
        </header>

        {/* Page Body (Only this area scrolls!) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#fbfbfb]">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
