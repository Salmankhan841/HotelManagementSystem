import React, { useState, useEffect } from 'react';
import { 
  Search, Shield, User, RefreshCw, UserPlus, Trash2, 
  CheckCircle2, XCircle, Phone, Mail, Building2, Calendar, 
  DollarSign, BedDouble, X, Loader2, Sparkles, ShieldCheck,
  Eye, EyeOff
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

import useUserStore from '../../store/useUserStore';

const getRoleBadge = (role) => {
  switch (role) {
    case 'admin':
      return <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Shield className="h-3 w-3"/> Admin</span>;
    case 'manager':
      return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Building2 className="h-3 w-3"/> Manager</span>;
    case 'receptionist':
      return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold w-max">Receptionist</span>;
    case 'housekeeping':
      return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold w-max">Housekeeping</span>;
    default:
      return <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><User className="h-3 w-3"/> Guest</span>;
  }
};

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('guests');
  const { users, fetchUsers, isLoading, updateUserRole, deleteUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'receptionist',
    department: 'Front Desk',
    phone: ''
  });
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete ${name}'s account?`)) {
      try {
        await deleteUser(userId);
        toast.success('Account deleted successfully');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingStaff(true);
    try {
      const res = await api.post('/auth/staff', staffForm);
      toast.success(res.data?.message || 'Staff member registered successfully!');
      setIsStaffModalOpen(false);
      setStaffForm({
        name: '',
        email: '',
        password: '',
        role: 'receptionist',
        department: 'Front Desk',
        phone: ''
      });
      fetchUsers(); // Refresh list
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to register staff';
      toast.error(msg);
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  // Separate Users by Category (Defensive Array Checks)
  const safeUsersList = Array.isArray(users) ? users : [];
  const guestsList = safeUsersList.filter(u => u?.role === 'guest');
  const staffList = safeUsersList.filter(u => u?.role && ['admin', 'manager', 'receptionist', 'housekeeping', 'staff'].includes(u.role));

  const currentList = activeTab === 'guests' ? guestsList : staffList;

  const filteredList = currentList.filter(u => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return u?.name?.toLowerCase().includes(term) || 
           u?.email?.toLowerCase().includes(term) ||
           u?.phone?.toLowerCase().includes(term) ||
           u?.department?.toLowerCase().includes(term);
  });

  // Calculate quick stats
  const totalGuestSpend = guestsList.reduce((sum, g) => sum + (g?.totalSpent || 0), 0);
  const totalGuestBookings = guestsList.reduce((sum, g) => sum + (g?.totalBookings || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management Hub</h1>
          <p className="text-gray-500 text-sm">Manage separate databases for Hotel Staff & Registered Guests.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-gold-600' : ''}`} />
            <span>Refresh</span>
          </button>

          {activeTab === 'staff' && (
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-gold-600 transition-colors shadow-md"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Staff Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex bg-gray-200/70 p-1 rounded-xl w-full sm:w-fit border border-gray-300/60 shadow-inner">
        <button
          onClick={() => { setActiveTab('guests'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex-1 sm:flex-initial justify-center ${
            activeTab === 'guests'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className="h-4 w-4 text-gold-600" />
          <span>Guests & VIPs ({guestsList.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('staff'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex-1 sm:flex-initial justify-center ${
            activeTab === 'staff'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Shield className="h-4 w-4 text-purple-600" />
          <span>Hotel Staff ({staffList.length})</span>
        </button>
      </div>

      {/* Dynamic Summary Cards */}
      {activeTab === 'guests' ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Total Registered Guests</p>
            <h3 className="text-2xl font-bold text-gray-900">{guestsList.length} Accounts</h3>
            <p className="text-xs text-gold-600 mt-1 font-medium">Verified Client Profiles</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Total Reservations</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalGuestBookings} Bookings</h3>
            <p className="text-xs text-green-600 mt-1 font-medium">Recorded in System</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Cumulative Guest Revenue</p>
            <h3 className="text-2xl font-bold text-gold-700">${totalGuestSpend.toLocaleString()} USD</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">Stripe & Direct Payments</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Active Hotel Staff</p>
            <h3 className="text-2xl font-bold text-gray-900">{staffList.length} Team Members</h3>
            <p className="text-xs text-purple-600 mt-1 font-medium">With System Credentials</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Admins & Managers</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {staffList.filter(s => ['admin', 'manager'].includes(s.role)).length} Supervisors
            </h3>
            <p className="text-xs text-blue-600 mt-1 font-medium">Full Portal Access</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Departments Covered</p>
            <h3 className="text-2xl font-bold text-gray-900">Front Desk, Ops, Mgmt</h3>
            <p className="text-xs text-emerald-600 mt-1 font-medium">24/7 Hotel Operations</p>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder={`Search ${activeTab === 'guests' ? 'guests by name, email, or phone' : 'staff by name, email, or department'}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-gray-900 focus:border-gray-900 text-sm" 
            />
          </div>

          <div className="text-xs text-gray-400 font-medium">
            Showing {filteredList.length} of {currentList.length} {activeTab === 'guests' ? 'guests' : 'staff members'}
          </div>
        </div>

        {/* Dynamic Table: Guests View vs Staff View */}
        <div className="overflow-x-auto">
          {activeTab === 'guests' ? (
            /* GUESTS TABLE */
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Guest Name & Email</th>
                  <th className="px-6 py-4 font-semibold">Total Stays</th>
                  <th className="px-6 py-4 font-semibold">Total Spent</th>
                  <th className="px-6 py-4 font-semibold">Member Since</th>
                  <th className="px-6 py-4 font-semibold">Promote to Staff</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr><td colSpan="6" className="text-center py-8 text-gray-400">Loading guest profiles...</td></tr>
                )}
                {!isLoading && filteredList.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-8 text-gray-400">No guests found.</td></tr>
                )}
                {filteredList.map((g) => (
                  <tr key={g._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        <span>{g.name}</span>
                        {g.totalSpent > 1000 && (
                          <span className="bg-gold-100 text-gold-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-gold-300 flex items-center gap-1">
                            <Sparkles className="h-2.5 w-2.5" /> VIP
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{g.email}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                        {g.totalBookings || 0} {g.totalBookings === 1 ? 'Stay' : 'Stays'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 text-sm">
                        ${g.totalSpent || 0} USD
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(g.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={g.role}
                        onChange={(e) => handleRoleChange(g._id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-lg px-2.5 py-1 focus:ring-0 focus:outline-none cursor-pointer"
                      >
                        <option value="guest">Guest</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="housekeeping">Housekeeping</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(g._id, g.name)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete Guest Account"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* STAFF TABLE */
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Staff Member</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Role Level</th>
                  <th className="px-6 py-4 font-semibold">Change Role</th>
                  <th className="px-6 py-4 font-semibold">Joined Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr><td colSpan="6" className="text-center py-8 text-gray-400">Loading staff directory...</td></tr>
                )}
                {!isLoading && filteredList.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-8 text-gray-400">No staff members found.</td></tr>
                )}
                {filteredList.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.email}</div>
                      {s.phone && <div className="text-[11px] text-gray-400 font-mono mt-0.5">{s.phone}</div>}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-lg text-xs border border-gray-200">
                        {s.department || 'Operations'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {getRoleBadge(s.role)}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={s.role}
                        onChange={(e) => handleRoleChange(s._id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-lg px-2.5 py-1 focus:ring-0 focus:outline-none cursor-pointer"
                      >
                        <option value="receptionist">Receptionist</option>
                        <option value="housekeeping">Housekeeping</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                        <option value="guest">Demote to Guest</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(s._id, s.name)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Delete Staff Member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Staff Member Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900">Add New Staff Member</h3>
                <p className="text-xs text-gray-500 mt-0.5">Register a hotel employee with portal credentials</p>
              </div>
              <button 
                onClick={() => setIsStaffModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Aurelius"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. marcus.staff@luxurystay.com"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    System Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showStaffPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 pr-9 text-sm focus:ring-gold-500 focus:border-gold-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword(!showStaffPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      title={showStaffPassword ? "Hide password" : "Show password"}
                    >
                      {showStaffPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Role & Access Level *
                  </label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500"
                  >
                    <option value="receptionist">Receptionist (Front Desk)</option>
                    <option value="housekeeping">Housekeeping (Operations)</option>
                    <option value="manager">Manager (Full Oversight)</option>
                    <option value="admin">Administrator (Superuser)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={staffForm.department}
                    onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500"
                  >
                    <option value="Front Desk">Front Desk</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Concierge">Concierge</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Management">Management</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStaff}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-gold-600 transition-colors flex items-center gap-2 shadow-md disabled:opacity-60"
                >
                  {isSubmittingStaff ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
