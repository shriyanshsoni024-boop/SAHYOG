import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { SERVICE_CATEGORIES } from '../../data/services';
import {
  MOST_BOOKED_SERVICES,
  NEW_NOTEWORTHY_SERVICES,
  CATEGORY_SECTIONS,
  MarketplaceService,
  SpotlightItem
} from '../../data/marketplaceData';
import { ServiceCategory } from '../../types';
import { ServiceCard } from '../../components/customer/ServiceCard';
import { MarketplaceServiceCard } from '../../components/customer/MarketplaceServiceCard';
import { SpotlightBanner } from '../../components/customer/SpotlightBanner';
import { CooperativeTrustSection } from '../../components/customer/CooperativeTrustSection';
import { EmergencyBanner } from '../../components/customer/EmergencyBanner';
import { Search, X, ChevronRight } from 'lucide-react';

export const CustomerHomePage: React.FC = () => {
  const { language } = useLanguage();
  const { startServiceBooking, setProblemDescription, bookings, setActiveView, setCurrentBookingId } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');

  const activeBooking = bookings.find(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');

  const QUICK_SEARCH_CHIPS = [
    { label: language === 'hi' ? '15m आपातकाल' : '15m Emergency', query: 'emergency' },
    { label: language === 'hi' ? 'एसी सर्विस' : 'AC Service', query: 'ac' },
    { label: language === 'hi' ? 'स्विच रिपेयर' : 'Switchboard', query: 'electrician' },
    { label: language === 'hi' ? 'नल लीकेज' : 'Tap Leak', query: 'plumber' },
    { label: language === 'hi' ? 'डोर लॉक' : 'Door Lock', query: 'carpenter' },
    { label: language === 'hi' ? 'डीप क्लीनिंग' : 'Deep Cleaning', query: 'cleaner' },
  ];

  const handleCategorySelect = (category: ServiceCategory) => {
    startServiceBooking(category, false);
  };

  const handleServiceSelect = (service: MarketplaceService) => {
    const matchedCategory = SERVICE_CATEGORIES.find(c => c.id === service.categoryId) || SERVICE_CATEGORIES[0];
    startServiceBooking(matchedCategory, service.isEmergency || false);
    setProblemDescription(language === 'hi' ? service.titleHi : service.title);
  };

  const handleSpotlightSelect = (promo: SpotlightItem) => {
    const matchedCategory = SERVICE_CATEGORIES.find(c => c.id === promo.categoryId) || SERVICE_CATEGORIES[0];
    const isEmerg = promo.id === 'spotlight-emergency';
    startServiceBooking(matchedCategory, isEmerg);
    setProblemDescription(language === 'hi' ? promo.titleHi : promo.title);
  };

  const filteredCategories = SERVICE_CATEGORIES.filter(cat => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    if (q === 'emergency') return cat.id === 'electrician' || cat.id === 'plumber';
    const name = language === 'hi' ? cat.nameHi : cat.name;
    return (
      name.toLowerCase().includes(q) ||
      cat.category.toLowerCase().includes(q) ||
      cat.skills.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 16px 48px',
      }}
    >
      {/* 1. Direct, Unboxed Search & Discovery Header */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--theme-text, #111827)',
              letterSpacing: '-0.025em',
              lineHeight: 1.25,
              margin: '0 0 4px',
            }}
          >
            {language === 'hi' ? 'घरेलू सेवाएं, उचित एवं मानक दरों पर' : 'Home services at standard cooperative rates'}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--theme-text-muted, #6B7280)', margin: 0 }}>
            {language === 'hi'
              ? 'प्रमाणित इलेक्ट्रीशियन, प्लंबर, कारपेंटर और एसी तकनीशियन • 0% सर्ज शुल्क • 30-दिन वारंटी'
              : 'Verified electricians, plumbers, carpenters & AC technicians across your city • Zero surge pricing'}
          </p>
        </div>

        {/* Wide Search Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '11px 16px',
              border: '1.5px solid var(--border-default)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              gap: '12px',
              transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            }}
          >
            <Search size={18} color="var(--theme-accent, #0C831F)" />
            <input
              type="text"
              placeholder={
                language === 'hi'
                  ? 'इलेक्ट्रीशियन, एसी सर्विस, प्लंबर, डोर लॉक खोजें...'
                  : 'Search for AC repair, electrician, tap leakage, deep cleaning...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: 'var(--theme-text, #111827)',
                backgroundColor: 'transparent',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--theme-text-muted, #6B7280)' }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Search Chips */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '2px',
              scrollbarWidth: 'none',
            }}
          >
            {QUICK_SEARCH_CHIPS.map((chip, idx) => {
              const isActive = searchQuery === chip.query;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSearchQuery(isActive ? '' : chip.query)}
                  style={{
                    flexShrink: 0,
                    padding: '5px 12px',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${isActive ? 'var(--theme-accent, #0C831F)' : 'var(--border-default)'}`,
                    backgroundColor: isActive ? 'var(--theme-accent-light, #F0FDF4)' : '#FFFFFF',
                    color: isActive ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text-secondary, #374151)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Service Tracker Banner (if any active order) */}
      {activeBooking && (
        <section
          onClick={() => {
            setCurrentBookingId(activeBooking.id);
            setActiveView('tracking');
          }}
          style={{
            backgroundColor: 'var(--theme-accent-light, #F0FDF4)',
            border: '1px solid var(--theme-accent-border, #BBF7D0)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
          }}
          className="hover-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--theme-accent, #0C831F)',
                display: 'inline-block',
              }}
            />
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--theme-accent, #0C831F)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Active Service • {activeBooking.token}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--theme-text, #111827)', marginTop: '1px' }}>
                {activeBooking.serviceName} ({activeBooking.status.replace(/_/g, ' ')})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--theme-accent, #0C831F)' }}>
            <span>Track Live</span>
            <ChevronRight size={15} />
          </div>
        </section>
      )}

      {/* 2. Service Categories (Clean Unboxed Grid) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? 'सेवा श्रेणियां' : 'All Home Services'}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted, #6B7280)', margin: '2px 0 0' }}>
              {language === 'hi' ? 'मानक दर कार्ड के साथ कुशल सहकारी कारीगर' : 'Fixed rate cards & verified trade specialists'}
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--theme-text-muted, #6B7280)' }}>
            {filteredCategories.length} categories
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
            gap: '8px',
          }}
        >
          {filteredCategories.map((cat) => (
            <ServiceCard
              key={cat.id}
              category={cat}
              onClick={handleCategorySelect}
            />
          ))}
        </div>
      </section>

      {/* 3. Emergency Dispatch Banner */}
      <EmergencyBanner />

      {/* 4. Most Booked Services (Horizontal Shelf) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? 'सर्वाधिक बुक की गई सेवाएं' : 'Most Booked Services'}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted, #6B7280)', margin: '2px 0 0' }}>
              {language === 'hi' ? 'इस सप्ताह ग्राहकों द्वारा सबसे अधिक चुनी गई सेवाएं' : 'Trending repairs & maintenance packages in your area'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleCategorySelect(SERVICE_CATEGORIES[0])}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--theme-accent, #0C831F)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: 0,
            }}
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'See all'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'thin',
          }}
        >
          {MOST_BOOKED_SERVICES.map((item) => (
            <MarketplaceServiceCard
              key={item.id}
              service={item}
              onSelect={handleServiceSelect}
              layout="horizontal"
            />
          ))}
        </div>
      </section>

      {/* 5. AC & Cooling Services (Responsive Grid) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? CATEGORY_SECTIONS.ac_appliance.titleHi : CATEGORY_SECTIONS.ac_appliance.title}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted, #6B7280)', margin: '2px 0 0' }}>
              {language === 'hi' ? CATEGORY_SECTIONS.ac_appliance.subtitleHi : CATEGORY_SECTIONS.ac_appliance.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const cat = SERVICE_CATEGORIES.find(c => c.id === 'ac_repair') || SERVICE_CATEGORIES[1];
              handleCategorySelect(cat);
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--theme-accent, #0C831F)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: 0,
            }}
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'See all'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(216px, 1fr))',
            gap: '12px',
          }}
        >
          {CATEGORY_SECTIONS.ac_appliance.services.map((item) => (
            <MarketplaceServiceCard
              key={item.id}
              service={item}
              onSelect={handleServiceSelect}
              layout="grid"
            />
          ))}
        </div>
      </section>

      {/* 6. Electrical Services (Horizontal Track) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? CATEGORY_SECTIONS.electrical.titleHi : CATEGORY_SECTIONS.electrical.title}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted, #6B7280)', margin: '2px 0 0' }}>
              {language === 'hi' ? CATEGORY_SECTIONS.electrical.subtitleHi : CATEGORY_SECTIONS.electrical.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const cat = SERVICE_CATEGORIES.find(c => c.id === 'electrician') || SERVICE_CATEGORIES[0];
              handleCategorySelect(cat);
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--theme-accent, #0C831F)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: 0,
            }}
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'See all'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'thin',
          }}
        >
          {CATEGORY_SECTIONS.electrical.services.map((item) => (
            <MarketplaceServiceCard
              key={item.id}
              service={item}
              onSelect={handleServiceSelect}
              layout="horizontal"
            />
          ))}
        </div>
      </section>

      {/* 7. Featured Deals & Offers (Promotional Banner) */}
      <SpotlightBanner onSelectPromotion={handleSpotlightSelect} />

      {/* 8. Plumbing & Drainage Services (Responsive Grid) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? CATEGORY_SECTIONS.plumbing.titleHi : CATEGORY_SECTIONS.plumbing.title}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted, #6B7280)', margin: '2px 0 0' }}>
              {language === 'hi' ? CATEGORY_SECTIONS.plumbing.subtitleHi : CATEGORY_SECTIONS.plumbing.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const cat = SERVICE_CATEGORIES.find(c => c.id === 'plumber') || SERVICE_CATEGORIES[2];
              handleCategorySelect(cat);
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--theme-accent, #0C831F)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: 0,
            }}
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'See all'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(216px, 1fr))',
            gap: '12px',
          }}
        >
          {CATEGORY_SECTIONS.plumbing.services.map((item) => (
            <MarketplaceServiceCard
              key={item.id}
              service={item}
              onSelect={handleServiceSelect}
              layout="grid"
            />
          ))}
        </div>
      </section>

      {/* 9. Carpentry & Home Repair (Horizontal Track) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? CATEGORY_SECTIONS.carpentry.titleHi : CATEGORY_SECTIONS.carpentry.title}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted, #6B7280)', margin: '2px 0 0' }}>
              {language === 'hi' ? CATEGORY_SECTIONS.carpentry.subtitleHi : CATEGORY_SECTIONS.carpentry.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const cat = SERVICE_CATEGORIES.find(c => c.id === 'carpenter') || SERVICE_CATEGORIES[3];
              handleCategorySelect(cat);
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--theme-accent, #0C831F)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: 0,
            }}
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'See all'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'thin',
          }}
        >
          {CATEGORY_SECTIONS.carpentry.services.map((item) => (
            <MarketplaceServiceCard
              key={item.id}
              service={item}
              onSelect={handleServiceSelect}
              layout="horizontal"
            />
          ))}
        </div>
      </section>

      {/* 10. Deep Cleaning & Sanitization (Horizontal Track) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? CATEGORY_SECTIONS.cleaning.titleHi : CATEGORY_SECTIONS.cleaning.title}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted, #6B7280)', margin: '2px 0 0' }}>
              {language === 'hi' ? CATEGORY_SECTIONS.cleaning.subtitleHi : CATEGORY_SECTIONS.cleaning.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const cat = SERVICE_CATEGORIES.find(c => c.id === 'cleaner') || SERVICE_CATEGORIES[6];
              handleCategorySelect(cat);
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--theme-accent, #0C831F)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: 0,
            }}
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'See all'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'thin',
          }}
        >
          {CATEGORY_SECTIONS.cleaning.services.map((item) => (
            <MarketplaceServiceCard
              key={item.id}
              service={item}
              onSelect={handleServiceSelect}
              layout="horizontal"
            />
          ))}
        </div>
      </section>

      {/* 11. New & Noteworthy Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? 'नई एवं आधुनिक सेवाएं' : 'New & Noteworthy'}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted, #6B7280)', margin: '2px 0 0' }}>
              {language === 'hi' ? 'स्मार्ट लॉक, ईवी चार्जर, हर्बल पेस्ट केयर और मॉड्यूलर फिटिंग्स' : 'Smart locks, EV charger setups, herbal drain shields & modular upgrades'}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'thin',
          }}
        >
          {NEW_NOTEWORTHY_SERVICES.map((item) => (
            <MarketplaceServiceCard
              key={item.id}
              service={item}
              onSelect={handleServiceSelect}
              layout="horizontal"
            />
          ))}
        </div>
      </section>

      {/* 12. Cooperative Trust Guarantee Section */}
      <CooperativeTrustSection />
    </div>
  );
};
