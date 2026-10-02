import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  register: async (data: { name: string; email: string; password: string; phone?: string; college?: string }) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};
