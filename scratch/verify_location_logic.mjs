import { LOCATIONS, DEFAULT_LOCATION, calculateDistanceKm, findNearestLocation } from '../src/data/locations.ts';
import { STORAGE_KEYS } from '../src/services/storage/storageKeys.ts';

console.log('🧪 Starting SAHYOG Location Logic & Haversine Distance QA Verification...\n');

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

// 1. Data Integrity Tests
console.log('--- 1. Data Integrity & Default Values ---');
assert(DEFAULT_LOCATION === 'Sector 62, Noida', `DEFAULT_LOCATION is 'Sector 62, Noida' (got: ${DEFAULT_LOCATION})`);
assert(Array.isArray(LOCATIONS) && LOCATIONS.length === 6, `LOCATIONS has 6 supported regions (got: ${LOCATIONS.length})`);
assert(STORAGE_KEYS.SELECTED_LOCATION === 'sahyog_selected_location_v1', `STORAGE_KEYS.SELECTED_LOCATION is configured correctly (got: ${STORAGE_KEYS.SELECTED_LOCATION})`);

// Verify all locations have valid GPS coordinates, area, city, tag
LOCATIONS.forEach((loc, idx) => {
  assert(
    typeof loc.lat === 'number' && loc.lat > 0 &&
    typeof loc.lng === 'number' && loc.lng > 0 &&
    Boolean(loc.area) && Boolean(loc.city) && Boolean(loc.tag),
    `Location [${idx}] ${loc.area} has valid coordinates (${loc.lat}, ${loc.lng}) and metadata`
  );
});

// 2. Haversine Distance Tests
console.log('\n--- 2. Haversine Distance Calculations ---');
const distSamePoint = calculateDistanceKm(28.6280, 77.3649, 28.6280, 77.3649);
assert(distSamePoint === 0, `Distance between identical points is 0 km (got: ${distSamePoint})`);

const distNoidaToGurgaon = calculateDistanceKm(28.6280, 77.3649, 28.4900, 77.0988);
assert(distNoidaToGurgaon > 25 && distNoidaToGurgaon < 40, `Distance between Noida & Gurgaon is ~30 km (got: ${distNoidaToGurgaon.toFixed(2)} km)`);

const distDelhiToBangalore = calculateDistanceKm(28.6280, 77.3649, 12.9784, 77.6408);
assert(distDelhiToBangalore > 1500 && distDelhiToBangalore < 2000, `Distance between Delhi & Bengaluru is ~1740 km (got: ${distDelhiToBangalore.toFixed(2)} km)`);

// 3. Nearest Location Auto-Detection Tests
console.log('\n--- 3. Nearest Locality Resolution Matrix ---');

// Test A: Coordinates in East Delhi / Indirapuram -> Sector 62, Noida
const nearestEastDelhi = findNearestLocation(28.6350, 77.3700);
assert(nearestEastDelhi.area === 'Sector 62, Noida', `East Delhi / Indirapuram coordinates resolve to 'Sector 62, Noida' (got: ${nearestEastDelhi.area})`);

// Test B: Coordinates in Cyber City, Gurgaon -> DLF Phase 3, Gurgaon
const nearestGurgaon = findNearestLocation(28.4950, 77.0890);
assert(nearestGurgaon.area === 'DLF Phase 3, Gurgaon', `Cyber City coordinates resolve to 'DLF Phase 3, Gurgaon' (got: ${nearestGurgaon.area})`);

// Test C: Coordinates in Hauz Khas / Greater Kailash -> Saket, South Delhi
const nearestSouthDelhi = findNearestLocation(28.5350, 77.2100);
assert(nearestSouthDelhi.area === 'Saket, South Delhi', `South Delhi coordinates resolve to 'Saket, South Delhi' (got: ${nearestSouthDelhi.area})`);

// Test D: Coordinates in Koramangala / MG Road, Bengaluru -> Indiranagar 4th Block or HSR Layout
const nearestKoramangala = findNearestLocation(12.9352, 77.6245);
assert(
  nearestKoramangala.city === 'Bengaluru',
  `Koramangala coordinates resolve to Bengaluru hub (got: ${nearestKoramangala.area}, ${nearestKoramangala.city})`
);

// Test E: Coordinates in Bandra / Juhu, Mumbai -> Andheri West
const nearestMumbai = findNearestLocation(19.1000, 72.8300);
assert(nearestMumbai.area === 'Andheri West', `Juhu coordinates resolve to 'Andheri West' (got: ${nearestMumbai.area})`);

// 4. Search Filter Algorithm Simulation
console.log('\n--- 4. Search Filter Logic ---');
function filterLocations(query) {
  if (!query.trim()) return LOCATIONS;
  const q = query.toLowerCase();
  return LOCATIONS.filter(
    loc => loc.area.toLowerCase().includes(q) || loc.city.toLowerCase().includes(q) || loc.tag.toLowerCase().includes(q)
  );
}

const filterNoida = filterLocations('noida');
assert(filterNoida.length === 1 && filterNoida[0].area === 'Sector 62, Noida', `Search 'noida' matches 1 location ('Sector 62, Noida')`);

const filterBangalore = filterLocations('bengaluru');
assert(filterBangalore.length === 2, `Search 'bengaluru' matches 2 hubs (Indiranagar & HSR Layout, got: ${filterBangalore.length})`);

const filterFast = filterLocations('15m');
assert(filterFast.length >= 2, `Search tag '15m' matches high-speed dispatch hubs (got: ${filterFast.length})`);

// 5. Booking Address Generation Simulation
console.log('\n--- 5. Booking Address Resolution ---');
function generateBookingAddress(selectedLocation) {
  const locObj = LOCATIONS.find(l => l.area === selectedLocation);
  const address = locObj 
    ? `Flat 402, Green Vista, ${locObj.area}`
    : `Flat 402, Green Vista, ${selectedLocation}`;
  const city = locObj ? locObj.city : (selectedLocation.includes(',') ? selectedLocation.split(',').pop()?.trim() || 'Custom Area' : 'Custom Area');
  return { address, city };
}

const addrPredefined = generateBookingAddress('Indiranagar 4th Block');
assert(addrPredefined.address === 'Flat 402, Green Vista, Indiranagar 4th Block' && addrPredefined.city === 'Bengaluru', `Predefined address generated correctly`);

const addrCustom = generateBookingAddress('Powai Plaza, Mumbai');
assert(addrCustom.address === 'Flat 402, Green Vista, Powai Plaza, Mumbai' && addrCustom.city === 'Mumbai', `Custom address with city parsed correctly`);

console.log(`\n🎉 ALL ${passedTests}/${totalTests} TESTS PASSED WITH 100% SUCCESS!`);
