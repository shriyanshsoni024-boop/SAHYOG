// Mock Browser Environment & localStorage
const store = new Map();
global.window = {
  localStorage: {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  },
  location: {
    pathname: '/customer/home',
    hash: '',
  },
  history: {
    pushState: (state, title, url) => {
      global.window.location.pathname = url;
    }
  },
  addEventListener: () => {},
  removeEventListener: () => {},
};
global.localStorage = global.window.localStorage;

import { authService } from '../src/services/auth/authService.js';
import { hashPasswordWithSalt, verifyPassword } from '../src/services/auth/cryptoUtils.js';

async function runAuthBackendVerification() {
  console.log('===============================================================');
  console.log('     SAHYOG REAL AUTHENTICATION BACKEND ARCHITECTURE TESTS     ');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, description) {
    total++;
    if (condition) {
      console.log(`✅ PASS [${total}]: ${description}`);
      passed++;
    } else {
      console.error(`❌ FAIL [${total}]: ${description}`);
    }
  }

  // 1. CRYPTO HASHING TESTS
  console.log('--- 1. Cryptographic Password Hashing & Salt Verification ---');
  const pwd = 'mySecretPassword@123';
  const { hash, salt } = await hashPasswordWithSalt(pwd);
  assert(hash && hash.length === 64, 'Generated 64-char SHA-256 hash');
  assert(salt && salt.length >= 16, 'Generated cryptographic random salt');
  assert(hash !== pwd, 'Hash does NOT contain plaintext password');

  const validVerification = await verifyPassword(pwd, hash, salt);
  assert(validVerification === true, 'Correct password verifies successfully');

  const invalidVerification = await verifyPassword('wrongPassword', hash, salt);
  assert(invalidVerification === false, 'Wrong password rejected');

  // 2. CUSTOMER AUTHENTICATION FLOW
  console.log('\n--- 2. Customer Auth (Login & Registration) ---');
  // 2a. Valid Customer Login
  const custLoginRes = await authService.loginCustomer({
    identifier: '9980122334',
    password: 'sahyog@2026',
  });
  assert(custLoginRes.success === true, 'Customer login succeeded for demo seed Ananya');
  assert(custLoginRes.session?.role === 'customer', 'Session role is "customer"');
  assert(custLoginRes.session?.token && custLoginRes.session.token.startsWith('sahyog_customer'), 'Issued customer JWT token');
  assert(custLoginRes.session?.expiresAt > Date.now(), 'Token has future expiration timestamp');

  // 2b. Invalid Customer Login (Wrong Password)
  const custBadLogin = await authService.loginCustomer({
    identifier: '9980122334',
    password: 'wrongPassword',
  });
  assert(custBadLogin.success === false, 'Customer login rejected wrong password');
  assert(custBadLogin.error?.includes('password') || custBadLogin.error?.includes('credentials'), 'Returned descriptive error');

  // 2c. Customer Registration
  const newCustPhone = '9811223344';
  const custRegRes = await authService.registerCustomer({
    name: 'Priya Sharma',
    phone: newCustPhone,
    email: 'priya.sharma@example.com',
    password: 'priyaPassword@2026',
    locality: 'Koramangala, Bangalore',
  });
  assert(custRegRes.success === true, 'Customer registration succeeded for Priya Sharma');
  assert(custRegRes.user?.name === 'Priya Sharma', 'Registered user profile populated');

  // 2d. Duplicate Customer Registration Prevention
  const dupCustReg = await authService.registerCustomer({
    name: 'Priya Sharma 2',
    phone: newCustPhone,
    password: 'anotherPassword',
  });
  assert(dupCustReg.success === false, 'Duplicate customer phone registration blocked');
  assert(dupCustReg.error?.includes('already exists'), 'Returned duplicate account error message');

  // 3. WORKER / ARTISAN AUTHENTICATION FLOW
  console.log('\n--- 3. Worker / Artisan Auth (Login & Registration) ---');
  // 3a. Valid Worker Login
  const workerLoginRes = await authService.loginWorker({
    identifier: '9876543210',
    password: 'artisan@2026',
  });
  assert(workerLoginRes.success === true, 'Worker login succeeded for demo seed Ramesh Kumar');
  assert(workerLoginRes.session?.role === 'worker', 'Session role is "worker"');
  assert(workerLoginRes.session?.user?.profession === 'Master Electrician', 'Worker profession loaded');

  // 3b. Invalid Worker Login (Wrong PIN)
  const workerBadLogin = await authService.loginWorker({
    identifier: '9876543210',
    password: '9999',
  });
  assert(workerBadLogin.success === false, 'Worker login rejected wrong PIN');

  // 3c. Worker Registration
  const newWorkerPhone = '9711223344';
  const workerRegRes = await authService.registerWorker({
    name: 'Suresh Patil',
    phone: newWorkerPhone,
    email: 'suresh.patil@artisan.sahyog.in',
    password: 'patilArtisanPIN',
    profession: 'Plumber',
    cooperativeBranch: 'South Bengaluru Plumbing Guild',
    experienceYears: 6,
  });
  assert(workerRegRes.success === true, 'Artisan registration succeeded for Suresh Patil');
  assert(workerRegRes.user?.verificationStatus === 'UNDER_REVIEW', 'New artisan set to UNDER_REVIEW');

  // 3d. Duplicate Worker Registration Prevention
  const dupWorkerReg = await authService.registerWorker({
    name: 'Suresh Duplicate',
    phone: newWorkerPhone,
    password: 'somePin',
    profession: 'Plumber',
  });
  assert(dupWorkerReg.success === false, 'Duplicate artisan phone registration blocked');

  // 4. ADMIN AUTHENTICATION FLOW
  console.log('\n--- 4. Cooperative Admin Auth ---');
  // 4a. Valid Admin Login
  const adminLoginRes = await authService.loginAdmin({
    identifier: 'operations@sahyog.coop',
    password: 'admin@sahyog2026',
  });
  assert(adminLoginRes.success === true, 'Admin login succeeded for Vikramaditya Rao');
  assert(adminLoginRes.session?.role === 'admin', 'Session role is "admin"');

  // 4b. Invalid Admin Security Key
  const adminBadLogin = await authService.loginAdmin({
    identifier: 'operations@sahyog.coop',
    password: 'invalidSecurityKey',
  });
  assert(adminBadLogin.success === false, 'Admin login rejected invalid security key');

  // 5. SESSION EXPIRATION & LOGOUT
  console.log('\n--- 5. Session State, Expiration & Logout ---');
  assert(authService.isAuthenticated() === true, 'authService.isAuthenticated() is true after login');
  assert(authService.hasRole('admin') === true, 'authService.hasRole("admin") is true');
  assert(authService.hasRole('worker') === false, 'authService.hasRole("worker") is false for admin session');

  await authService.logout();
  assert(authService.isAuthenticated() === false, 'Session cleared on logout');
  assert(authService.getCurrentSession() === null, 'authService.getCurrentSession() is null after logout');

  console.log(`\n===============================================================`);
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log(`===============================================================\n`);
}

runAuthBackendVerification();
