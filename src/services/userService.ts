import { User, Review, ApiResponse } from '../types';
import { STORAGE_KEYS } from './storage/storageKeys';
import { storageService } from './storage/storageService';
import { MOCK_REVIEWS } from '../data/mockData';

const DEFAULT_USER: User = {
  id: 'cust-1',
  name: 'Ananya Deshmukh',
  phone: '+91 99801 22334',
  email: 'ananya.deshmukh@example.com',
  role: 'customer',
  address: 'Flat 402, Green Vista Apartments, 12th Main Indiranagar, Bangalore',
  city: 'Bangalore',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2026-01-10T10:00:00Z',
};

class UserService {
  /**
   * Get current authenticated demo user
   */
  public async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const user = storageService.getItem<User>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve current user' };
    }
  }

  /**
   * Update user profile data
   */
  public async updateUserProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const current = storageService.getItem<User>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
      const updated: User = {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      storageService.setItem(STORAGE_KEYS.CURRENT_USER, updated);
      return { success: true, data: updated, message: 'User profile updated successfully.' };
    } catch (err) {
      return { success: false, error: 'Failed to update user profile' };
    }
  }

  /**
   * Get marketplace reviews
   */
  public async getReviews(): Promise<ApiResponse<Review[]>> {
    try {
      const reviews = storageService.getItem<Review[]>(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
      return { success: true, data: reviews };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve reviews' };
    }
  }
}

export const userService = new UserService();
