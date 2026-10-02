import api from './api';
import { User } from '../types';

export const userService = {
  getProfile: async () => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  updateProfile: async (data: { name: string; phone?: string; college?: string; profileImage?: string }) => {
    const response = await api.put<User>('/users/me', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: String; newPassword: String }) => {
    const response = await api.post<{ message: string }>('/users/change-password', data);
    return response.data;
  },
};
