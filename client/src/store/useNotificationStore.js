import { create } from 'zustand';
import api from '../utils/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/notifications');
      if (res.data?.data?.notifications) {
        set({
          notifications: res.data.data.notifications,
          unreadCount: res.data.unreadCount || res.data.data.notifications.filter(n => !n.isRead).length,
          isLoading: false
        });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addNotification: async (title, message, type = 'info', metadata = {}) => {
    // Optimistic local update
    const optimisticNotif = {
      _id: `temp-${Date.now()}`,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      notifications: [optimisticNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));

    try {
      const res = await api.post('/notifications', { title, message, type, metadata });
      if (res.data?.data?.notification) {
        set((state) => ({
          notifications: state.notifications.map(n => n._id === optimisticNotif._id ? res.data.data.notification : n)
        }));
      }
    } catch (e) {
      // Keep optimistic
    }
  },

  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n._id === id ? { ...n, isRead: true } : n),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));

    try {
      await api.put(`/notifications/${id}/read`);
    } catch (e) {}
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0
    }));

    try {
      await api.put('/notifications/read-all');
    } catch (e) {}
  },

  clearAll: async () => {
    set({ notifications: [], unreadCount: 0 });

    try {
      await api.delete('/notifications');
    } catch (e) {}
  }
}));

export default useNotificationStore;
