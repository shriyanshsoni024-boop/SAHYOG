/**
 * SAHYOG Application Storage Keys
 * Version-namespaced to prevent collisions and support schema upgrades.
 */
export const STORAGE_KEYS = {
  SCHEMA_VERSION: 'sahyog_schema_version',
  BOOKINGS: 'sahyog_bookings_v1',
  WORKERS: 'sahyog_workers_v1',
  EARNINGS: 'sahyog_earnings_v1',
  TRAINING_MODULES: 'sahyog_training_v1',
  SKILLS_MATRIX: 'sahyog_skills_v1',
  CERTIFICATES: 'sahyog_certificates_v1',
  REVIEWS: 'sahyog_reviews_v1',
  USERS: 'sahyog_users_v1',
  CURRENT_USER: 'sahyog_current_user_v1',
  KYC_QUEUE: 'sahyog_kyc_queue_v1',
  SELECTED_LOCATION: 'sahyog_selected_location_v1',
  AUTH_SESSION: 'sahyog_auth_session_v1',
  AUTH_USERS_VAULT: 'sahyog_auth_users_vault_v1',
} as const;

export const CURRENT_SCHEMA_VERSION = '1.0.0';
