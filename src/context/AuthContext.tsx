import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthResponse,
  AuthSession,
  AuthUser,
  CustomerLoginDto,
  CustomerRegisterDto,
  WorkerLoginDto,
  WorkerRegisterDto,
  AdminLoginDto,
} from '../types/auth';
import { Role } from '../types';
import { authService } from '../services/auth/authService';

export interface AuthContextType {
  session: AuthSession;
  currentRole: Role;
  currentPath: string;
  isLoading: boolean;
  navigate: (path: string) => void;
  // Role-Specific Real Auth API Methods
  loginCustomer: (dto: CustomerLoginDto) => Promise<AuthResponse>;
  registerCustomer: (dto: CustomerRegisterDto) => Promise<AuthResponse>;
  loginWorker: (dto: WorkerLoginDto) => Promise<AuthResponse>;
  registerWorker: (dto: WorkerRegisterDto) => Promise<AuthResponse>;
  loginAdmin: (dto: AdminLoginDto) => Promise<AuthResponse>;
  // Unified / Generic Wrappers for UI backwards compatibility
  login: (role: Role, credentials: { identifier: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  signup: (
    role: Role,
    userData: {
      name: string;
      phone: string;
      email?: string;
      password?: string;
      profession?: string;
      locality?: string;
      cooperativeBranch?: string;
      experienceYears?: number;
    }
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
  canAccessRole: (targetRole: Role) => boolean;
  refreshSession: () => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Normalize initial path from window.location
const getInitialPath = (): string => {
  if (typeof window === 'undefined') return '/customer/home';
  const path = window.location.pathname;
  const hash = window.location.hash.replace(/^#/, '');

  if (hash && hash.startsWith('/')) {
    return hash;
  }
  if (path && path !== '/') {
    return path;
  }
  return '/customer/home';
};

const DEFAULT_FALLBACK_USER: AuthUser = {
  id: 'cust-demo-1',
  name: 'Ananya Deshmukh',
  phone: '+91 99801 22334',
  email: 'ananya.deshmukh@example.com',
  role: 'customer',
  verificationStatus: 'VERIFIED',
  createdAt: '2026-01-15T10:00:00.000Z',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  zone: 'Indiranagar & East Zone',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [session, setSession] = useState<AuthSession>(() => {
    const existing = authService.getCurrentSession();
    if (existing && existing.isAuthenticated && existing.user) {
      return existing;
    }
    // Default initial session is authenticated customer for instant live evaluation
    return {
      isAuthenticated: true,
      role: 'customer',
      user: DEFAULT_FALLBACK_USER,
      token: 'sahyog_demo_cust_jwt',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
  });

  // Navigate helper with history pushState and hash synchronization
  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.location.hash = path;
    }
  }, []);

  // Listen for browser back/forward buttons and hash navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Validate session expiration on initial mount and route changes
  useEffect(() => {
    const active = authService.getCurrentSession();
    if (session.isAuthenticated && !active) {
      // Session expired or invalidated
      setSession({
        isAuthenticated: false,
        role: session.role,
        user: null,
      });
    }
  }, [currentPath]);

  // =========================================================================
  // AUTH SERVICE WRAPPERS
  // =========================================================================

  const loginCustomer = async (dto: CustomerLoginDto): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.loginCustomer(dto);
      if (res.success && res.session) {
        setSession(res.session);
        navigate('/customer/home');
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCustomer = async (dto: CustomerRegisterDto): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.registerCustomer(dto);
      if (res.success && res.session) {
        setSession(res.session);
        navigate('/customer/home');
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWorker = async (dto: WorkerLoginDto): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.loginWorker(dto);
      if (res.success && res.session) {
        setSession(res.session);
        navigate('/worker/home');
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWorker = async (dto: WorkerRegisterDto): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.registerWorker(dto);
      if (res.success && res.session) {
        setSession(res.session);
        navigate('/worker/home');
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (dto: AdminLoginDto): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.loginAdmin(dto);
      if (res.success && res.session) {
        setSession(res.session);
        navigate('/admin/dashboard');
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  // Unified login helper
  const login = async (
    role: Role,
    credentials: { identifier: string; password?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    const pwd = credentials.password || '';
    if (role === 'worker') {
      const res = await loginWorker({ identifier: credentials.identifier, password: pwd });
      return { success: res.success, error: res.error };
    } else if (role === 'admin') {
      const res = await loginAdmin({ identifier: credentials.identifier, password: pwd });
      return { success: res.success, error: res.error };
    } else {
      const res = await loginCustomer({ identifier: credentials.identifier, password: pwd });
      return { success: res.success, error: res.error };
    }
  };

  // Unified signup helper
  const signup = async (
    role: Role,
    userData: {
      name: string;
      phone: string;
      email?: string;
      password?: string;
      profession?: string;
      locality?: string;
      cooperativeBranch?: string;
      experienceYears?: number;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    const pwd = userData.password || 'sahyog@2026';
    if (role === 'worker') {
      const res = await registerWorker({
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        password: pwd,
        profession: userData.profession || 'Electrician',
        cooperativeBranch: userData.cooperativeBranch,
        experienceYears: userData.experienceYears,
      });
      return { success: res.success, error: res.error };
    } else {
      const res = await registerCustomer({
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        password: pwd,
        locality: userData.locality,
      });
      return { success: res.success, error: res.error };
    }
  };

  const logout = async (): Promise<void> => {
    const previousRole = session.role;
    await authService.logout();
    setSession({
      isAuthenticated: false,
      role: previousRole,
      user: null,
      token: undefined,
      refreshToken: undefined,
    });

    // Redirect to dedicated role login page
    switch (previousRole) {
      case 'worker':
        navigate('/worker/login');
        break;
      case 'admin':
        navigate('/admin/login');
        break;
      case 'customer':
      default:
        navigate('/customer/login');
        break;
    }
  };

  const refreshSession = async (): Promise<AuthResponse> => {
    const res = await authService.refreshSession();
    if (res.success && res.session) {
      setSession(res.session);
    }
    return res;
  };

  /**
   * SIH Development & Evaluation Quick Role Switcher
   * Clearly separated from production authentication logic.
   */
  const switchRole = (newRole: Role) => {
    let mockUser: AuthUser;

    if (newRole === 'worker') {
      mockUser = {
        id: 'w-demo-1',
        name: 'Ramesh Kumar',
        phone: '+91 98765 43210',
        email: 'ramesh.kumar@artisan.sahyog.in',
        role: 'worker',
        profession: 'Master Electrician',
        verificationStatus: 'VERIFIED',
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
        zone: 'Bengaluru East Zone',
        createdAt: '2026-01-10T09:30:00.000Z',
      };
    } else if (newRole === 'admin') {
      mockUser = {
        id: 'admin-demo-1',
        name: 'Vikramaditya Rao',
        phone: '+91 98112 33445',
        email: 'operations@sahyog.coop',
        role: 'admin',
        verificationStatus: 'VERIFIED',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        zone: 'Central Federation Operations Hub',
        createdAt: '2026-01-01T08:00:00.000Z',
      };
    } else {
      mockUser = DEFAULT_FALLBACK_USER;
    }

    const demoSession: AuthSession = {
      isAuthenticated: true,
      role: newRole,
      user: mockUser,
      token: `sahyog_demo_${newRole}_token`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    setSession(demoSession);

    switch (newRole) {
      case 'worker':
        navigate('/worker/home');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'customer':
      default:
        navigate('/customer/home');
        break;
    }
  };

  const canAccessRole = (targetRole: Role): boolean => {
    return session.isAuthenticated && session.role === targetRole;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        currentRole: session.role,
        currentPath,
        isLoading,
        navigate,
        loginCustomer,
        registerCustomer,
        loginWorker,
        registerWorker,
        loginAdmin,
        login,
        signup,
        logout,
        switchRole,
        canAccessRole,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
