import React, { useState, useEffect } from 'react';
import { 
  Building2, Clock, Percent, Shield, Save, 
  RefreshCw, CheckCircle2, Lock, Mail, Phone, MapPin, 
  Sparkles, CreditCard, ToggleLeft, ToggleRight, Loader2,
  Eye, EyeOff, BellRing, Bell
} from 'lucide-react';
import useSettingStore from '../../store/useSettingStore';
import useAuthStore from '../../store/useAuthStore';
import useNotificationStore from '../../store/useNotificationStore';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const { settings, fetchSettings, updateSettings, updateAdminProfile, isLoading } = useSettingStore();
  const { user, updateUser } = useAuthStore();
  const addNotification = useNotificationStore((state) => state.addNotification);

  const [activeTab, setActiveTab] = useState('hotel'); // 'hotel', 'policies', 'finance', 'profile'
  
  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  // Hotel & System Form State
  const [formData, setFormData] = useState({
    hotelName: '',
    contactEmail: '',
    contactPhone: '',
    hotelAddress: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    currency: 'USD ($)',
    taxRate: 15,
    serviceFee: 10,
    cancellationPolicy: '',
    enableInstantBooking: true,
    enableReviewAutoApprove: true,
    maintenanceMode: false
  });

  // Admin Profile / Password State
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        hotelName: settings.hotelName || 'LuxuryStay Hotel & Resort',
        contactEmail: settings.contactEmail || 'concierge@luxurystay.com',
        contactPhone: settings.contactPhone || '+1 (555) 123-4567',
        hotelAddress: settings.hotelAddress || '123 Luxury Avenue, Beverly Hills, CA 90210',
        checkInTime: settings.checkInTime || '15:00',
        checkOutTime: settings.checkOutTime || '11:00',
        currency: settings.currency || 'USD ($)',
        taxRate: settings.taxRate !== undefined ? settings.taxRate : 15,
        serviceFee: settings.serviceFee !== undefined ? settings.serviceFee : 10,
        cancellationPolicy: settings.cancellationPolicy || 'Free cancellation up to 48 hours prior to arrival date.',
        enableInstantBooking: settings.enableInstantBooking !== undefined ? settings.enableInstantBooking : true,
        enableReviewAutoApprove: settings.enableReviewAutoApprove !== undefined ? settings.enableReviewAutoApprove : true,
        maintenanceMode: settings.maintenanceMode || false
      });
    }
  }, [settings]);

  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        name: user.name || 'Salman Khan',
        email: user.email || 'salman321@gmail.com'
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const res = await updateSettings(formData);
    if (res.success) {
      toast.success(res.message || 'System settings saved successfully!');
      addNotification(
        'Hotel Settings Updated', 
        `Configuration updated for ${formData.hotelName || 'LuxuryStay'}.`,
        'system'
      );
    } else {
      toast.error(res.error || 'Failed to update settings');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      return toast.error('New password and confirm password do not match!');
    }

    if (profileForm.newPassword && profileForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setIsSavingProfile(true);
    const res = await updateAdminProfile({
      name: profileForm.name,
      email: profileForm.email,
      currentPassword: profileForm.currentPassword || undefined,
      newPassword: profileForm.newPassword || undefined
    });
    setIsSavingProfile(false);

    if (res.success) {
      toast.success(res.message || 'Admin profile updated successfully!');
      addNotification(
        'Admin Profile & Security Changed', 
        `Credentials updated for account ${profileForm.email}.`, 
        'security'
      );
      if (res.user && updateUser) {
        updateUser(res.user);
      }
      setProfileForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } else {
      toast.error(res.error || 'Failed to update profile');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hotel & System Configuration</h1>
          <p className="text-gray-500 text-sm">Manage global hotel brand details, booking policies, tax rates, notifications, and administrative credentials.</p>
        </div>
        <button
          onClick={fetchSettings}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm w-fit"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-gold-600' : ''}`} />
          <span>Reload Config</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-200/70 p-1 rounded-xl w-full sm:w-fit border border-gray-300/60 shadow-inner overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('hotel')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'hotel' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="h-4 w-4 text-gold-600" />
          <span>Hotel Identity</span>
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'policies' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Clock className="h-4 w-4 text-blue-600" />
          <span>Policies & Check-in</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'finance' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Percent className="h-4 w-4 text-emerald-600" />
          <span>Taxes & Automation</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'profile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Shield className="h-4 w-4 text-purple-600" />
          <span>Admin Profile & Security</span>
        </button>
      </div>

      {/* Tab 1: Hotel Brand & Identity */}
      {activeTab === 'hotel' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900">Hotel Brand & Contact Details</h2>
              <p className="text-xs text-gray-500 mt-0.5">These public details are displayed across customer receipts, invoices, and website headers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                  Hotel Name
                </label>
                <input
                  type="text"
                  required
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                  Base Operating Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                >
                  <option value="USD ($)">USD ($) - United States Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                  <option value="AED (AED)">AED (AED) - UAE Dirham</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gold-600" /> Concierge Email
                </label>
                <input
                  type="email"
                  required
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-gold-600" /> Front Desk Hotline
                </label>
                <input
                  type="text"
                  required
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gold-600" /> Physical Address
                </label>
                <input
                  type="text"
                  required
                  name="hotelAddress"
                  value={formData.hotelAddress}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50/70 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-gold-600 transition-colors shadow-md disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>Save Hotel Identity</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Policies & Check-in */}
      {activeTab === 'policies' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900">Standard Check-In & Cancellation Policies</h2>
              <p className="text-xs text-gray-500 mt-0.5">Define guest arrival timings, turnaround windows, and cancellation terms.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                  Standard Check-in Time
                </label>
                <input
                  type="time"
                  required
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                />
                <p className="text-[11px] text-gray-400 mt-1">Guests can register & receive keys from this time onward.</p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                  Standard Check-out Time
                </label>
                <input
                  type="time"
                  required
                  name="checkOutTime"
                  value={formData.checkOutTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                />
                <p className="text-[11px] text-gray-400 mt-1">Room must be vacated for housekeeping turn-around.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                  Cancellation & Refund Policy Statement
                </label>
                <textarea
                  rows="3"
                  required
                  name="cancellationPolicy"
                  value={formData.cancellationPolicy}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50/70 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-gold-600 transition-colors shadow-md disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>Save Stay Policies</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Taxes & Automation */}
      {activeTab === 'finance' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900">Financial Rates & Workflow Automation</h2>
              <p className="text-xs text-gray-500 mt-0.5">Configure booking fee percentages, Stripe checkout logic, and automated guest review rules.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                  State & Local Taxes (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  required
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50 font-bold"
                />
                <p className="text-[11px] text-gray-400 mt-1">Calculated automatically on checkout subtotal.</p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                  Resort & Service Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  required
                  name="serviceFee"
                  value={formData.serviceFee}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50 font-bold"
                />
                <p className="text-[11px] text-gray-400 mt-1">Hospitality service charge applied to reservation.</p>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              
              <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200/60">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Instant Stripe Confirmation</h4>
                  <p className="text-xs text-gray-500">Automatically confirm reservation status as soon as Stripe charge succeeds.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enableInstantBooking: !formData.enableInstantBooking })}
                  className={`text-2xl transition-colors ${formData.enableInstantBooking ? 'text-emerald-600' : 'text-gray-400'}`}
                >
                  {formData.enableInstantBooking ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200/60">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Auto-Approve Guest Reviews</h4>
                  <p className="text-xs text-gray-500">Immediately display verified guest feedback and calculate live star ratings.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enableReviewAutoApprove: !formData.enableReviewAutoApprove })}
                  className={`text-2xl transition-colors ${formData.enableReviewAutoApprove ? 'text-emerald-600' : 'text-gray-400'}`}
                >
                  {formData.enableReviewAutoApprove ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                </button>
              </div>

            </div>
          </div>

          <div className="p-6 bg-gray-50/70 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-gold-600 transition-colors shadow-md disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>Save Financial Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Admin Profile & Security */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900">Administrator Profile & Security</h2>
              <p className="text-xs text-gray-500 mt-0.5">Update your personal administrator display name, email, or change your secure login password.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Lock className="h-4 w-4 text-purple-600" />
                <span>Change System Password (Optional)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={profileForm.currentPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 pr-9 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      title={showCurrentPassword ? "Hide password" : "Show password"}
                    >
                      {showCurrentPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      value={profileForm.newPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 pr-9 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      title={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      placeholder="Repeat new password"
                      value={profileForm.confirmPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 pr-9 text-sm focus:ring-gold-500 focus:border-gold-500 bg-gray-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      title={showConfirmNewPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50/70 flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-md disabled:opacity-60"
            >
              {isSavingProfile ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>Update Credentials</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default AdminSettings;
