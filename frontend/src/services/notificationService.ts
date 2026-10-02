import api from './api';
import { NotificationResponse } from '../types';

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get<NotificationResponse[]>('/notifications');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get<{ unreadCount: number }>('/notifications/unread-count');
    return response.data.unreadCount;
  },

  markAsRead: async (id: number) => {
    const response = await api.patch<NotificationResponse>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
  },
};
