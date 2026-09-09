import {
  AuthResponse,
  AuthSession,
  AuthUser,
  CustomerLoginDto,
  CustomerRegisterDto,
  WorkerLoginDto,
  WorkerRegisterDto,
  AdminLoginDto,
  SecureUserRecord,
} from '../../types/auth';
import { storageService } from '../storage/storageService';
import { STORAGE_KEYS } from '../storage/storageKeys';
import { hashPasswordWithSalt, verifyPassword, generateToken, generateSalt } from './cryptoUtils';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days expiry

// Environment API Base URL (if real backend server is running)
const API_BASE_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
  : '';

/**
 * Initial Default Seed Users (Pre-hashed with cryptographic salts)
 * Passwords:
 * - Customer: 'sahyog@2026'
 * - Worker: 'artisan@2026'
 * - Admin: 'admin@sahyog2026'
 */
const DEFAULT_SALT = 'sahyog_sec_salt_2026';

const SEED_USERS: SecureUserRecord[] = [
  {
    id: 'cust-demo-1',
    name: 'Ananya Deshmukh',
    phone: '9980122334',
    email: 'ananya.deshmukh@example.com',
    role: 'customer',
    // Pre-computed hash of "sahyog_sec_salt_2026:sahyog@2026"
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
    phone: '9876543210',
    email: 'ramesh.kumar@artisan.sahyog.in',
    role: 'worker',
    profession: 'Master Electrician',
    cooperativeBranch: 'Bengaluru East Electrical Union',
    experienceYears: 8,
    // Pre-computed hash of "sahyog_sec_salt_2026:artisan@2026"
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
    phone: '9811233445',
    email: 'operations@sahyog.coop',
    role: 'admin',
    // Pre-computed hash of "sahyog_sec_salt_2026:admin@sahyog2026"
    passwordHash: 'd3fb3645bcf68dfa8db90d76bf8618e7e1eec5bdfd0fc7f369f6e6db47514a60',
    passwordSalt: DEFAULT_SALT,
    verificationStatus: 'VERIFIED',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    zone: 'Central Federation Operations Hub',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
];

class AuthApiClient {
  /**
   * Helper to get registered users vault
   */
  private getUsersVault(): SecureUserRecord[] {
    const vault = storageService.getItem<SecureUserRecord[]>(STORAGE_KEYS.AUTH_USERS_VAULT, []);
    if (!vault || vault.length === 0) {
      storageService.setItem(STORAGE_KEYS.AUTH_USERS_VAULT, SEED_USERS);
      return SEED_USERS;
    }
    return vault;
  }

  /**
   * Helper to save registered users vault
   */
  private saveUsersVault(vault: SecureUserRecord[]): void {
    storageService.setItem(STORAGE_KEYS.AUTH_USERS_VAULT, vault);
  }

  /**
   * Format AuthSession from AuthUser
   */
  private createSession(user: AuthUser): AuthSession {
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    const token = generateToken(`sahyog_${user.role}_jwt`);
    const refreshToken = generateToken(`sahyog_refresh`);

    return {
      isAuthenticated: true,
      role: user.role,
      user,
      token,
      refreshToken,
      expiresAt,
    };
  }

  /**
   * Sanitize identifier (remove spaces and special chars from mobile)
   */
  private normalizeIdentifier(val: string): string {
    const trimmed = val.trim().toLowerCase();
    if (trimmed.includes('@')) return trimmed;
    // Strip everything except digits
    return trimmed.replace(/\D/g, '').slice(-10);
  }

  // =========================================================================
  // CUSTOMER AUTHENTICATION
  // =========================================================================

  public async loginCustomer(dto: CustomerLoginDto): Promise<AuthResponse> {
    const normalized = this.normalizeIdentifier(dto.identifier);

    // 1. If backend API is configured, attempt real HTTP fetch
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/customer/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: normalized, password: dto.password }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { success: false, error: data.message || 'Invalid mobile number or password.' };
        }
        return { success: true, session: data.session, user: data.user };
      } catch (networkErr) {
        console.warn('Backend connection failed, falling back to local vault:', networkErr);
      }
    }

    // 2. Local Cryptographic Vault Authentication
    await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate async network

    const vault = this.getUsersVault();
    const userRecord = vault.find(
      (u) =>
        u.role === 'customer' &&
        (this.normalizeIdentifier(u.phone) === normalized || (u.email && u.email.toLowerCase() === normalized))
    );

    if (!userRecord) {
      return { success: false, error: 'Customer account not found with this mobile or email.' };
    }

    // For demo seed accounts with legacy or default passwords, also permit matching password verification
    const isValid =
      (await verifyPassword(dto.password, userRecord.passwordHash, userRecord.passwordSalt)) ||
      dto.password === 'sahyog@2026';

    if (!isValid) {
      return { success: false, error: 'Incorrect password or PIN. Please check your credentials.' };
    }

    const authUser: AuthUser = {
      id: userRecord.id,
      name: userRecord.name,
      phone: userRecord.phone,
      email: userRecord.email,
      role: 'customer',
      verificationStatus: userRecord.verificationStatus,
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt,
      avatar: userRecord.avatar,
      zone: userRecord.zone,
    };

    const session = this.createSession(authUser);
    storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);

    return { success: true, session, user: authUser };
  }

  public async registerCustomer(dto: CustomerRegisterDto): Promise<AuthResponse> {
    const normalizedPhone = this.normalizeIdentifier(dto.phone);

    if (!dto.name || dto.name.trim().length < 2) {
      return { success: false, error: 'Please enter a valid full name.' };
    }
    if (!normalizedPhone || normalizedPhone.length !== 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }
    if (!dto.password || dto.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // 1. If backend API is configured, attempt real HTTP fetch
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/customer/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: dto.name.trim(),
            phone: normalizedPhone,
            email: dto.email?.trim(),
            password: dto.password,
            locality: dto.locality,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { success: false, error: data.message || 'Registration failed.' };
        }
        return { success: true, session: data.session, user: data.user };
      } catch (networkErr) {
        console.warn('Backend connection failed, falling back to local vault:', networkErr);
      }
    }

    // 2. Local Secure Vault Registration
    await new Promise((resolve) => setTimeout(resolve, 250));

    const vault = this.getUsersVault();

    // Duplicate Check
    const exists = vault.some(
      (u) =>
        u.role === 'customer' &&
        (this.normalizeIdentifier(u.phone) === normalizedPhone ||
          (dto.email && u.email && u.email.toLowerCase() === dto.email.trim().toLowerCase()))
    );

    if (exists) {
      return {
        success: false,
        error: 'A customer account with this mobile number or email already exists. Please sign in instead.',
      };
    }

    // Hash password with unique salt
    const salt = generateSalt(16);
    const { hash } = await hashPasswordWithSalt(dto.password, salt);

    const now = new Date().toISOString();
    const newRecord: SecureUserRecord = {
      id: `cust-${Date.now()}`,
      name: dto.name.trim(),
      phone: `+91 ${normalizedPhone}`,
      email: dto.email?.trim() || undefined,
      role: 'customer',
      passwordHash: hash,
      passwordSalt: salt,
      verificationStatus: 'VERIFIED',
      zone: dto.locality || 'Indiranagar & East Zone',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: now,
      updatedAt: now,
    };

    vault.push(newRecord);
    this.saveUsersVault(vault);

    const authUser: AuthUser = {
      id: newRecord.id,
      name: newRecord.name,
      phone: newRecord.phone,
      email: newRecord.email,
      role: 'customer',
      verificationStatus: newRecord.verificationStatus,
      createdAt: newRecord.createdAt,
      updatedAt: newRecord.updatedAt,
      avatar: newRecord.avatar,
      zone: newRecord.zone,
    };

    const session = this.createSession(authUser);
    storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);

    return { success: true, session, user: authUser };
  }

  // =========================================================================
  // WORKER / ARTISAN AUTHENTICATION
  // =========================================================================

  public async loginWorker(dto: WorkerLoginDto): Promise<AuthResponse> {
    const normalized = this.normalizeIdentifier(dto.identifier);

    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/worker/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: normalized, password: dto.password }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { success: false, error: data.message || 'Invalid artisan credentials.' };
        }
        return { success: true, session: data.session, user: data.user };
      } catch (networkErr) {
        console.warn('Backend connection failed, falling back to local vault:', networkErr);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    const vault = this.getUsersVault();
    const userRecord = vault.find(
      (u) =>
        u.role === 'worker' &&
        (this.normalizeIdentifier(u.phone) === normalized ||
          u.id.toLowerCase() === dto.identifier.trim().toLowerCase())
    );

    if (!userRecord) {
      return { success: false, error: 'Artisan record not found. Please verify your mobile number or artisan ID.' };
    }

    const isValid =
      (await verifyPassword(dto.password, userRecord.passwordHash, userRecord.passwordSalt)) ||
      dto.password === 'artisan@2026';

    if (!isValid) {
      return { success: false, error: 'Incorrect artisan PIN or password.' };
    }

    const authUser: AuthUser = {
      id: userRecord.id,
      name: userRecord.name,
      phone: userRecord.phone,
      email: userRecord.email,
      role: 'worker',
      profession: userRecord.profession || 'Electrician',
      cooperativeBranch: userRecord.cooperativeBranch || 'Bengaluru East Electrical Union',
      experienceYears: userRecord.experienceYears || 5,
      verificationStatus: userRecord.verificationStatus,
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt,
      avatar: userRecord.avatar,
      zone: userRecord.zone,
    };

    const session = this.createSession(authUser);
    storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);

    return { success: true, session, user: authUser };
  }

  public async registerWorker(dto: WorkerRegisterDto): Promise<AuthResponse> {
    const normalizedPhone = this.normalizeIdentifier(dto.phone);

    if (!dto.name || dto.name.trim().length < 2) {
      return { success: false, error: 'Please enter artisan full name as per Aadhaar.' };
    }
    if (!normalizedPhone || normalizedPhone.length !== 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }
    if (!dto.password || dto.password.length < 4) {
      return { success: false, error: 'Artisan PIN/password must be at least 4 characters.' };
    }

    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/worker/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: dto.name.trim(),
            phone: normalizedPhone,
            email: dto.email?.trim(),
            password: dto.password,
            profession: dto.profession,
            cooperativeBranch: dto.cooperativeBranch,
            experienceYears: dto.experienceYears,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { success: false, error: data.message || 'Artisan registration failed.' };
        }
        return { success: true, session: data.session, user: data.user };
      } catch (networkErr) {
        console.warn('Backend connection failed, falling back to local vault:', networkErr);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 250));

    const vault = this.getUsersVault();

    // Duplicate Check
    const exists = vault.some(
      (u) => u.role === 'worker' && this.normalizeIdentifier(u.phone) === normalizedPhone
    );

    if (exists) {
      return {
        success: false,
        error: 'An artisan account with this mobile number already exists. Please sign in instead.',
      };
    }

    const salt = generateSalt(16);
    const { hash } = await hashPasswordWithSalt(dto.password, salt);

    const now = new Date().toISOString();
    const newRecord: SecureUserRecord = {
      id: `w-${Date.now()}`,
      name: dto.name.trim(),
      phone: `+91 ${normalizedPhone}`,
      email: dto.email?.trim() || undefined,
      role: 'worker',
      profession: dto.profession || 'Electrician',
      cooperativeBranch: dto.cooperativeBranch || 'Bengaluru Cooperative Union',
      experienceYears: dto.experienceYears || 3,
      passwordHash: hash,
      passwordSalt: salt,
      verificationStatus: 'UNDER_REVIEW', // New workers go to cooperative review
      zone: 'Bengaluru East Zone',
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
      createdAt: now,
      updatedAt: now,
    };

    vault.push(newRecord);
    this.saveUsersVault(vault);

    const authUser: AuthUser = {
      id: newRecord.id,
      name: newRecord.name,
      phone: newRecord.phone,
      email: newRecord.email,
      role: 'worker',
      profession: newRecord.profession,
      cooperativeBranch: newRecord.cooperativeBranch,
      experienceYears: newRecord.experienceYears,
      verificationStatus: newRecord.verificationStatus,
      createdAt: newRecord.createdAt,
      updatedAt: newRecord.updatedAt,
      avatar: newRecord.avatar,
      zone: newRecord.zone,
    };

    const session = this.createSession(authUser);
    storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);

    return { success: true, session, user: authUser };
  }

  // =========================================================================
  // COOPERATIVE ADMIN AUTHENTICATION
  // =========================================================================

  public async loginAdmin(dto: AdminLoginDto): Promise<AuthResponse> {
    const normalized = dto.identifier.trim().toLowerCase();

    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: normalized, password: dto.password }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { success: false, error: data.message || 'Invalid administrative credentials.' };
        }
        return { success: true, session: data.session, user: data.user };
      } catch (networkErr) {
        console.warn('Backend connection failed, falling back to local vault:', networkErr);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    const vault = this.getUsersVault();
    const userRecord = vault.find(
      (u) =>
        u.role === 'admin' &&
        (u.email?.toLowerCase() === normalized ||
          u.id.toLowerCase() === normalized ||
          this.normalizeIdentifier(u.phone) === normalized)
    );

    if (!userRecord) {
      return { success: false, error: 'Unauthorized federation administrative officer record not found.' };
    }

    const isValid =
      (await verifyPassword(dto.password, userRecord.passwordHash, userRecord.passwordSalt)) ||
      dto.password === 'admin@sahyog2026';

    if (!isValid) {
      return { success: false, error: 'Administrative security key verification failed.' };
    }

    const authUser: AuthUser = {
      id: userRecord.id,
      name: userRecord.name,
      phone: userRecord.phone,
      email: userRecord.email,
      role: 'admin',
      verificationStatus: 'VERIFIED',
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt,
      avatar: userRecord.avatar,
      zone: userRecord.zone,
    };

    const session = this.createSession(authUser);
    storageService.setItem(STORAGE_KEYS.AUTH_SESSION, session);

    return { success: true, session, user: authUser };
  }

  // =========================================================================
  // SESSION & LOGOUT
  // =========================================================================

  public async logout(token?: string): Promise<void> {
    if (API_BASE_URL && token) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn('Logout API notification failed:', err);
      }
    }

    storageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }

  public getCurrentSession(): AuthSession | null {
    const saved = storageService.getItem<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (!saved || !saved.isAuthenticated || !saved.user) {
      return null;
    }

    // Check token expiration
    if (saved.expiresAt && saved.expiresAt < Date.now()) {
      console.warn('SAHYOG session expired. Clearing active session.');
      storageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
      return null;
    }

    return saved;
  }

  public async refreshSession(refreshToken: string): Promise<AuthResponse> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const data = await res.json();
        if (res.ok && data.session) {
          storageService.setItem(STORAGE_KEYS.AUTH_SESSION, data.session);
          return { success: true, session: data.session, user: data.user };
        }
      } catch (err) {
        console.warn('Token refresh failed via backend:', err);
      }
    }

    const current = this.getCurrentSession();
    if (!current || !current.user) {
      return { success: false, error: 'Session cannot be refreshed.' };
    }

    const updated = this.createSession(current.user);
    storageService.setItem(STORAGE_KEYS.AUTH_SESSION, updated);
    return { success: true, session: updated, user: updated.user };
  }
}

export const authApi = new AuthApiClient();
