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
  SecureUserRecord,
} from '../../types/auth';
import { Role } from '../../types';
import { supabase, isSupabaseConfigured, formatIndianPhoneToE164, isValidIndianMobile } from '../../lib/supabase';
import { storageService } from '../storage/storageService';
import { STORAGE_KEYS } from '../storage/storageKeys';
import { verifyPassword, generateToken } from './cryptoUtils';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days expiry
const DEFAULT_SALT = 'sahyog_sec_salt_2026';

const SEED_USERS: SecureUserRecord[] = [
  {
    id: 'cust-demo-1',
    name: 'Ananya Deshmukh',
    phone: '+919980122334',
    email: 'ananya.deshmukh@example.com',
    role: 'customer',
    passwordHash: '8b28f8045610e7b4169527f3113149be3e3df7da4f64ce00bb8dc7fc2ae8677e',
    passwordSalt: DEFAULT_SALT,
    verificationStatus: 'VERIFIED',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    zone: 'Indiranagar & East Zone',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'w-demo-1',
    name: 'Ramesh Kumar',
    phone: '+919876543210',
    email: 'ramesh.kumar@artisan.sahyog.in',
    role: 'worker',
    profession: 'Master Electrician',
    cooperativeBranch: 'Bengaluru East Electrical Union',
    experienceYears: 8,
    passwordHash: 'c7c8c6d4ba42f8c372fba1aa4ca03e05a3068e82d5bfb9170e3039d5b4a11f26',
    passwordSalt: DEFAULT_SALT,
    verificationStatus: 'VERIFIED',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
    zone: 'Bengaluru East Zone',
    createdAt: '2026-01-10T09:30:00.000Z',
  },
  {
    id: 'admin-demo-1',
    name: 'Vikramaditya Rao',
    phone: '+919811233445',
    email: 'operations@sahyog.coop',
    role: 'admin',
    passwordHash: 'd3fb3645bcf68dfa8db90d76bf8618e7e1eec5bdfd0fc7f369f6e6db47514a60',
    passwordSalt: DEFAULT_SALT,
    verificationStatus: 'VERIFIED',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    zone: 'Central Federation Operations Hub',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
];

class AuthApiClient {
  private getUsersVault(): SecureUserRecord[] {
    const vault = storageService.getItem<SecureUserRecord[]>(STORAGE_KEYS.AUTH_USERS_VAULT, []);
    if (!vault || vault.length === 0) {
      storageService.setItem(STORAGE_KEYS.AUTH_USERS_VAULT, SEED_USERS);
      return SEED_USERS;
    }
    return vault;
  }

  private saveUsersVault(vault: SecureUserRecord[]): void {
    storageService.setItem(STORAGE_KEYS.AUTH_USERS_VAULT, vault);
  }

  /**
   * Send Phone OTP via Supabase Auth (or development sandbox fallback)
   */
  public async sendPhoneOtp(dto: PhoneOtpSendDto): Promise<{ success: boolean; message?: string; error?: string }> {
    const e164Phone = formatIndianPhoneToE164(dto.phone);

    if (!isValidIndianMobile(dto.phone)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    if (isSupabaseConfigured()) {
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

        return { success: true, message: `OTP sent successfully to ${e164Phone}` };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to send SMS OTP via Supabase Auth.' };
      }
    }

    // In Production mode, refuse to simulate fake SMS OTP
    if (import.meta.env.PROD) {
      return {
        success: false,
        error: 'Production Auth Error: Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting environment.',
      };
    }

    // Zero-config dev sandbox response
    return {
      success: true,
      message: `OTP sent to ${e164Phone}. (Dev Sandbox Mode: Enter any 6-digit code e.g. 123456 or use Demo fill)`,
    };
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

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: e164Phone,
          token: otpToken,
          type: 'sms',
        });

        if (error || !data.user) {
          return { success: false, error: error?.message || 'Invalid or expired OTP.' };
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

        // 2. If worker, ensure worker profile in public.workers
        if (dto.role === 'worker') {
          await this.ensureWorkerProfile(authUserId, {
            name: dto.name || 'Artisan Partner',
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
          verificationStatus: 'VERIFIED',
          createdAt: profile.created_at || new Date().toISOString(),
          profession: dto.profession,
          cooperativeBranch: dto.cooperativeBranch,
          experienceYears: dto.experienceYears,
          zone: profile.city,
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

    // In Production mode, refuse to simulate fake verification
    if (import.meta.env.PROD) {
      return {
        success: false,
        error: 'Production Auth Error: Cannot verify OTP because Supabase is not configured in this environment.',
      };
    }

    // Zero-config dev sandbox fallback
    return this.devVerifyPhoneOtp(dto);
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

    if (isSupabaseConfigured()) {
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

    // In Production mode, refuse to simulate admin login without Supabase
    if (import.meta.env.PROD) {
      return {
        success: false,
        error: 'Production Auth Error: Cannot authenticate administrator because Supabase is not configured in this environment.',
      };
    }

    // Zero-config dev mode admin login
    return this.devLoginAdmin(dto);
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
      console.warn('Profile insert warning:', error.message);
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
  ): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { data: existing } = await supabase
      .from('workers')
      .select('id, profile_id')
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
        await supabase
          .from('workers')
          .update(updates)
          .eq('id', existing.id);
      }
      return;
    }

    await supabase.from('workers').insert([
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
    ]);
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

  /**
   * Dev Fallback: Phone OTP verification
   */
  private devVerifyPhoneOtp(dto: PhoneOtpVerifyDto): AuthResponse {
    const e164Phone = formatIndianPhoneToE164(dto.phone);
    const vault = this.getUsersVault();
    let user = vault.find((u) => u.phone === e164Phone || u.phone.endsWith(dto.phone.slice(-10)));

    if (!user) {
      user = {
        id: `usr-${Date.now()}`,
        name: dto.name || (dto.role === 'worker' ? 'Ramesh Kumar (Artisan)' : 'SAHYOG Customer'),
        phone: e164Phone,
        email: dto.email || undefined,
        role: dto.role,
        passwordHash: 'dev_mode',
        passwordSalt: 'dev_salt',
        verificationStatus: 'VERIFIED',
        avatar: dto.role === 'worker'
          ? 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        zone: dto.locality || 'Sector 62, Noida',
        profession: dto.profession,
        cooperativeBranch: dto.cooperativeBranch,
        experienceYears: dto.experienceYears,
        createdAt: new Date().toISOString(),
      };
      vault.push(user);
      this.saveUsersVault(vault);
    } else {
      if (dto.name) user.name = dto.name;
      if (dto.email) user.email = dto.email;
      if (dto.locality) user.zone = dto.locality;
      if (dto.profession) user.profession = dto.profession;
      if (dto.cooperativeBranch) user.cooperativeBranch = dto.cooperativeBranch;
      if (dto.experienceYears) user.experienceYears = dto.experienceYears;
      this.saveUsersVault(vault);
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: dto.role,
      verificationStatus: user.verificationStatus,
      createdAt: user.createdAt,
      avatar: user.avatar,
      zone: user.zone,
      profession: user.profession,
      cooperativeBranch: user.cooperativeBranch,
      experienceYears: user.experienceYears,
    };

    const session: AuthSession = {
      isAuthenticated: true,
      role: dto.role,
      user: authUser,
      token: generateToken(`sahyog_${dto.role}`),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);
    return { success: true, session, user: authUser };
  }

  /**
   * Dev Fallback: Admin password login
   */
  private devLoginAdmin(dto: AdminLoginDto): AuthResponse {
    const vault = this.getUsersVault();
    const admin = vault.find((u) => u.role === 'admin' && u.email === dto.identifier.toLowerCase().trim());

    if (!admin || !verifyPassword(dto.password, admin.passwordHash, admin.passwordSalt)) {
      return { success: false, error: 'Invalid administrator credentials.' };
    }

    const authUser: AuthUser = {
      id: admin.id,
      name: admin.name,
      phone: admin.phone,
      email: admin.email,
      role: 'admin',
      verificationStatus: 'VERIFIED',
      createdAt: admin.createdAt,
      avatar: admin.avatar,
      zone: admin.zone,
    };

    const session: AuthSession = {
      isAuthenticated: true,
      role: 'admin',
      user: authUser,
      token: generateToken('sahyog_admin'),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);
    return { success: true, session, user: authUser };
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
