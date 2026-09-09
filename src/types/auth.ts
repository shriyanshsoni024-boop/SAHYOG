import { Role, VerificationStatus } from './index';

/**
 * SAHYOG Authentication User Model
 */
export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
  zone?: string;
  profession?: string;
  cooperativeBranch?: string;
  experienceYears?: number;
}

/**
 * SAHYOG Active Authentication Session
 */
export interface AuthSession {
  isAuthenticated: boolean;
  role: Role;
  user: AuthUser | null;
  token?: string;
  refreshToken?: string;
  expiresAt?: number; // Unix timestamp in milliseconds
}

/**
 * Stored Secure User Record (Vault)
 * Note: Plaintext passwords are NEVER stored. Only cryptographic salt & hash.
 */
export interface SecureUserRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  passwordHash: string;
  passwordSalt: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
  zone?: string;
  profession?: string;
  cooperativeBranch?: string;
  experienceYears?: number;
}

// Request DTOs
export interface CustomerLoginDto {
  identifier: string; // phone or email
  password: string;
}

export interface CustomerRegisterDto {
  name: string;
  phone: string;
  email?: string;
  password: string;
  locality?: string;
}

export interface WorkerLoginDto {
  identifier: string; // phone or artisan ID
  password: string; // PIN or password
}

export interface WorkerRegisterDto {
  name: string;
  phone: string;
  email?: string;
  password: string;
  profession: string;
  cooperativeBranch?: string;
  experienceYears?: number;
}

export interface AdminLoginDto {
  identifier: string; // email or officer ID
  password: string; // security key
}

export interface AuthResponse {
  success: boolean;
  session?: AuthSession;
  user?: AuthUser | null;
  error?: string;
  message?: string;
}
