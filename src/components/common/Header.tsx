import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { LanguageToggle } from './LanguageToggle';
import { MapPin, ChevronDown, ShieldCheck, User, CalendarCheck, Zap, Check, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { language } = useLanguage();
  const { setActiveView, bookings } = useBooking();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Sector 62, Noida (Delhi NCR)');

  const activeBookingsCount = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;

  const LOCATIONS = [
    { city: 'Delhi NCR', area: 'Sector 62, Noida', tag: '48 Verified Artisans • 15m Dispatch' },
    { city: 'Delhi NCR', area: 'DLF Phase 3, Gurgaon', tag: 'Fast 15m Hub' },
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
          boxShadow: 'var(--shadow-xs)',
          transition: 'background-color var(--transition-theme), border-color var(--transition-theme)',
        }}
        className="theme-transition"
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
          {/* Left: Brand Logo & Locality Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            {/* Logo */}
            <div
              onClick={() => setActiveView('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
                flexShrink: 0,
              }}
              title="SAHYOG Home"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--theme-accent, #0C831F)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 1px 3px rgba(12, 131, 31, 0.2)',
                  transition: 'background-color var(--transition-theme)',
                }}
              >
                <ShieldCheck size={18} strokeWidth={2.4} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 900,
                    color: 'var(--theme-text, #111827)',
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
                    fontWeight: 800,
                    color: 'var(--theme-accent, #0C831F)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginTop: '2px',
                  }}
                >
                  COOPERATIVE
                </span>
              </div>
            </div>

            {/* Subtle Vertical Divider */}
            <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-default)' }} className="hide-mobile" />

            {/* Location Selector (Compact, Practical) */}
            <div
              onClick={() => setShowLocationModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                backgroundColor: 'transparent',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                transition: 'background-color var(--transition-fast)',
                maxWidth: '240px',
              }}
              className="hover-card"
              title="Change locality"
            >
              <MapPin size={14} color="var(--theme-accent, #0C831F)" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--theme-text, #111827)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectedLocation}
                </div>
              </div>
              <ChevronDown size={12} color="var(--theme-text-muted, #6B7280)" style={{ flexShrink: 0 }} />
            </div>
          </div>

          {/* Right: Actions (Bookings, Profile, Language, 24x7 Help) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Quick Emergency 15m Dispatch CTA on desktop */}
            <button
              type="button"
              onClick={() => setActiveView('service-detail')}
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
                fontWeight: 800,
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
                padding: '6px 10px',
                backgroundColor: activeBookingsCount > 0 ? 'var(--theme-accent-light, #F0FDF4)' : 'transparent',
                border: `1px solid ${activeBookingsCount > 0 ? 'var(--theme-accent-border, #BBF7D0)' : 'transparent'}`,
                borderRadius: 'var(--radius-xs)',
                color: activeBookingsCount > 0 ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text-secondary, #374151)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                position: 'relative',
              }}
              className="sahyog-btn"
            >
              <CalendarCheck size={15} color="currentColor" />
              <span className="hide-mobile">{language === 'hi' ? 'बुकिंग्स' : 'Bookings'}</span>
              {activeBookingsCount > 0 && (
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--theme-accent, #0C831F)',
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
                padding: '6px 10px',
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--theme-text-secondary, #374151)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="sahyog-btn"
            >
              <User size={15} color="var(--theme-text, #111827)" />
              <span className="hide-mobile">{language === 'hi' ? 'खाता' : 'Account'}</span>
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
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
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
              maxWidth: '440px',
              width: '100%',
              padding: '18px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              border: '1px solid var(--border-default)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={17} color="var(--theme-accent, #0C831F)" />
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {language === 'hi' ? 'सेवा क्षेत्र चुनें' : 'Select Service Locality'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={17} />
              </button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              {language === 'hi'
                ? 'सहकारी तकनीशियन आपके निकटतम क्षेत्र से 15-20 मिनट में उपलब्ध होंगे।'
                : 'Choose your locality to view nearby verified cooperative artisans and dispatch arrival times.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
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
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-xs)',
                      border: `1.5px solid ${isSelected ? 'var(--theme-accent, #0C831F)' : 'var(--border-default)'}`,
                      backgroundColor: isSelected ? 'var(--theme-accent-light, #F0FDF4)' : '#FFFFFF',
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
                      <div style={{ fontSize: '0.6875rem', color: isSelected ? 'var(--theme-accent, #0C831F)' : 'var(--text-muted)' }}>
                        {loc.tag}
                      </div>
                    </div>
                    {isSelected && <Check size={16} color="var(--theme-accent, #0C831F)" strokeWidth={2.5} />}
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
