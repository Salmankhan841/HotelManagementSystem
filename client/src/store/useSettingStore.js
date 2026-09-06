import { create } from 'zustand';
import api from '../utils/api';

const useSettingStore = create((set) => ({
  settings: {
    hotelName: 'LuxuryStay Hotel & Resort',
    contactEmail: 'concierge@luxurystay.com',
    contactPhone: '+1 (555) 123-4567',
    hotelAddress: '123 Luxury Avenue, Beverly Hills, CA 90210',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    currency: 'USD ($)',
    taxRate: 15,
    serviceFee: 10,
    cancellationPolicy: 'Free cancellation up to 48 hours prior to arrival date.',
    enableInstantBooking: true,
    enableReviewAutoApprove: true,
    maintenanceMode: false
  },
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/settings');
      if (res.data?.data?.settings) {
        set({ settings: res.data.data.settings, isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to load settings' });
    }
  },

  updateSettings: async (newSettings) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/settings', newSettings);
      set({ settings: res.data.data.settings, isLoading: false });
      return { success: true, message: res.data?.message || 'Settings saved successfully' };
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to update settings' });
      return { success: false, error: error.response?.data?.message || 'Failed to update settings' };
    }
  },

  updateAdminProfile: async (profileData) => {
    try {
      const res = await api.put('/settings/profile', profileData);
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }
      return { 
        success: true, 
        message: res.data?.message || 'Credentials updated successfully', 
        user: res.data?.data?.user,
        token: res.data?.token
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to update credentials' 
      };
    }
  }
}));

export default useSettingStore;
