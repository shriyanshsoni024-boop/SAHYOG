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
import {
  Search,
  X,
  ChevronRight,
  ShieldCheck,
  Award,
  IndianRupee,
  Clock
} from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1200px', margin: '0 auto', padding: '14px 16px 36px' }}>
      {/* 1. Hero & Service Discovery Proposition */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 18px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-light)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Cooperative Network
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              • Delhi NCR, Bengaluru & Mumbai
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.375rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              margin: '0 0 3px',
            }}
          >
            {language === 'hi' ? 'विश्वसनीय घरेलू सेवाएं आपके द्वार पर' : 'Home services at your doorstep'}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            {language === 'hi'
              ? 'प्रमाणित इलेक्ट्रीशियन, प्लंबर, कारपेंटर और एसी तकनीशियन — निश्चित मानक दरों पर।'
              : 'Certified technicians and skilled trade artisans backed by India’s Worker Cooperative Federation.'}
          </p>
        </div>

        {/* Search Bar Input with Clear Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-xs)',
              padding: '10px 14px',
              border: '1.5px solid var(--border-default)',
              gap: '10px',
              transition: 'border-color var(--transition-fast)',
            }}
          >
            <Search size={18} color="var(--primary)" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'इलेक्ट्रीशियन, एसी सर्विस, प्लंबर, कारपेंटर खोजें...' : 'Search for Electrician, AC repair, Plumber, Carpenter...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
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
            {QUICK_SEARCH_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSearchQuery(searchQuery === chip.query ? '' : chip.query)}
                className={`chip ${searchQuery === chip.query ? 'active' : ''}`}
                style={{ flexShrink: 0, padding: '4px 10px', fontSize: '0.6875rem' }}
              >
                {chip.label}
              </button>
            ))}
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
            backgroundColor: 'var(--primary-light)',
            border: '1.5px solid var(--primary-border)',
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
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
              }}
            />
            <div>
              <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Service • {activeBooking.token}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '1px' }}>
                {activeBooking.serviceName}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                Status: <strong>{activeBooking.status.replace(/_/g, ' ')}</strong>
                {activeBooking.worker ? ` • Artisan: ${activeBooking.worker.name}` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
            <span>Track Live</span>
            <ChevronRight size={16} />
          </div>
        </section>
      )}

      {/* 2. Main Service Categories Grid */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? 'सेवा श्रेणियां' : 'All Home Services'}
            </h2>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {language === 'hi' ? 'मानक दर कार्ड के साथ कुशल सहकारी कारीगर' : 'Fixed rate cards & cooperative verified trade artisans'}
            </span>
          </div>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {filteredCategories.length} Categories
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 10px',
            boxShadow: 'var(--shadow-xs)',
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

      {/* 3. High-Priority Emergency Banner */}
      <EmergencyBanner />

      {/* 4. Trust & Value Strip (Consumer Assurance) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div style={{ color: 'var(--success-dark)', backgroundColor: 'var(--success-light)', padding: '5px', borderRadius: 'var(--radius-xs)' }}>
            <ShieldCheck size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              100% KYC Verified
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              Police & Aadhaar checked
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '5px', borderRadius: 'var(--radius-xs)' }}>
            <Award size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Govt ITI / Skill Certified
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              Trade standards tested
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div style={{ color: 'var(--accent-warm-dark)', backgroundColor: 'var(--accent-warm-light)', padding: '5px', borderRadius: 'var(--radius-xs)' }}>
            <IndianRupee size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Standard Fixed Rates
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              No surge pricing
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div style={{ color: '#059669', backgroundColor: '#ECFDF5', padding: '5px', borderRadius: 'var(--radius-xs)' }}>
            <Clock size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              30-Day Free Cover
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              Free rework protection
            </div>
          </div>
        </div>
      </section>

      {/* 5. In the Spotlight Promotional Section */}
      <SpotlightBanner onSelectPromotion={handleSpotlightSelect} />

      {/* 6. Most Booked Services (Horizontal Carousel) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
                {language === 'hi' ? 'सर्वाधिक बुक की गई सेवाएं' : 'Most Booked Services'}
              </h2>
              <span style={{ fontSize: '0.5625rem', fontWeight: 800, backgroundColor: '#FEF3C7', color: '#92400E', padding: '1px 5px', borderRadius: 'var(--radius-xs)', textTransform: 'uppercase' }}>
                Top Rated
              </span>
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {language === 'hi' ? 'इस सप्ताह ग्राहकों द्वारा सबसे अधिक चुनी गई सेवाएं' : 'Trending repairs & maintenance packages in your locality'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCategorySelect(SERVICE_CATEGORIES[0])}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'See all'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Horizontal Card Track */}
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

      {/* 7. Profession Specific Section: AC & Appliance Repair */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? CATEGORY_SECTIONS.ac_appliance.titleHi : CATEGORY_SECTIONS.ac_appliance.title}
            </h2>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {language === 'hi' ? CATEGORY_SECTIONS.ac_appliance.subtitleHi : CATEGORY_SECTIONS.ac_appliance.subtitle}
            </span>
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
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
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
          {CATEGORY_SECTIONS.ac_appliance.services.map((item) => (
            <MarketplaceServiceCard
              key={item.id}
              service={item}
              onSelect={handleServiceSelect}
              layout="horizontal"
            />
          ))}
        </div>
      </section>

      {/* 8. Profession Specific Section: Electrical Services */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? CATEGORY_SECTIONS.electrical.titleHi : CATEGORY_SECTIONS.electrical.title}
            </h2>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {language === 'hi' ? CATEGORY_SECTIONS.electrical.subtitleHi : CATEGORY_SECTIONS.electrical.subtitle}
            </span>
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
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
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

      {/* 9. Profession Specific Section: Plumbing Services */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? CATEGORY_SECTIONS.plumbing.titleHi : CATEGORY_SECTIONS.plumbing.title}
            </h2>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {language === 'hi' ? CATEGORY_SECTIONS.plumbing.subtitleHi : CATEGORY_SECTIONS.plumbing.subtitle}
            </span>
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
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
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
          {CATEGORY_SECTIONS.plumbing.services.map((item) => (
            <MarketplaceServiceCard
              key={item.id}
              service={item}
              onSelect={handleServiceSelect}
              layout="horizontal"
            />
          ))}
        </div>
      </section>

      {/* 10. Profession Specific Section: Home Repair & Carpentry */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? CATEGORY_SECTIONS.carpentry.titleHi : CATEGORY_SECTIONS.carpentry.title}
            </h2>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {language === 'hi' ? CATEGORY_SECTIONS.carpentry.subtitleHi : CATEGORY_SECTIONS.carpentry.subtitle}
            </span>
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
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
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

      {/* 11. Profession Specific Section: Deep Cleaning & Sanitization */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
              {language === 'hi' ? CATEGORY_SECTIONS.cleaning.titleHi : CATEGORY_SECTIONS.cleaning.title}
            </h2>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {language === 'hi' ? CATEGORY_SECTIONS.cleaning.subtitleHi : CATEGORY_SECTIONS.cleaning.subtitle}
            </span>
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
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
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

      {/* 12. New & Noteworthy Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
                {language === 'hi' ? 'नई एवं आधुनिक सेवाएं' : 'New & Noteworthy'}
              </h2>
              <span style={{ fontSize: '0.5625rem', fontWeight: 800, backgroundColor: '#E0F2FE', color: '#0284C7', padding: '1px 5px', borderRadius: 'var(--radius-xs)', textTransform: 'uppercase' }}>
                Smart Tech
              </span>
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {language === 'hi' ? 'स्मार्ट लॉक, ईवी चार्जर, हर्बल पेस्ट केयर और मॉड्यूलर फिटिंग्स' : 'Smart locks, EV charger setups, herbal drain shields & modular upgrades'}
            </span>
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

      {/* 13. Cooperative Trust & Worker Welfare Section */}
      <CooperativeTrustSection />
    </div>
  );
};
