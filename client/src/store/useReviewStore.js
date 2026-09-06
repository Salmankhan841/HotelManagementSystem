import { create } from 'zustand';
import api from '../utils/api';

const useReviewStore = create((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  // Fetch reviews for a specific room
  fetchRoomReviews: async (roomId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/reviews/room/${roomId}`);
      set({ reviews: response.data.data.reviews, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch reviews'
      });
    }
  },

  // Add a review
  addReview: async (reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/reviews', reviewData);
      set((state) => ({
        reviews: [response.data.data.review, ...state.reviews],
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to post review'
      });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to post review'
      };
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      set((state) => ({
        reviews: state.reviews.filter((r) => r._id !== reviewId)
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete review'
      };
    }
  }
}));

export default useReviewStore;
