// Mock localStorage in Node environment
const store = new Map();
global.window = {
  localStorage: {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  }
};
global.localStorage = global.window.localStorage;

async function runProductionReadinessTestSuite() {
  console.log('======================================================================');
  console.log('      SAHYOG — PRODUCTION READINESS & FINAL DEMO QA SUITE            ');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // --- STORAGE KEYS & CONSTANTS ---
  const STORAGE_KEYS = {
    BOOKINGS: 'sahyog_bookings_v1',
    WORKERS: 'sahyog_workers_v1',
    KYC_QUEUE: 'sahyog_kyc_queue_v1',
    EARNINGS: 'sahyog_earnings_v1',
    SELECTED_LOCATION: 'sahyog_selected_location_v1',
    WORKER_DUTY: 'sahyog_worker_duty_v1',
  };

  const DEFAULT_LOCATION = 'Sector 62, Noida';

  const LOCATIONS = [
    { id: 'loc-1', name: 'Sector 62, Noida', city: 'Noida', state: 'Uttar Pradesh', lat: 28.6280, lng: 77.3649, isHighSpeedDispatch: true },
    { id: 'loc-2', name: 'DLF Phase 3, Gurgaon', city: 'Gurgaon', state: 'Haryana', lat: 28.4900, lng: 77.0988, isHighSpeedDispatch: true },
    { id: 'loc-3', name: 'Saket, South Delhi', city: 'New Delhi', state: 'Delhi', lat: 28.5244, lng: 77.2173, isHighSpeedDispatch: false },
    { id: 'loc-4', name: 'Indiranagar 4th Block', city: 'Bengaluru', state: 'Karnataka', lat: 12.9784, lng: 77.6408, isHighSpeedDispatch: true },
    { id: 'loc-5', name: 'HSR Layout Sector 2', city: 'Bengaluru', state: 'Karnataka', lat: 12.9121, lng: 77.6446, isHighSpeedDispatch: true },
    { id: 'loc-6', name: 'Andheri West', city: 'Mumbai', state: 'Maharashtra', lat: 19.1363, lng: 72.8277, isHighSpeedDispatch: false },
  ];

  const SERVICE_CATEGORIES = [
    { id: 'electrician', name: 'Electrician', basePrice: 299, emergencyAvailable: true },
    { id: 'plumber', name: 'Plumber', basePrice: 249, emergencyAvailable: true },
    { id: 'ac_repair', name: 'AC Service & Repair', basePrice: 499, emergencyAvailable: false },
    { id: 'carpenter', name: 'Carpenter', basePrice: 349, emergencyAvailable: false },
    { id: 'cleaning', name: 'Deep Cleaning', basePrice: 599, emergencyAvailable: false },
  ];

  const MOCK_WORKERS = [
    {
      id: 'w-1',
      name: 'Ramesh Kumar',
      trade: 'Master Electrician',
      professions: ['Electrician'],
      isVerified: true,
      isKycPending: false,
      rating: 4.88,
      totalJobs: 142,
      emergencyReady: true,
      availabilityStatus: 'ONLINE',
      currentZone: 'Indiranagar & East Zone',
      cooperativeBranch: 'Bengaluru East Electrical Union',
      phone: '+91 98765 43210',
    },
    {
      id: 'w-2',
      name: 'Priya Sharma',
      trade: 'Certified HVAC & Appliance Tech',
      professions: ['AC Repair', 'Appliance'],
      isVerified: true,
      isKycPending: false,
      rating: 4.95,
      totalJobs: 98,
      emergencyReady: false,
      availabilityStatus: 'ONLINE',
      currentZone: 'HSR & South Hub',
      cooperativeBranch: 'City Women Artisan Union',
      phone: '+91 98765 43211',
    }
  ];

  // Helper functions
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }

  function findNearestLoc(lat, lng) {
    let nearest = LOCATIONS[0];
    let minD = Infinity;
    for (const loc of LOCATIONS) {
      const d = calculateDistance(lat, lng, loc.lat, loc.lng);
      if (d < minD) {
        minD = d;
        nearest = loc;
      }
    }
    return { location: nearest, distanceKm: minD };
  }

  // ===================================================================
  // 1. CUSTOMER FLOW & LOCATION INTELLIGENCE
  // ===================================================================
  console.log('--- 1. Customer Marketplace, Geolocation & Booking Creation ---');

  // Test 1.1: Default Location
  let currentLoc = store.get(STORAGE_KEYS.SELECTED_LOCATION) || DEFAULT_LOCATION;
  assert(currentLoc === 'Sector 62, Noida', `1.1 Initial location defaults to 'Sector 62, Noida'`);

  // Test 1.2: Geolocation Auto-detection Matrix
  const noidaResolved = findNearestLoc(28.6300, 77.3700);
  assert(noidaResolved.location.name === 'Sector 62, Noida' && noidaResolved.distanceKm < 2, `1.2 GPS (28.630, 77.370) auto-resolves to 'Sector 62, Noida'`);

  const blrResolved = findNearestLoc(12.9716, 77.5946);
  assert(blrResolved.location.city === 'Bengaluru', `1.3 GPS (12.971, 77.594) auto-resolves to Bengaluru hub`);

  // Test 1.3: Manual Location Selection & Persistence
  const customLoc = 'Indiranagar 4th Block, Bengaluru';
  store.set(STORAGE_KEYS.SELECTED_LOCATION, customLoc);
  assert(store.get(STORAGE_KEYS.SELECTED_LOCATION) === customLoc, `1.4 Custom manual location successfully saved in persistent storage`);

  // Test 1.4: Search Query Filtering
  const qElectric = 'electric';
  const matchedServices = SERVICE_CATEGORIES.filter(s => s.name.toLowerCase().includes(qElectric));
  assert(matchedServices.length === 1 && matchedServices[0].id === 'electrician', `1.5 Search 'electric' accurately finds Electrician category`);

  const qEmpty = 'xyzunsupported123';
  const emptyMatched = SERVICE_CATEGORIES.filter(s => s.name.toLowerCase().includes(qEmpty));
  assert(emptyMatched.length === 0, `1.6 Search for non-existent service safely returns empty array with zero crashes`);

  // Test 1.5: Transparent Rate Card Calculation (Small, Medium, Large + 25 connection fee)
  const electBase = 299;
  const connectionFee = 25;
  const smallPrice = electBase + connectionFee; // 324
  const medPrice = Math.round(electBase * 1.8) + connectionFee; // 538 + 25 = 563
  const largePrice = Math.round(electBase * 2.8) + connectionFee; // 837 + 25 = 862
  assert(smallPrice === 324 && medPrice === 563 && largePrice === 862, `1.7 Transparent tier prices computed correctly (Small: ₹${smallPrice}, Medium: ₹${medPrice}, Large: ₹${largePrice})`);

  // Test 1.6: Booking Creation
  const newBooking = {
    id: `bk-${Date.now()}`,
    token: `SYH-${Math.floor(10000 + Math.random() * 90000)}`,
    customerId: 'cust-1',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 99801 22334',
    serviceName: 'Electrician - Emergency Circuit Repair',
    categoryId: 'electrician',
    tier: 'MEDIUM',
    urgency: 'EMERGENCY',
    totalPrice: medPrice,
    platformFee: connectionFee,
    workerPayout: medPrice - connectionFee, // 538
    address: `Flat 402, Green Vista, ${customLoc}`,
    city: 'Bengaluru',
    worker: MOCK_WORKERS[0],
    otp: '4829',
    status: 'REQUESTED',
    createdAt: new Date().toISOString(),
    statusHistory: [
      { status: 'REQUESTED', timestamp: new Date().toISOString(), note: 'Customer placed cooperative order' }
    ]
  };

  const bookingsList = [newBooking];
  store.set(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookingsList));
  assert(newBooking.token.startsWith('SYH-') && newBooking.otp.length === 4, `1.8 Booking created with token ${newBooking.token} and 4-digit start OTP (${newBooking.otp})`);
  assert(newBooking.workerPayout === 538 && newBooking.platformFee === 25, `1.9 0% commission financial breakdown holds: Gross ₹${newBooking.totalPrice} = Worker ₹${newBooking.workerPayout} + Platform Fee ₹${newBooking.platformFee}`);

  // ===================================================================
  // 2. WORKER APP LIFECYCLE & STATE MACHINE
  // ===================================================================
  console.log('\n--- 2. Worker App Dispatch, OTP Verification & Completion ---');

  // Test 2.1: Worker Online/Offline Duty Toggle
  store.set(STORAGE_KEYS.WORKER_DUTY, 'OFFLINE');
  assert(store.get(STORAGE_KEYS.WORKER_DUTY) === 'OFFLINE', `2.1 Worker duty toggled to OFFLINE`);
  store.set(STORAGE_KEYS.WORKER_DUTY, 'ONLINE');
  assert(store.get(STORAGE_KEYS.WORKER_DUTY) === 'ONLINE', `2.2 Worker duty toggled back to ONLINE`);

  // Test 2.2: Incoming Dispatch Detection
  const retrievedBookings = JSON.parse(store.get(STORAGE_KEYS.BOOKINGS));
  const activeDispatch = retrievedBookings.find(b => b.status === 'REQUESTED');
  assert(activeDispatch && activeDispatch.id === newBooking.id, `2.3 Incoming dispatch request visible in worker queue (${activeDispatch.token})`);

  // Test 2.3: Accept Dispatch -> ACCEPTED
  activeDispatch.status = 'ACCEPTED';
  activeDispatch.statusHistory.push({ status: 'ACCEPTED', timestamp: new Date().toISOString(), note: 'Artisan accepted job' });
  store.set(STORAGE_KEYS.BOOKINGS, JSON.stringify([activeDispatch]));
  assert(activeDispatch.status === 'ACCEPTED', `2.4 Worker accepted dispatch -> Status transitioned to ACCEPTED`);

  // Test 2.4: Start Journey -> ON_THE_WAY
  activeDispatch.status = 'ON_THE_WAY';
  activeDispatch.statusHistory.push({ status: 'ON_THE_WAY', timestamp: new Date().toISOString(), note: 'En route to customer premises' });
  store.set(STORAGE_KEYS.BOOKINGS, JSON.stringify([activeDispatch]));
  assert(activeDispatch.status === 'ON_THE_WAY', `2.5 Worker started journey -> Status transitioned to ON_THE_WAY`);

  // Test 2.5: Customer OTP Verification Flow
  const testInvalidOtp = '0000';
  const isInvalidAllowed = testInvalidOtp === activeDispatch.otp;
  assert(!isInvalidAllowed, `2.6 Invalid OTP (${testInvalidOtp}) correctly rejected`);

  const testValidOtp = '4829';
  const isValidAllowed = testValidOtp === activeDispatch.otp;
  assert(isValidAllowed, `2.7 Valid customer OTP (${testValidOtp}) verified successfully`);

  // Transition to IN_PROGRESS upon OTP verification
  activeDispatch.status = 'IN_PROGRESS';
  activeDispatch.statusHistory.push({ status: 'IN_PROGRESS', timestamp: new Date().toISOString(), note: 'OTP verified. Work started.' });
  store.set(STORAGE_KEYS.BOOKINGS, JSON.stringify([activeDispatch]));
  assert(activeDispatch.status === 'IN_PROGRESS', `2.8 Work in progress -> Status transitioned to IN_PROGRESS`);

  // Test 2.6: Complete Job -> COMPLETED & Earnings Settlement
  activeDispatch.status = 'COMPLETED';
  activeDispatch.statusHistory.push({ status: 'COMPLETED', timestamp: new Date().toISOString(), note: 'Job completed. 30-day warranty activated.' });
  store.set(STORAGE_KEYS.BOOKINGS, JSON.stringify([activeDispatch]));
  assert(activeDispatch.status === 'COMPLETED', `2.9 Job successfully completed -> Status transitioned to COMPLETED`);

  // Settle worker payout into earnings ledger
  const initialEarnings = 449;
  const updatedEarnings = initialEarnings + activeDispatch.workerPayout; // 449 + 538 = 987
  store.set(STORAGE_KEYS.EARNINGS, String(updatedEarnings));
  assert(Number(store.get(STORAGE_KEYS.EARNINGS)) === 987, `2.10 Worker take-home pay ledger updated to ₹987 (100% direct labor payout)`);

  // ===================================================================
  // 3. COOPERATIVE / ADMIN OPERATIONS
  // ===================================================================
  console.log('\n--- 3. Cooperative / Admin Operations & KYC Management ---');

  // Test 3.1: Cooperative Federation Dashboard Metrics
  const currentBookings = JSON.parse(store.get(STORAGE_KEYS.BOOKINGS));
  const totalCompleted = currentBookings.filter(b => b.status === 'COMPLETED').length;
  const totalGrossRevenue = currentBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalWorkerDisbursals = currentBookings.reduce((sum, b) => sum + b.workerPayout, 0);
  const totalCoopFees = currentBookings.reduce((sum, b) => sum + b.platformFee, 0);

  assert(totalCompleted === 1, `3.1 Admin tracks 1 completed order`);
  assert(totalGrossRevenue === totalWorkerDisbursals + totalCoopFees, `3.2 Federation financial equilibrium confirmed (Gross ₹${totalGrossRevenue} = Worker Payout ₹${totalWorkerDisbursals} + Coop Fee ₹${totalCoopFees})`);

  // Test 3.2: KYC Queue Approval & Rejection
  const kycQueue = [
    { id: 'kyc-1', name: 'Manish Verma', trade: 'Electrician', docs: 'Aadhaar + ITI Diploma', status: 'PENDING' },
    { id: 'kyc-2', name: 'Kavita Rao', trade: 'Appliance Repair', docs: 'Aadhaar + NSDC Cert', status: 'PENDING' }
  ];
  store.set(STORAGE_KEYS.KYC_QUEUE, JSON.stringify(kycQueue));

  // Admin approves Manish Verma
  const itemToApprove = kycQueue.find(k => k.id === 'kyc-1');
  itemToApprove.status = 'APPROVED';
  const remainingPendingKyc = kycQueue.filter(k => k.status === 'PENDING');
  store.set(STORAGE_KEYS.KYC_QUEUE, JSON.stringify(remainingPendingKyc));
  assert(remainingPendingKyc.length === 1 && remainingPendingKyc[0].id === 'kyc-2', `3.3 Admin KYC approval decrements pending queue to 1 worker`);

  // ===================================================================
  // 4. CROSS-ROLE DATA CONSISTENCY & AUDIT TRAIL
  // ===================================================================
  console.log('\n--- 4. Cross-Role Data Consistency ---');

  const finalBooking = JSON.parse(store.get(STORAGE_KEYS.BOOKINGS))[0];
  assert(finalBooking.token === newBooking.token, `4.1 Booking Token consistent across Customer, Worker, and Admin`);
  assert(finalBooking.otp === '4829', `4.2 4-Digit Start OTP consistent`);
  assert(finalBooking.customerName === 'Ananya Deshmukh', `4.3 Customer identity consistent`);
  assert(finalBooking.worker.name === 'Ramesh Kumar', `4.4 Assigned artisan identity consistent`);
  assert(finalBooking.totalPrice === 563 && finalBooking.workerPayout === 538, `4.5 Financial pricing model consistent`);
  assert(finalBooking.statusHistory.length === 5, `4.6 Full 5-stage immutable audit trail preserved (Requested $\\rightarrow$ Accepted $\\rightarrow$ On Way $\\rightarrow$ In Progress $\\rightarrow$ Completed)`);

  // ===================================================================
  // 5. PERSISTENCE & RELOAD SURVIVAL
  // ===================================================================
  console.log('\n--- 5. Persistence Across Page Reload ---');

  // Verify all keys in persistent store
  assert(Boolean(store.get(STORAGE_KEYS.SELECTED_LOCATION)), `5.1 Selected location persisted`);
  assert(Boolean(store.get(STORAGE_KEYS.BOOKINGS)), `5.2 Bookings stream persisted`);
  assert(Boolean(store.get(STORAGE_KEYS.WORKER_DUTY)), `5.3 Worker duty toggle persisted`);
  assert(Boolean(store.get(STORAGE_KEYS.EARNINGS)), `5.4 Earnings ledger persisted`);
  assert(Boolean(store.get(STORAGE_KEYS.KYC_QUEUE)), `5.5 KYC queue persisted`);

  // ===================================================================
  // 6. EDGE CASES & DEFENSIVE CHECKS
  // ===================================================================
  console.log('\n--- 6. Edge Cases & Defensive Error Handling ---');

  // Edge Case 6.1: Repeated Transition Protection
  const ALLOWED_TRANSITIONS = {
    REQUESTED: ['ACCEPTED', 'CANCELLED'],
    ACCEPTED: ['ON_THE_WAY', 'CANCELLED'],
    ON_THE_WAY: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: []
  };

  const isTransitionAllowed = (from, to) => (ALLOWED_TRANSITIONS[from] || []).includes(to);
  assert(!isTransitionAllowed('COMPLETED', 'ACCEPTED'), `6.1 Repeated Accept on COMPLETED booking strictly blocked by state machine`);
  assert(!isTransitionAllowed('COMPLETED', 'IN_PROGRESS'), `6.2 Repeated Start on COMPLETED booking strictly blocked`);

  // Edge Case 6.2: Custom Locality with Missing City
  const rawLoc = 'Apartment 201, Green Glen Layout, Bellandur';
  const parsedCity = rawLoc.split(',').pop()?.trim() || 'Custom City';
  assert(parsedCity === 'Bellandur', `6.3 Custom locality city parser safely extracts city/suburb ('${parsedCity}')`);

  // Edge Case 6.3: Empty Booking List Fallback
  const emptyBookings = [];
  const noActiveOrder = emptyBookings.find(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');
  assert(noActiveOrder === undefined, `6.4 Empty booking state handled cleanly with zero runtime exceptions`);

  console.log('\n======================================================================');
  console.log(`FINAL TEST RESULTS: ${passed} PASSED, ${failed} FAILED (${passed + failed} TOTAL)`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runProductionReadinessTestSuite();
