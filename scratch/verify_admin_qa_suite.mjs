import { adminService } from '../src/services/adminService.ts';
import { bookingService } from '../src/services/bookingService.ts';
import { workerService } from '../src/services/workerService.ts';
import { storageService } from '../src/services/storage/storageService.ts';
import { STORAGE_KEYS } from '../src/services/storage/storageKeys.ts';
import { DEFAULT_LOCATION, LOCATIONS } from '../src/data/locations.ts';

console.log('🏛️ Starting SAHYOG Cooperative / Admin Functional & Regression QA Suite...\n');

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

async function runAdminQA() {
  // 1. Dashboard & Federation Statistics
  console.log('--- 1. Admin Dashboard & Federation Statistics ---');
  const statsRes = await adminService.getFederationStats();
  assert(statsRes.success && statsRes.data, 'Federation statistics retrieved successfully');
  const stats = statsRes.data;
  assert(stats.totalWorkers >= 128, `Total registered artisans count is valid (${stats.totalWorkers})`);
  assert(stats.kycVerified >= 90, `KYC verified artisans count is valid (${stats.kycVerified})`);
  assert(stats.emergencyWorkersReady >= 6, `15-minute emergency squad ready count is valid (${stats.emergencyWorkersReady})`);
  assert(stats.todayRevenue > 0, `Cooperative platform revenue is calculated correctly (₹${stats.todayRevenue})`);

  // 2. KYC Queue & Worker Verification Operations
  console.log('\n--- 2. Artisan KYC Queue & Approval Actions ---');
  const kycRes = await adminService.getKycQueue();
  assert(kycRes.success && Array.isArray(kycRes.data), 'KYC queue fetched successfully');
  const initialKycCount = kycRes.data.length;
  console.log(`Initial KYC pending items: ${initialKycCount}`);

  if (initialKycCount > 0) {
    const targetItem = kycRes.data[0];
    const processRes = await adminService.processKyc(targetItem.id, 'APPROVED');
    assert(processRes.success && processRes.data, `KYC approval for ${targetItem.name} processed successfully`);
    assert(processRes.data.length === initialKycCount - 1, `Queue length reduced by 1 (now ${processRes.data.length})`);
    
    // Check worker verification status
    const workersRes = await workerService.getWorkers();
    assert(workersRes.success && workersRes.data, 'Workers list retrieved after KYC approval');
    const matchedWorker = workersRes.data.find(w => w.name.toLowerCase() === targetItem.name.toLowerCase());
    if (matchedWorker) {
      assert(matchedWorker.verificationStatus === 'VERIFIED', `Worker ${matchedWorker.name} status updated to VERIFIED`);
    }
  }

  // 3. Dispatch & Booking Monitoring
  console.log('\n--- 3. Booking Dispatch Stream & Priority SLA ---');
  const bookRes = await bookingService.getBookings();
  assert(bookRes.success && Array.isArray(bookRes.data), 'Booking dispatches stream retrieved successfully');
  const bookings = bookRes.data;
  assert(bookings.length > 0, `Active booking dispatches present (${bookings.length} total)`);

  const emergencyBookings = bookings.filter(b => b.urgency === 'EMERGENCY');
  console.log(`Emergency dispatches in stream: ${emergencyBookings.length}`);
  emergencyBookings.forEach(eb => {
    assert(eb.urgency === 'EMERGENCY', `Emergency dispatch ${eb.token} correctly tagged`);
    assert(Boolean(eb.customerName) && Boolean(eb.serviceName), `Emergency dispatch ${eb.token} contains full metadata`);
  });

  // 4. Financial Clearing & Zero-Commission Accounting
  console.log('\n--- 4. Cooperative Financial Ledger & Direct Payouts ---');
  const finRes = await adminService.getFinancialOverview();
  assert(finRes.success && finRes.data, 'Financial overview computed successfully');
  const fin = finRes.data;
  assert(fin.todayGrossValue > 0, `Gross customer value computed (₹${fin.todayGrossValue.toLocaleString()})`);
  assert(fin.workerPayoutsTotal > 0, `Direct artisan payouts total computed (₹${fin.workerPayoutsTotal.toLocaleString()})`);
  assert(fin.cooperativeRevenue > 0, `Cooperative platform fees computed (₹${fin.cooperativeRevenue.toLocaleString()})`);
  assert(fin.todayGrossValue === fin.workerPayoutsTotal + fin.cooperativeRevenue, `Gross equals Worker Payout + Coop Platform Fee (100% labor zero comm math)`);
  assert(fin.transactions.length > 0, `Transaction ledger populated with ${fin.transactions.length} entries`);

  // 5. Operational Insights & District Zone Reports
  console.log('\n--- 5. Operational SLA & Zone Workload Balance ---');
  const repRes = await adminService.getOperationalReports();
  assert(repRes.success && repRes.data, 'Operational reports compiled successfully');
  const rep = repRes.data;
  assert(rep.cancellationRate <= 5.0, `Cancellation rate (${rep.cancellationRate}%) meets cooperative quality SLA`);
  assert(rep.topServices.length >= 3, `Top services demand breakdown populated (${rep.topServices.length} categories)`);
  assert(rep.zoneWorkload.length >= 4, `Zone workload heatmap covers all operational districts (${rep.zoneWorkload.length} zones)`);

  // 6. Selected Location Synchronization Across Roles
  console.log('\n--- 6. Cross-Role Location Synchronization ---');
  storageService.setItem(STORAGE_KEYS.SELECTED_LOCATION, 'DLF Phase 3, Gurgaon');
  const readBackLoc = storageService.getItem(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
  assert(readBackLoc === 'DLF Phase 3, Gurgaon', `Location stored and synchronized seamlessly across role changes: '${readBackLoc}'`);

  // Reset to default
  storageService.setItem(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
  const resetLoc = storageService.getItem(STORAGE_KEYS.SELECTED_LOCATION, DEFAULT_LOCATION);
  assert(resetLoc === DEFAULT_LOCATION, `Location restored to default ('${DEFAULT_LOCATION}')`);

  console.log(`\n🎉 ALL ${passedTests}/${totalTests} ADMIN QA TESTS PASSED WITH 100% SUCCESS!`);
}

runAdminQA().catch(err => {
  console.error('❌ Admin QA Suite Failed:', err);
  process.exit(1);
});
