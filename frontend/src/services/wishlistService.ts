import api from './api';
import { WishlistResponse, PagedResponse } from '../types';

export const wishlistService = {
  getWishlist: async (page = 0, size = 12) => {
    const response = await api.get<PagedResponse<WishlistResponse>>('/wishlist', {
      params: { page, size },
    });
    return response.data;
  },

  addToWishlist: async (productId: number) => {
    const response = await api.post<WishlistResponse>(`/wishlist/${productId}`);
    return response.data;
  },

  removeFromWishlist: async (productId: number) => {
    await api.delete(`/wishlist/${productId}`);
  },

  checkWishlisted: async (productId: number) => {
    const response = await api.get<{ wishlisted: boolean }>(`/wishlist/check/${productId}`);
    return response.data.wishlisted;
  },
};
