import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { User, Role, ApiResponse } from '../../types';
import { STORAGE_KEYS } from '../storage/storageKeys';
import { storageService } from '../storage/storageService';
import { Database } from '../../types/database';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export class SupabaseAuthService {
  /**
   * Get the currently logged-in user profile from Supabase (or localStorage fallback)
   */
  public async getCurrentUser(): Promise<ApiResponse<User | null>> {
    if (!isSupabaseConfigured()) {
      const user = storageService.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
      return { success: true, data: user };
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        return { success: true, data: null };
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !data) {
        return { success: true, data: null };
      }

      const profile = data as unknown as ProfileRow;
      const user: User = {
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        email: profile.email || undefined,
        role: profile.role as Role,
        address: profile.address,
        city: profile.city,
        profileImage: profile.avatar_url || undefined,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };

      return { success: true, data: user };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve auth user';
      return { success: false, error: message };
    }
  }

  /**
   * Sign out the current session
   */
  public async signOut(): Promise<ApiResponse<void>> {
    if (!isSupabaseConfigured()) {
      storageService.removeItem(STORAGE_KEYS.CURRENT_USER);
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      return { success: false, error: message };
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();
