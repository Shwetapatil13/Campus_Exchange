import api from './api';
import { Product, ProductFilterParams, ProductRequest, PagedResponse } from '../types';

export const productService = {
  getProducts: async (params?: ProductFilterParams) => {
    const response = await api.get<PagedResponse<Product>>('/products', { params });
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get<Product[]>('/products/featured');
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: ProductRequest) => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: ProductRequest) => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    await api.delete(`/products/${id}`);
  },

  toggleAvailability: async (id: number) => {
    const response = await api.patch<Product>(`/products/${id}/toggle-availability`);
    return response.data;
  },

  uploadImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<Product>(`/products/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getMyProducts: async (page = 0, size = 10) => {
    const response = await api.get<PagedResponse<Product>>('/products/my-products', {
      params: { page, size },
    });
    return response.data;
  },
};
