import {
  AuthResponse,
  AuthSession,
  AuthUser,
  CustomerLoginDto,
  CustomerRegisterDto,
  WorkerLoginDto,
  WorkerRegisterDto,
  AdminLoginDto,
} from '../../types/auth';
import { Role } from '../../types';
import { authApi } from './authApi';

class AuthService {
  /**
   * Send Phone SMS OTP via Supabase Auth
   */
  public async sendPhoneOtp(dto: { phone: string }): Promise<{ success: boolean; message?: string; error?: string }> {
    return authApi.sendPhoneOtp(dto);
  }

  /**
   * Verify Phone SMS OTP via Supabase Auth
   */
  public async verifyPhoneOtp(dto: import('../../types/auth').PhoneOtpVerifyDto): Promise<AuthResponse> {
    return authApi.verifyPhoneOtp(dto);
  }

  /**
   * Customer Login (Legacy wrapper)
   */
  public async loginCustomer(dto: CustomerLoginDto): Promise<AuthResponse> {
    return authApi.loginCustomer(dto);
  }

  /**
   * Customer Registration (Legacy wrapper)
   */
  public async registerCustomer(dto: CustomerRegisterDto): Promise<AuthResponse> {
    return authApi.registerCustomer(dto);
  }

  /**
   * Worker / Artisan Login (Legacy wrapper)
   */
  public async loginWorker(dto: WorkerLoginDto): Promise<AuthResponse> {
    return authApi.loginWorker(dto);
  }

  /**
   * Worker / Artisan Registration (Legacy wrapper)
   */
  public async registerWorker(dto: WorkerRegisterDto): Promise<AuthResponse> {
    return authApi.registerWorker(dto);
  }

  /**
   * Cooperative Federation Admin Login
   */
  public async loginAdmin(dto: AdminLoginDto): Promise<AuthResponse> {
    return authApi.loginAdmin(dto);
  }

  /**
   * End Session & Logout
   */
  public async logout(): Promise<void> {
    const session = this.getCurrentSession();
    await authApi.logout(session?.token);
  }

  /**
   * Retrieve active session (with expiration check)
   */
  public getCurrentSession(): AuthSession | null {
    return authApi.getCurrentSession();
  }

  /**
   * Retrieve active user
   */
  public getCurrentUser(): AuthUser | null {
    const session = this.getCurrentSession();
    return session?.user || null;
  }

  /**
   * Check if current session is authenticated
   */
  public isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return !!session?.isAuthenticated;
  }

  /**
   * Check if session has target role
   */
  public hasRole(role: Role): boolean {
    const session = this.getCurrentSession();
    return !!session?.isAuthenticated && session.role === role;
  }

  /**
   * Refresh session
   */
  public async refreshSession(): Promise<AuthResponse> {
    const session = this.getCurrentSession();
    if (!session?.refreshToken) {
      return { success: false, error: 'No refresh token available.' };
    }
    return authApi.refreshSession(session.refreshToken);
  }
}

export const authService = new AuthService();
