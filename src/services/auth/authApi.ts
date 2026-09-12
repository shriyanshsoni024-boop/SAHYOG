import {
  AuthResponse,
  AuthSession,
  AuthUser,
  PhoneOtpSendDto,
  PhoneOtpVerifyDto,
  CustomerLoginDto,
  CustomerRegisterDto,
  WorkerLoginDto,
  WorkerRegisterDto,
  AdminLoginDto,
} from '../../types/auth';
import { Role } from '../../types';
import { supabase, isSupabaseConfigured, formatIndianPhoneToE164, isValidIndianMobile } from '../../lib/supabase';
import { storageService } from '../storage/storageService';
import { STORAGE_KEYS } from '../storage/storageKeys';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days default fallback expiry

class AuthApiClient {
  /**
   * Send Phone OTP via Supabase Auth
   */
  public async sendPhoneOtp(dto: PhoneOtpSendDto): Promise<{ success: boolean; message?: string; error?: string }> {
    const e164Phone = formatIndianPhoneToE164(dto.phone);

    if (!isValidIndianMobile(dto.phone)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Authentication Error: Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.',
      };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: e164Phone,
        options: {
          channel: 'sms',
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: `Verification code sent to ${e164Phone}` };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send SMS OTP via Supabase Auth.' };
    }
  }

  /**
   * Verify Phone OTP via Supabase Auth
   */
  public async verifyPhoneOtp(dto: PhoneOtpVerifyDto): Promise<AuthResponse> {
    const e164Phone = formatIndianPhoneToE164(dto.phone);
    const otpToken = dto.token.trim();

    if (!otpToken) {
      return { success: false, error: 'Please enter the verification OTP.' };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Authentication Error: Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.',
      };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: e164Phone,
        token: otpToken,
        type: 'sms',
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Invalid or expired verification code.' };
      }

      // 1. Fetch or create profile in Supabase public.profiles
      const authUserId = data.user.id;
      const profile = await this.fetchOrCreateProfile(authUserId, {
        role: dto.role,
        name: dto.name || data.user.user_metadata?.name || 'SAHYOG User',
        phone: e164Phone,
        email: dto.email || data.user.email || undefined,
        city: dto.locality || 'Noida',
      });

      // 2. If worker, ensure worker profile exists in public.workers
      let workerRecord: any = null;
      if (dto.role === 'worker') {
        workerRecord = await this.ensureWorkerProfile(authUserId, {
          name: dto.name || profile.name || 'Artisan Partner',
          phone: e164Phone,
          professions: dto.profession ? [dto.profession] : ['Electrician'],
          skills: dto.skills || (dto.profession ? [dto.profession] : ['General Repairs']),
          experienceYears: dto.experienceYears || 5,
          cooperativeName: dto.cooperativeBranch || 'Noida District Artisan Federation',
          zone: dto.locality || 'Noida Sector 62',
          availability: dto.availability || 'AVAILABLE',
        });
      }

      const userRole: Role = (profile.role === 'cooperative' ? 'admin' : profile.role) as Role;

      const authUser: AuthUser = {
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        email: profile.email || undefined,
        role: userRole,
        verificationStatus: (workerRecord?.verification_status || 'VERIFIED') as any,
        createdAt: profile.created_at || new Date().toISOString(),
        profession: workerRecord?.trade || dto.profession,
        cooperativeBranch: workerRecord?.cooperative_branch || dto.cooperativeBranch,
        experienceYears: workerRecord?.experience_years || dto.experienceYears,
        zone: workerRecord?.zone || profile.city,
        avatar: workerRecord?.avatar || profile.avatar_url || undefined,
      };

      const session: AuthSession = {
        isAuthenticated: true,
        role: userRole,
        user: authUser,
        token: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        expiresAt: data.session?.expires_at ? data.session.expires_at * 1000 : Date.now() + SESSION_DURATION_MS,
      };

      storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);
      return { success: true, session, user: authUser };
    } catch (err: any) {
      return { success: false, error: err?.message || 'OTP verification failed.' };
    }
  }

  /**
   * Admin Email/Password Login via Supabase Auth
   */
  public async loginAdmin(dto: AdminLoginDto): Promise<AuthResponse> {
    const email = dto.identifier.trim().toLowerCase();
    const password = dto.password;

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Authentication Error: Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Invalid administrator credentials.' };
      }

      // Verify role in public.profiles
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (pError || !profile || (profile.role !== 'admin' && profile.role !== 'cooperative')) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access denied: User account is not authorized as a Cooperative Federation Admin.',
        };
      }

      const authUser: AuthUser = {
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        email: profile.email || undefined,
        role: 'admin',
        verificationStatus: 'VERIFIED',
        createdAt: profile.created_at,
        zone: profile.city || 'Central Hub',
      };

      const session: AuthSession = {
        isAuthenticated: true,
        role: 'admin',
        user: authUser,
        token: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        expiresAt: data.session?.expires_at ? data.session.expires_at * 1000 : Date.now() + SESSION_DURATION_MS,
      };

      storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);
      return { success: true, session, user: authUser };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Admin authentication failed.' };
    }
  }

  /**
   * Helper: Fetch or create profile in Supabase public.profiles
   */
  public async fetchOrCreateProfile(
    userId: string,
    initial: { role: Role; name: string; phone: string; email?: string; city?: string; address?: string }
  ): Promise<any> {
    if (!isSupabaseConfigured()) return initial;

    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    const newProfile = {
      id: userId,
      role: initial.role,
      name: initial.name,
      phone: initial.phone,
      email: initial.email || null,
      city: initial.city || 'Noida',
      address: initial.address || '',
    };

    const { data: created, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (error) {
      console.warn('Profile insert note:', error.message);
      return newProfile;
    }

    return created || newProfile;
  }

  /**
   * Helper: Ensure worker record exists in public.workers
   */
  public async ensureWorkerProfile(
    userId: string,
    workerData: {
      name: string;
      phone: string;
      professions: string[];
      skills?: string[];
      experienceYears: number;
      cooperativeName: string;
      zone?: string;
      availability?: 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE';
    }
  ): Promise<any> {
    if (!isSupabaseConfigured()) return null;

    const { data: existing } = await supabase
      .from('workers')
      .select('*')
      .or(`profile_id.eq.${userId},phone.eq.${workerData.phone}`)
      .maybeSingle();

    if (existing) {
      const updates: any = {};
      if (!existing.profile_id) updates.profile_id = userId;
      if (workerData.professions && workerData.professions.length > 0) {
        updates.trade = workerData.professions[0];
        updates.professions = workerData.professions;
      }
      if (workerData.skills && workerData.skills.length > 0) {
        updates.skills = workerData.skills;
      }
      if (workerData.experienceYears) updates.experience_years = workerData.experienceYears;
      if (workerData.cooperativeName) updates.cooperative_branch = workerData.cooperativeName;
      if (workerData.zone) updates.zone = workerData.zone;
      if (workerData.availability) updates.availability = workerData.availability;

      if (Object.keys(updates).length > 0) {
        const { data: updated } = await supabase
          .from('workers')
          .update(updates)
          .eq('id', existing.id)
          .select()
          .maybeSingle();
        return updated || existing;
      }
      return existing;
    }

    const { data: created } = await supabase
      .from('workers')
      .insert([
        {
          profile_id: userId,
          name: workerData.name,
          phone: workerData.phone,
          trade: workerData.professions[0] || 'Electrician',
          professions: workerData.professions,
          skills: workerData.skills || workerData.professions,
          experience_years: workerData.experienceYears,
          experience_level: 'Intermediate',
          cooperative_branch: workerData.cooperativeName,
          zone: workerData.zone || 'Noida Sector 62',
          verification_status: 'VERIFIED',
          availability: workerData.availability || 'AVAILABLE',
        },
      ])
      .select()
      .maybeSingle();

    return created;
  }

  /**
   * End session
   */
  public async logout(_token?: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    storageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }

  /**
   * Get active session from storage or Supabase
   */
  public getCurrentSession(): AuthSession | null {
    const session = storageService.getItem<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (!session || !session.isAuthenticated) return null;

    if (session.expiresAt && Date.now() > session.expiresAt) {
      this.logout();
      return null;
    }

    return session;
  }

  // Backwards compatibility wrappers
  public async loginCustomer(dto: CustomerLoginDto): Promise<AuthResponse> {
    return this.sendPhoneOtp({ phone: dto.identifier });
  }

  public async registerCustomer(dto: CustomerRegisterDto): Promise<AuthResponse> {
    return this.sendPhoneOtp({ phone: dto.phone });
  }

  public async loginWorker(dto: WorkerLoginDto): Promise<AuthResponse> {
    return this.sendPhoneOtp({ phone: dto.identifier });
  }

  public async registerWorker(dto: WorkerRegisterDto): Promise<AuthResponse> {
    return this.sendPhoneOtp({ phone: dto.phone });
  }

  public async refreshSession(_refreshToken: string): Promise<AuthResponse> {
    const session = this.getCurrentSession();
    if (!session) return { success: false, error: 'No active session' };
    return { success: true, session, user: session.user };
  }
}

export const authApi = new AuthApiClient();
