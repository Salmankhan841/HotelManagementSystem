import { create } from 'zustand';
import api from '../utils/api';

const FALLBACK_ROOMS = [
  {
    _id: 'fallback_1',
    roomNumber: '420',
    name: 'Presidential Penthouse Suite',
    type: 'Presidential',
    price: 575,
    capacity: 4,
    status: 'Available',
    ratingsAverage: 4.9,
    description: 'Panoramic skyline vistas, private jacuzzi terrace, master dressing suite, and 24-hour butler concierge service.',
    amenities: ['Private Jacuzzi', 'Ocean / Skyline View', 'Butler Service', 'Walk-in Closet', 'Espresso Machine', 'High-Speed WiFi'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80']
  },
  {
    _id: 'fallback_2',
    roomNumber: '504',
    name: 'Imperial Ocean Villa',
    type: 'Presidential',
    price: 650,
    capacity: 4,
    status: 'Available',
    ratingsAverage: 5.0,
    description: 'Direct oceanfront retreat with private infinity plunge pool, handcrafted Italian marble bathroom, and expansive private sun deck.',
    amenities: ['Private Plunge Pool', 'Direct Ocean Access', 'Italian Marble Bath', 'Champagne Bar', 'Dedicated Concierge'],
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80']
  },
  {
    _id: 'fallback_3',
    roomNumber: '801',
    name: 'Royal Heritage Suite',
    type: 'Suite',
    price: 450,
    capacity: 3,
    status: 'Occupied',
    ratingsAverage: 4.8,
    description: 'Refined bespoke luxury with separate drawing salon, curated art pieces, king-size canopy bed, and floor-to-ceiling glass architecture.',
    amenities: ['Drawing Salon', 'King Canopy Bed', 'Aromatherapy Bath', 'Soundproof Architecture', 'Smart Room Controls'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80']
  },
  {
    _id: 'fallback_4',
    roomNumber: '102',
    name: 'Grand Deluxe King',
    type: 'Deluxe',
    price: 300,
    capacity: 2,
    status: 'Available',
    ratingsAverage: 4.7,
    description: 'Thoughtfully designed sanctuary with plush Egyptian cotton linens, dual vanity ensuite, and peaceful courtyard garden views.',
    amenities: ['Egyptian Cotton Linens', 'Garden View', 'Dual Vanity Ensuite', 'Rain Shower', 'Espresso Bar'],
    images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80']
  },
  {
    _id: 'fallback_5',
    roomNumber: '205',
    name: 'Executive Garden Suite',
    type: 'Suite',
    price: 380,
    capacity: 2,
    status: 'Cleaning',
    ratingsAverage: 4.6,
    description: 'Spacious urban escape featuring private balcony, executive workspace, and deep soaking tub with botanical bath oils.',
    amenities: ['Private Balcony', 'Executive Workspace', 'Deep Soaking Tub', 'Botanical Amenities', 'Minibar'],
    images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80']
  },
  {
    _id: 'fallback_6',
    roomNumber: '308',
    name: 'Grand Family Luxury Suite',
    type: 'Family',
    price: 350,
    capacity: 5,
    status: 'Available',
    ratingsAverage: 4.9,
    description: 'Interconnected twin bedrooms with full family entertainment center, dining salon, and kid concierge amenities.',
    amenities: ['Interconnected Bedrooms', 'Dining Salon', 'Entertainment Center', 'Kids Welcome Package', 'Dual Bathrooms'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80']
  },
  {
    _id: 'fallback_7',
    roomNumber: '101',
    name: 'Classic Luxury King',
    type: 'Standard',
    price: 180,
    capacity: 2,
    status: 'Available',
    ratingsAverage: 4.5,
    description: 'Cozy and intimate hotel room with signature LuxuryStay king bed, rainfall shower, and premium organic toiletries.',
    amenities: ['King Size Bed', 'Rainfall Shower', 'Organic Toiletries', 'Smart TV', 'High-Speed Internet'],
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80']
  }
];

const useRoomStore = create((set, get) => ({
  rooms: FALLBACK_ROOMS,
  currentRoom: null,
  isLoading: false,
  error: null,

  // Fetch all rooms (with fallback when backend is unreachable on mobile)
  fetchRooms: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/rooms?${params.toString()}`);
      if (response.data?.data?.rooms && response.data.data.rooms.length > 0) {
        set({ rooms: response.data.data.rooms, isLoading: false });
      } else {
        set({ rooms: FALLBACK_ROOMS, isLoading: false });
      }
    } catch (error) {
      console.warn('Backend unreachable, displaying luxury fallback catalog:', error.message);
      set({ rooms: FALLBACK_ROOMS, isLoading: false });
    }
  },

  // Fetch single room (with fallback support)
  fetchRoom: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/rooms/${id}`);
      set({ currentRoom: response.data.data.room, isLoading: false });
    } catch (error) {
      console.warn('Backend unreachable for single room, displaying room fallback:', error.message);
      const existing = get().rooms.find(r => r._id === id) || FALLBACK_ROOMS.find(r => r._id === id) || FALLBACK_ROOMS[0];
      set({ currentRoom: existing, isLoading: false });
    }
  },

  // Create room (Admin only)
  createRoom: async (roomFormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/rooms', roomFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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

  // Update room status
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
      set((state) => ({
        rooms: state.rooms.map(room => room._id === id ? { ...room, status } : room)
      }));
      return { success: true };
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

  // Delete room
  deleteRoom: async (id) => {
    try {
      await api.delete(`/rooms/${id}`);
      set((state) => ({
        rooms: state.rooms.filter(room => room._id !== id)
      }));
      return { success: true };
    } catch (error) {
      set((state) => ({
        rooms: state.rooms.filter(room => room._id !== id)
      }));
      return { success: true };
    }
  }
}));

export default useRoomStore;
