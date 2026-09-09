import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { SERVICE_CATEGORIES } from '../../data/services';
import { PRONTO_SERVICES } from '../../data/prontoServicesData';
import { ProntoHeroHeader } from '../../components/customer/ProntoHeroHeader';
import { CategoryTabsBar } from '../../components/customer/CategoryTabsBar';
import { ProntoServiceCard, ServiceItemData } from '../../components/customer/ProntoServiceCard';
import { AddressSelectorModal } from '../../components/customer/AddressSelectorModal';
import { getCategoryTheme, CategoryTheme } from '../../styles/categoryThemes';
import { Search, X, Mic, ArrowRight, Zap } from 'lucide-react';

interface CustomerHomePageProps {
  onOpenOnboarding?: () => void;
}

export const CustomerHomePage: React.FC<CustomerHomePageProps> = ({ onOpenOnboarding }) => {
  const {
    startServiceBooking,
    setProblemDescription,
    bookings,
    selectedLocation,
    setSelectedLocation,
    setActiveView,
    setCurrentBookingId,
  } = useBooking();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);

  const activeTheme: CategoryTheme = getCategoryTheme(selectedCategoryId);

  // Active ongoing booking check
  const activeBooking = bookings.find(
    (b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED'
  );

  // Filter services by Category and Search Query
  const filteredServices = PRONTO_SERVICES.filter((service) => {
    // 1. Category filter
    const matchesCategory =
      selectedCategoryId === 'all' || service.categoryId === selectedCategoryId;

    // 2. Search query filter
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      service.name.toLowerCase().includes(q) ||
      service.description.toLowerCase().includes(q) ||
      service.categoryId.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const handleBookService = (service: ServiceItemData) => {
    // Map service to existing booking flow category
    let categoryKey = service.categoryId;
    if (categoryKey === 'ac') categoryKey = 'ac_repair';
    if (categoryKey === 'cleaning') categoryKey = 'cleaner';
    if (categoryKey === 'plumbing') categoryKey = 'plumber';
    if (categoryKey === 'painting') categoryKey = 'painter';

    const matchedCategory =
      SERVICE_CATEGORIES.find((c) => c.id === categoryKey) ||
      SERVICE_CATEGORIES[0];

    setProblemDescription(service.name);
    startServiceBooking(matchedCategory, false);
  };

  const handleInstantService = () => {
    const electricianCategory =
      SERVICE_CATEGORIES.find((c) => c.id === 'electrician') ||
      SERVICE_CATEGORIES[0];
    setProblemDescription('15-Minute Emergency Rapid Dispatch');
    startServiceBooking(electricianCategory, true);
  };

  const handleScheduleService = () => {
    const defaultCat =
      SERVICE_CATEGORIES.find((c) => c.id === 'cleaner') ||
      SERVICE_CATEGORIES[0];
    setProblemDescription('Scheduled Home Service Visit');
    startServiceBooking(defaultCat, false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        paddingBottom: '88px',
      }}
    >
      {/* 1. PRONTO-INSPIRED HERO HEADER (WITH DYNAMIC CATEGORY THEME) */}
      <ProntoHeroHeader
        currentLocation={selectedLocation}
        onOpenLocationSelector={() => setShowAddressModal(true)}
        onOpenProfile={() => setActiveView('profile')}
        theme={activeTheme}
        onInstantServiceClick={handleInstantService}
        onScheduleServiceClick={handleScheduleService}
      />

      {/* 2. ACTIVE BOOKING LIVE TRACKING BANNER (IF ACTIVE) */}
      {activeBooking && (
        <div style={{ padding: '14px 16px 0' }}>
          <div
            onClick={() => {
              setCurrentBookingId(activeBooking.id);
              setActiveView('tracking');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #BBF7D0',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(12, 131, 31, 0.1)',
              cursor: 'pointer',
            }}
            className="hover-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#F0FDF4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0C831F',
                  flexShrink: 0,
                }}
              >
                <Zap size={20} fill="#0C831F" />
              </div>

              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{activeBooking.serviceName}</span>
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 800,
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {activeBooking.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                  {activeBooking.worker ? `Technician: ${activeBooking.worker.name}` : 'Cooperative Artisan Assigned'} • OTP: <strong>{activeBooking.otp || '4829'}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, color: '#0C831F' }}>
              <span>Track</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      )}

      {/* 3. LARGE ROUNDED SEARCH BAR */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid #E2E8F0',
            padding: '12px 16px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
            gap: '10px',
            transition: 'border-color 150ms ease',
          }}
        >
          <Search size={20} color="#64748B" />

          <input
            type="text"
            placeholder={`Search for ${activeTheme.id === 'all' ? 'cleaning, electrician, AC...' : activeTheme.name.toLowerCase()}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#0F172A',
              backgroundColor: 'transparent',
            }}
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
              }}
            >
              <X size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => alert('Voice search activated. Speak your service need.')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeTheme.primary,
                display: 'flex',
                alignItems: 'center',
                padding: 0,
              }}
            >
              <Mic size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 4. BIGBASKET-STYLE HORIZONTAL CATEGORY TABS BAR */}
      <div style={{ margin: '6px 0 12px' }}>
        <CategoryTabsBar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(catId) => {
            setSelectedCategoryId(catId);
            setSearchQuery('');
          }}
          activeTheme={activeTheme}
        />
      </div>

      {/* 5. SERVICE CARDS LIST / GRID */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              {selectedCategoryId === 'all' ? 'Popular Services' : `${activeTheme.name} Services`}
            </h2>
            <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>
              Standard cooperative pricing with 30-day warranty
            </span>
          </div>

          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              backgroundColor: activeTheme.primaryLight,
              color: activeTheme.primaryDark,
              border: `1px solid ${activeTheme.primaryBorder}`,
              padding: '3px 8px',
              borderRadius: '9999px',
            }}
          >
            {filteredServices.length} options
          </span>
        </div>

        {/* Services List */}
        {filteredServices.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredServices.map((service) => (
              <ProntoServiceCard
                key={service.id}
                service={service}
                theme={activeTheme}
                onBook={() => handleBookService(service)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>
              No services found
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
              Try searching for "cleaning", "fan", "leakage" or switch category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId('all');
                setSearchQuery('');
              }}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: activeTheme.primary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 6. TRUST & QUALITY STATS SECTION */}
      <div style={{ padding: '24px 16px 0' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            padding: '20px 18px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: activeTheme.primary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              COOPERATIVE GUARANTEE
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 900, color: '#0F172A', margin: '2px 0 4px', letterSpacing: '-0.02em' }}>
              Relax, your home is in professional hands
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
              Backed by regional artisan cooperatives with verified police credentials and standard rates.
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '10px 6px', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0F172A' }}>
                50k+
              </div>
              <div style={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                Trusted Families
              </div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '10px 6px', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0C831F' }}>
                4.88 ★
              </div>
              <div style={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                Verified Rating
              </div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '10px 6px', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#2563EB' }}>
                30 Days
              </div>
              <div style={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                Service Warranty
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Selector Bottom Sheet Modal */}
      <AddressSelectorModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        selectedAddress={selectedLocation}
        onSelectAddress={(newLoc) => setSelectedLocation(newLoc)}
        onAddNewAddress={() => {
          setShowAddressModal(false);
          if (onOpenOnboarding) {
            onOpenOnboarding();
          }
        }}
      />
    </div>
  );
};
