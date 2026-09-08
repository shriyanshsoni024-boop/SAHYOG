import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { LanguageToggle } from './LanguageToggle';
import { MapPin, ChevronDown, ShieldCheck, User, ShoppingBag, Zap, Check, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { language } = useLanguage();
  const { setActiveView, bookings } = useBooking();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Sector 62, Noida (Delhi NCR)');

  const activeBookingsCount = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;

  const LOCATIONS = [
    { city: 'Delhi NCR', area: 'Sector 62, Noida', tag: '48 Verified Artisans' },
    { city: 'Delhi NCR', area: 'DLF Phase 3, Gurgaon', tag: 'Fast 15m Dispatch' },
    { city: 'Delhi NCR', area: 'Saket, South Delhi', tag: 'Co-op Guild Hub' },
    { city: 'Bengaluru', area: 'Indiranagar 4th Block', tag: 'Cooperative Hub' },
    { city: 'Bengaluru', area: 'HSR Layout Sector 2', tag: 'High Density Zone' },
    { city: 'Mumbai', area: 'Andheri West', tag: 'Active Zone' },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Left: Brand Logo & Location Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Logo */}
            <div
              onClick={() => setActiveView('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 900,
                    color: 'var(--primary)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    display: 'block',
                  }}
                >
                  SAHYOG
                </span>
                <span
                  style={{
                    fontSize: '0.5625rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  COOPERATIVE
                </span>
              </div>
            </div>

            {/* Location Selector */}
            <div
              onClick={() => setShowLocationModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)',
              }}
              className="hover-card"
            >
              <MapPin size={14} color="var(--primary)" />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  maxWidth: '160px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedLocation}
              </span>
              <ChevronDown size={12} color="var(--text-muted)" />
            </div>
          </div>

          {/* Right: Actions (Bookings, Profile, Language) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Quick Emergency 15m Dispatch link on desktop */}
            <button
              type="button"
              onClick={() => {
                setActiveView('service-detail');
              }}
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                border: '1px solid var(--danger-border)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="desktop-emergency-btn sahyog-btn"
            >
              <Zap size={13} fill="var(--danger)" />
              <span>{language === 'hi' ? '15m आपातकाल' : '15m Emergency'}</span>
            </button>

            {/* My Bookings Action */}
            <button
              type="button"
              onClick={() => setActiveView('history')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                position: 'relative',
              }}
              className="sahyog-btn"
            >
              <ShoppingBag size={14} color="var(--text-primary)" />
              <span className="hide-mobile">{language === 'hi' ? 'बुकिंग्स' : 'Bookings'}</span>
              {activeBookingsCount > 0 && (
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeBookingsCount}
                </span>
              )}
            </button>

            {/* Profile Action */}
            <button
              type="button"
              onClick={() => setActiveView('profile')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="sahyog-btn"
            >
              <User size={14} color="var(--text-primary)" />
              <span className="hide-mobile">{language === 'hi' ? 'प्रोफ़ाइल' : 'Account'}</span>
            </button>

            {/* Language Toggle */}
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowLocationModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              maxWidth: '420px',
              width: '100%',
              padding: '18px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--primary)" />
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {language === 'hi' ? 'सेवा क्षेत्र चुनें' : 'Select Service Location'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              {language === 'hi'
                ? 'सहकारी तकनीशियन आपके निकटतम क्षेत्र से 15-20 मिनट में उपलब्ध होंगे।'
                : 'Choose your locality to view nearby verified cooperative artisans and dispatch times.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
              {LOCATIONS.map((loc, idx) => {
                const label = `${loc.area} (${loc.city})`;
                const isSelected = selectedLocation === label;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedLocation(label);
                      setShowLocationModal(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-default)'}`,
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {loc.area}, {loc.city}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {loc.tag}
                      </div>
                    </div>
                    {isSelected && <Check size={14} color="var(--primary)" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
