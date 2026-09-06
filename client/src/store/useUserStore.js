import { create } from 'zustand';
import api from '../utils/api';

const INITIAL_USERS = [
  { _id: 'u_1', name: 'Salman Khan', email: 'salman321@gmail.com', phone: '+1 (555) 123-4567', role: 'admin', department: 'Management', isActive: true, createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { _id: 'u_2', name: 'Asad Khan', email: 'asalooz324@gmail.com', phone: '+1 (555) 999-0000', role: 'admin', department: 'Management', isActive: true, createdAt: new Date(Date.now() - 86400000 * 9).toISOString() },
  { _id: 'u_3', name: 'Raja Farooq', email: 'raja123@gmail.com', phone: '+1 (555) 234-5678', role: 'manager', department: 'Front Desk', isActive: true, createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { _id: 'u_4', name: 'Rafay', email: 'rafay123@gmail.com', phone: '0312654789', role: 'manager', department: 'Management', isActive: true, createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { _id: 'u_5', name: 'Alexander Sterling', email: 'alexander.ops@luxurystay.com', phone: '+1 (555) 901-2345', role: 'manager', department: 'Operations', isActive: true, createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { _id: 'u_6', name: 'Elena Rostova', email: 'elena.concierge@luxurystay.com', phone: '+1 (555) 345-6789', role: 'receptionist', department: 'Front Desk', isActive: true, createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { _id: 'u_7', name: 'Sofia Al-Mansoor', email: 'sofia.concierge@luxurystay.com', phone: '+1 (555) 789-0123', role: 'receptionist', department: 'Concierge', isActive: true, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { _id: 'u_8', name: 'Jean-Luc Dubois', email: 'jeanluc.housekeeping@luxurystay.com', phone: '+1 (555) 890-1234', role: 'housekeeping', department: 'Housekeeping', isActive: true, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { _id: 'u_9', name: 'Isabella Rossi', email: 'isabella.fb@luxurystay.com', phone: '+1 (555) 234-5678', role: 'receptionist', department: 'Food & Beverage', isActive: true, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { _id: 'g_1', name: 'Lord Arthur Pendelton', email: 'arthur.pendelton@vip-holdings.co.uk', phone: '+44 20 7946 0912', role: 'guest', department: 'Front Desk', isActive: true, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { _id: 'g_2', name: 'Victoria Vance', email: 'victoria.vance@beverlycapital.com', phone: '+1 (310) 555-0199', role: 'guest', department: 'Front Desk', isActive: true, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { _id: 'g_3', name: 'Dr. Hiroshi Tanaka', email: 'tanaka.neuro@tokyo-med.jp', phone: '+81 3 5555 0143', role: 'guest', department: 'Front Desk', isActive: true, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { _id: 'g_4', name: 'Countess Gabrielle de Monet', email: 'gabrielle@monet-estates.fr', phone: '+33 1 42 68 55 00', role: 'guest', department: 'Front Desk', isActive: true, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { _id: 'g_5', name: 'Sebastian Morales', email: 'sebastian.morales@techventures.io', phone: '+1 (415) 555-8833', role: 'guest', department: 'Front Desk', isActive: true, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() }
];

const useUserStore = create((set, get) => ({
  users: INITIAL_USERS,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/users');
      const apiUsers = res.data?.data?.users || [];
      
      set((state) => {
        // Merge local/fallback newly registered users so signups never disappear
        const localOnlyUsers = state.users.filter(u => 
          !apiUsers.some(apiU => apiU.email?.toLowerCase() === u.email?.toLowerCase())
        );
        return {
          users: [...apiUsers, ...localOnlyUsers],
          isLoading: false
        };
      });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  addUser: (newUser) => {
    set((state) => {
      const exists = state.users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
      if (exists) {
        return {
          users: state.users.map(u => u.email.toLowerCase() === newUser.email.toLowerCase() ? { ...u, ...newUser } : u)
        };
      }
      return { users: [newUser, ...state.users] };
    });
  },

  updateUserRole: async (userId, newRole) => {
    set((state) => ({
      users: state.users.map(u => u._id === userId ? { ...u, role: newRole } : u)
    }));
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole });
    } catch (e) {}
  },

  deleteUser: async (userId) => {
    set((state) => ({
      users: state.users.filter(u => u._id !== userId)
    }));
    try {
      await api.delete(`/auth/users/${userId}`);
    } catch (e) {}
  }
}));

export default useUserStore;
