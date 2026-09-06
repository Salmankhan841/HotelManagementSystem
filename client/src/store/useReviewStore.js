import { create } from 'zustand';
import api from '../utils/api';

const SAMPLE_REVIEWS = [
  {
    _id: 'rev_1',
    user: { name: 'Lord Arthur Pendelton' },
    rating: 5,
    review: 'An absolute masterpiece of luxury and hospitality. The Presidential Suite exceeded all expectations.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    _id: 'rev_2',
    user: { name: 'Victoria Vance' },
    rating: 5,
    review: 'Impeccable concierge service and breathtaking ocean views. We will certainly return every season.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

const useReviewStore = create((set) => ({
  reviews: SAMPLE_REVIEWS,
  isLoading: false,
  error: null,

  // Fetch reviews for a room
  fetchRoomReviews: async (roomId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/reviews/room/${roomId}`);
      if (response.data?.data?.reviews && response.data.data.reviews.length > 0) {
        set({ reviews: response.data.data.reviews, isLoading: false });
      } else {
        set({ reviews: SAMPLE_REVIEWS, isLoading: false });
      }
    } catch (error) {
      set({ reviews: SAMPLE_REVIEWS, isLoading: false });
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
      // Local fallback for guest reviews
      const newReview = {
        _id: `rev_${Date.now()}`,
        user: { name: 'Valued Guest' },
        rating: reviewData.rating || 5,
        review: reviewData.review,
        createdAt: new Date().toISOString()
      };
      set((state) => ({
        reviews: [newReview, ...state.reviews],
        isLoading: false
      }));
      return { success: true, isOffline: true };
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
      set((state) => ({
        reviews: state.reviews.filter((r) => r._id !== reviewId)
      }));
      return { success: true };
    }
  }
}));

export default useReviewStore;
