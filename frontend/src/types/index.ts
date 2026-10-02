export type Role = 'USER' | 'ADMIN';

export type Category = 
  | 'ELECTRONICS'
  | 'BOOKS'
  | 'FURNITURE'
  | 'CYCLES'
  | 'FASHION'
  | 'STATIONERY'
  | 'OTHER';

export type Condition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';

export type NotificationType = 
  | 'WISHLIST_ADDED'
  | 'PRODUCT_INQUIRY'
  | 'PRICE_UPDATE'
  | 'SYSTEM';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  profileImage?: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  name: string;
  email: string;
  role: Role;
  college?: string;
  profileImage?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  imageUrl?: string;
  location: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  seller: User;
  wishlistedByCurrentUser: boolean;
}

export interface ProductRequest {
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  imageUrl?: string;
  location: string;
  available?: boolean;
}

export interface ProductFilterParams {
  keyword?: string;
  category?: Category;
  condition?: Condition;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export interface WishlistResponse {
  id: number;
  product: Product;
  createdAt: string;
}

export interface NotificationResponse {
  id: number;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  errors?: Record<string, string>;
}
