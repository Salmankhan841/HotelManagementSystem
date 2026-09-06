import { create } from 'zustand';
import api from '../utils/api';

const useBookingStore = create((set, get) => ({
  bookings: [],
  myBookings: [],
  isLoading: false,
  error: null,

  // Create a new booking (Guest)
  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/bookings', bookingData);
      set((state) => ({
        myBookings: [response.data.data.booking, ...state.myBookings],
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to create booking' });
      return { success: false, error: error.response?.data?.message || 'Failed to create booking' };
    }
  },

  // Fetch logged in user's bookings (Guest)
  fetchMyBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/bookings/my-bookings');
      set({ myBookings: response.data.data.bookings, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to fetch your bookings' });
    }
  },

  // Fetch all bookings (Admin/Manager)
  fetchAllBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/bookings');
      set({ bookings: response.data.data.bookings, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to fetch bookings' });
    }
  },

  // Update booking status (Admin/Manager)
  updateBookingStatus: async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      set((state) => ({
        bookings: state.bookings.map(booking => 
          booking._id === id ? { ...booking, status } : booking
        )
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update status' };
    }
  },

  // Cancel booking (Guest/Admin)
  cancelBooking: async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      // Update both lists just in case
      set((state) => ({
        bookings: state.bookings.map(booking => 
          booking._id === id ? { ...booking, status: 'Cancelled' } : booking
        ),
        myBookings: state.myBookings.map(booking => 
          booking._id === id ? { ...booking, status: 'Cancelled' } : booking
        )
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to cancel booking' };
    }
  }
}));

export default useBookingStore;
