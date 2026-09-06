import { create } from 'zustand';
import api from '../utils/api';

const useRoomStore = create((set, get) => ({
  rooms: [],
  currentRoom: null,
  isLoading: false,
  error: null,

  // Fetch all rooms
  fetchRooms: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Convert filters to query string if needed
      const params = new URLSearchParams(filters);
      const response = await api.get(`/rooms?${params.toString()}`);
      set({ rooms: response.data.data.rooms, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to fetch rooms' });
    }
  },

  // Fetch single room
  fetchRoom: async (id) => {
    set({ isLoading: true, error: null, currentRoom: null });
    try {
      const response = await api.get(`/rooms/${id}`);
      set({ currentRoom: response.data.data.room, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to fetch room details' });
    }
  },

  // Create room (Admin only) - Requires FormData for image uploads
  createRoom: async (roomFormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/rooms', roomFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Add the new room to the current state
      set((state) => ({ 
        rooms: [response.data.data.room, ...state.rooms],
        isLoading: false 
      }));
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to create room' });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Update room status (Admin/Manager/Housekeeping)
  updateRoomStatus: async (id, status) => {
    try {
      const response = await api.put(`/rooms/${id}`, { status });
      set((state) => ({
        rooms: state.rooms.map(room => 
          room._id === id ? { ...room, status } : room
        ),
        currentRoom: state.currentRoom?._id === id ? { ...state.currentRoom, status } : state.currentRoom
      }));
      return { success: true, data: response.data.data.room };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update status' };
    }
  },

  // Update full room details
  updateRoom: async (id, roomData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/rooms/${id}`, roomData);
      set((state) => ({
        rooms: state.rooms.map(room => 
          room._id === id ? response.data.data.room : room
        ),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to update room' });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Delete room (Admin only)
  deleteRoom: async (id) => {
    try {
      await api.delete(`/rooms/${id}`);
      set((state) => ({
        rooms: state.rooms.filter(room => room._id !== id)
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete room' };
    }
  }
}));

export default useRoomStore;
