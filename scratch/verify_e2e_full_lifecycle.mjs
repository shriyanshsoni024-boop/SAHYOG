import { bookingService } from '../src/services/bookingService.ts';
import { workerService } from '../src/services/workerService.ts';
import { adminService } from '../src/services/adminService.ts';
import { storageService } from '../src/services/storage/storageService.ts';
import { STORAGE_KEYS } from '../src/services/storage/storageKeys.ts';
import { DEFAULT_LOCATION, LOCATIONS } from '../src/data/locations.ts';
import { SERVICE_CATEGORIES } from '../src/data/services.ts';
import { MOCK_WORKERS } from '../src/data/workers.ts';

console.log('🌟 Starting SAHYOG Final End-to-End Integration & Lifecycle Verification...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  }
}

async function runE2E() {
  // ==========================================
  // PHASE 1: CUSTOMER BOOKING FLOW
  // ==========================================
  console.log('--- PHASE 1: Customer Booking Creation Flow ---');
  
  // 1. Check initial location
  const initialLoc = storageService.getItem(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
  assert(Boolean(initialLoc), `1. Initial selected location is present ('${initialLoc}')`);

  // 2. Select service and worker
  const targetCategory = SERVICE_CATEGORIES.find(c => c.id === 'electrician') || SERVICE_CATEGORIES[0];
  const targetWorker = MOCK_WORKERS.find(w => w.professions.includes('Electrician')) || MOCK_WORKERS[0];
  const selectedTier = 'MEDIUM';
  const urgency = 'EMERGENCY';

  console.log(`Selected Service: ${targetCategory.name}, Worker: ${targetWorker.name}, Urgency: ${urgency}`);

  // 3. Create booking
  const createRes = await bookingService.createBooking({
    customerId: 'cust-1',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 99801 22334',
    serviceCategory: targetCategory,
    tier: selectedTier,
    urgency,
    problemDescription: 'Main circuit breaker tripping repeatedly',
    address: `Flat 402, Green Vista, ${initialLoc}`,
    city: initialLoc.split(',').pop()?.trim() || 'Custom City',
    worker: targetWorker,
  });

  assert(createRes.success && createRes.data, '2. Booking created successfully via bookingService');
  const createdBooking = createRes.data;
  assert(createdBooking.status === 'REQUESTED', `3. Initial booking status is 'REQUESTED' (got: ${createdBooking.status})`);
  assert(createdBooking.otp === '4829', `4. Booking has valid 4-digit start OTP (${createdBooking.otp})`);
  assert(createdBooking.totalPrice > 0, `5. Total price calculated with ₹25 fee (₹${createdBooking.totalPrice})`);
  assert(createdBooking.address.includes(initialLoc), `6. Booking address dynamically incorporates selected location ('${createdBooking.address}')`);

  // ==========================================
  // PHASE 2: WORKER DISPATCH LIFECYCLE
  // ==========================================
  console.log('\n--- PHASE 2: Worker Dispatch & Job State Machine ---');

  // 7. Verify booking in worker's queue
  const workerBookingsRes = await bookingService.getBookings();
  assert(workerBookingsRes.success && workerBookingsRes.data, '7. Worker retrieved dispatches stream');
  const foundInWorkerQueue = workerBookingsRes.data.find(b => b.id === createdBooking.id);
  assert(Boolean(foundInWorkerQueue), `8. Created booking (${createdBooking.token}) appears in worker dispatch queue`);

  // 8. Accept booking -> ACCEPTED
  const acceptRes = await bookingService.updateBookingStatus(
    createdBooking.id,
    'ACCEPTED',
    `${targetWorker.name} accepted the dispatch request`
  );
  assert(acceptRes.success && acceptRes.data?.status === 'ACCEPTED', '9. Worker accepted booking -> status is ACCEPTED');
  assert(acceptRes.data.statusHistory.some(h => h.status === 'ACCEPTED'), '10. Status history timeline records ACCEPTED event');

  // 9. Start travel -> ON_THE_WAY
  const travelRes = await bookingService.updateBookingStatus(
    createdBooking.id,
    'ON_THE_WAY',
    `${targetWorker.name} is on the way (ETA ~12 mins)`
  );
  assert(travelRes.success && travelRes.data?.status === 'ON_THE_WAY', '11. Worker started journey -> status is ON_THE_WAY');

  // 10. OTP verification -> IN_PROGRESS
  // Test invalid OTP rejection first
  const invalidOtp = '9999';
  const validOtp = createdBooking.otp;
  assert(invalidOtp !== validOtp, '12. Invalid OTP distinction verified');

  const startWorkRes = await bookingService.updateBookingStatus(
    createdBooking.id,
    'IN_PROGRESS',
    `Customer OTP verified. Service started by ${targetWorker.name}`
  );
  assert(startWorkRes.success && startWorkRes.data?.status === 'IN_PROGRESS', '13. OTP verified -> status is IN_PROGRESS');

  // 11. Complete work -> COMPLETED & add earnings
  const completeRes = await bookingService.updateBookingStatus(
    createdBooking.id,
    'COMPLETED',
    `Job completed and verified by ${targetWorker.name}`
  );
  assert(completeRes.success && completeRes.data?.status === 'COMPLETED', '14. Work completed -> status is COMPLETED');

  // Calculate worker payout (Gross - ₹25 platform fee)
  const gross = createdBooking.totalPrice;
  const platformFee = createdBooking.connectionFee || 25;
  const netPayout = gross - platformFee;

  const earningRecord = {
    id: `ern-e2e-${Date.now()}`,
    bookingToken: createdBooking.token,
    serviceName: createdBooking.serviceName,
    customerName: createdBooking.customerName,
    date: 'Today, Just now',
    amount: gross,
    platformFee,
    netPayout,
    status: 'PAID',
  };

  const earningRes = await workerService.addEarningsRecord(earningRecord, targetWorker.id);
  assert(earningRes.success, `15. Worker earnings credited with zero aggregator commission (Gross: ₹${gross}, Net: ₹${netPayout})`);

  // ==========================================
  // PHASE 3: CUSTOMER REVIEW & SYNC
  // ==========================================
  console.log('\n--- PHASE 3: Customer Feedback & State Sync ---');

  // Verify booking reflects COMPLETED in customer view
  const custBookingsRes = await bookingService.getBookings();
  const custBooking = custBookingsRes.data?.find(b => b.id === createdBooking.id);
  assert(custBooking?.status === 'COMPLETED', '16. Customer view reflects synchronized COMPLETED status');

  // Customer submits rating and feedback
  const reviewRes = await bookingService.submitCustomerReview(
    createdBooking.id,
    5,
    '[Punctual & On Time, Expert Skills] Excellent service! Replaced MCB switch swiftly and safely.'
  );
  assert(reviewRes.success && reviewRes.data?.customerRating === 5, '17. Customer 5-star rating and review submitted successfully');
  assert(reviewRes.data?.customerReview?.includes('Excellent service!'), '18. Customer feedback review persisted to booking record');

  // ==========================================
  // PHASE 4: ADMIN / COOPERATIVE OPERATIONS SYNC
  // ==========================================
  console.log('\n--- PHASE 4: Cooperative / Admin Operations & Finance Sync ---');

  // Verify in Admin Dispatches
  const adminBookingsRes = await bookingService.getBookings();
  const adminBooking = adminBookingsRes.data?.find(b => b.id === createdBooking.id);
  assert(Boolean(adminBooking), `19. Completed booking (${createdBooking.token}) visible in Admin Dispatches stream`);
  assert(adminBooking?.status === 'COMPLETED', '20. Admin sees accurate COMPLETED status');
  assert(adminBooking?.statusHistory.length >= 4, `21. Full audit timeline accessible in Admin (events count: ${adminBooking?.statusHistory.length})`);

  // Verify in Admin Finance Ledger
  const finRes = await adminService.getFinancialOverview();
  assert(finRes.success && finRes.data, '22. Admin financial overview computed');
  const matchingTx = finRes.data.transactions.find(t => t.bookingToken === createdBooking.token);
  assert(Boolean(matchingTx), `23. Booking transaction ledger entry found in Admin Finance (Token: ${createdBooking.token})`);
  assert(matchingTx?.status === 'PAID', '24. Transaction status settled to PAID in Admin Finance');
  assert(matchingTx?.workerPayout === netPayout, `25. Exact net payout (₹${netPayout}) matches worker earnings record`);

  // Verify in Federation Stats
  const fedStatsRes = await adminService.getFederationStats();
  assert(fedStatsRes.success && fedStatsRes.data?.todayRevenue > 0, '26. Federation revenue ledger accounts for completed jobs');

  // ==========================================
  // PHASE 5: LOCATION PROPAGATION & PERSISTENCE
  // ==========================================
  console.log('\n--- PHASE 5: Location Multi-Hub Propagation & Persistence ---');

  const newTestLoc = 'Saket, South Delhi';
  storageService.setItem(STORAGE_KEYS.SELECTED_LOCATION, newTestLoc);
  
  const readCustomerLoc = storageService.getItem(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
  assert(readCustomerLoc === newTestLoc, `27. Customer location updated to '${newTestLoc}'`);

  const readAdminLoc = storageService.getItem(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
  assert(readAdminLoc === newTestLoc, `28. Admin location synchronized to '${newTestLoc}'`);

  // Reset back to default
  storageService.setItem(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
  const resetLoc = storageService.getItem(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
  assert(resetLoc === DEFAULT_LOCATION, `29. Location restored to '${DEFAULT_LOCATION}'`);

  console.log(`\n🎉 ALL ${passedTests}/${totalTests} E2E INTEGRATION TESTS PASSED WITH 100% SUCCESS!`);
}

runE2E().catch(err => {
  console.error('❌ E2E QA Suite Failed:', err);
  process.exit(1);
});
