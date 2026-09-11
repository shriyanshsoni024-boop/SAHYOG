import { User, Review, ApiResponse } from '../types';
import { STORAGE_KEYS } from './storage/storageKeys';
import { storageService } from './storage/storageService';
import { MOCK_REVIEWS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../types/database';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ReviewRow = Database['public']['Tables']['reviews']['Row'];

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

const mapProfileToUser = (row: ProfileRow): User => {
  const roleVal = row.role === 'cooperative' ? 'admin' : (row.role as User['role']);
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || undefined,
    role: roleVal,
    address: row.address || '',
    city: row.city || 'Noida',
    profileImage: row.avatar_url || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

class UserService {
  /**
   * Get current authenticated user profile from Supabase (or cached local storage)
   */
  public async getCurrentUser(): Promise<ApiResponse<User>> {
    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (userId) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (data && !error) {
            const user = mapProfileToUser(data as unknown as ProfileRow);
            storageService.setItem(STORAGE_KEYS.CURRENT_USER, user);
            return { success: true, data: user };
          }
        }
      } catch (err: unknown) {
        console.warn('Supabase getCurrentUser failed, falling back to cached profile:', err);
      }
    }

    try {
      const user = storageService.getItem<User>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve current user' };
    }
  }

  /**
   * Update user profile data in Supabase & local cache
   */
  public async updateUserProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    let targetUserId = updates.id;

    if (isSupabaseConfigured()) {
      try {
        if (!targetUserId) {
          const { data: { session } } = await supabase.auth.getSession();
          targetUserId = session?.user?.id;
        }

        if (targetUserId) {
          const dbUpdates: Partial<Database['public']['Tables']['profiles']['Update']> = {};
          if (updates.name !== undefined) dbUpdates.name = updates.name;
          if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
          if (updates.email !== undefined) dbUpdates.email = updates.email;
          if (updates.address !== undefined) dbUpdates.address = updates.address;
          if (updates.city !== undefined) dbUpdates.city = updates.city;
          if (updates.profileImage !== undefined) dbUpdates.avatar_url = updates.profileImage;

          const { data, error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', targetUserId)
            .select()
            .maybeSingle();

          if (error) {
            console.warn('Supabase updateUserProfile error:', error.message);
          } else if (data) {
            const updated = mapProfileToUser(data as unknown as ProfileRow);
            storageService.setItem(STORAGE_KEYS.CURRENT_USER, updated);
            return { success: true, data: updated, message: 'User profile updated successfully.' };
          }
        }
      } catch (err: unknown) {
        console.warn('Supabase updateUserProfile failed, falling back to local:', err);
      }
    }

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
   * Get marketplace reviews from Supabase
   */
  public async getReviews(): Promise<ApiResponse<Review[]>> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const reviews: Review[] = (data as unknown as ReviewRow[]).map((row) => ({
            id: row.id,
            authorName: row.author_name,
            rating: Number(row.rating),
            comment: row.comment,
            serviceName: row.service_name,
            date: new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          }));
          storageService.setItem(STORAGE_KEYS.REVIEWS, reviews);
          return { success: true, data: reviews };
        }
      } catch (err: unknown) {
        console.warn('Supabase getReviews failed, using local cache:', err);
      }
    }

    try {
      const reviews = storageService.getItem<Review[]>(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
      return { success: true, data: reviews };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve reviews' };
    }
  }
}

export const userService = new UserService();
