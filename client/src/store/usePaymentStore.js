import { create } from 'zustand';
import api from '../utils/api';

const usePaymentStore = create((set) => ({
  isProcessing: false,
  error: null,
  lastReceipt: null,

  // Process Card Payment and finalize Booking
  processPayment: async (paymentPayload) => {
    set({ isProcessing: true, error: null, lastReceipt: null });
    try {
      const response = await api.post('/payment/process', paymentPayload);
      set({
        isProcessing: false,
        lastReceipt: response.data.data.receipt
      });
      return {
        success: true,
        booking: response.data.data.booking,
        receipt: response.data.data.receipt
      };
    } catch (error) {
      set({
        isProcessing: false,
        error: error.response?.data?.message || 'Payment processing failed'
      });
      return {
        success: false,
        error: error.response?.data?.message || 'Payment processing failed'
      };
    }
  },

  // Clear receipt
  clearReceipt: () => set({ lastReceipt: null, error: null })
}));

export default usePaymentStore;
