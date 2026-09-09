import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { LanguageToggle } from './LanguageToggle';
import { MapPin, ChevronDown, ShieldCheck, User, CalendarCheck, Zap, Check, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { language } = useLanguage();
  const { setActiveView, bookings } = useBooking();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Sector 62, Noida');

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
          borderBottom: '1px solid #E5E7EB',
          transition: 'background-color var(--transition-theme), border-color var(--transition-theme)',
        }}
        className="theme-transition"
      >
        {/* ========================================================= */}
        {/* DESKTOP HEADER (Single Row, >= 768px)                      */}
        {/* ========================================================= */}
        <div
          className="hide-mobile show-desktop-flex"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '8px 16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            height: '52px',
            width: '100%',
          }}
        >
          {/* Left: Brand Logo & Locality Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            {/* Logo */}
            <div
              onClick={() => setActiveView('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                cursor: 'pointer',
                userSelect: 'none',
                flexShrink: 0,
              }}
              title="SAHYOG Home"
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--theme-accent, #0C831F)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'background-color var(--transition-theme)',
                }}
              >
                <ShieldCheck size={17} strokeWidth={2.5} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '1.0625rem',
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
                    fontSize: '0.53125rem',
                    fontWeight: 800,
                    color: 'var(--theme-accent, #0C831F)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    display: 'block',
                    marginTop: '1px',
                  }}
                >
                  COOPERATIVE
                </span>
              </div>
            </div>

            {/* Subtle Vertical Divider */}
            <div style={{ width: '1px', height: '18px', backgroundColor: '#E5E7EB' }} />

            {/* Location Selector */}
            <div
              onClick={() => setShowLocationModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 6px',
                borderRadius: '4px',
                cursor: 'pointer',
                maxWidth: '240px',
                minWidth: 0,
              }}
              title="Change locality"
            >
              <MapPin size={13} color="var(--theme-accent, #0C831F)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--theme-text, #111827)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedLocation}
              </span>
              <ChevronDown size={11} color="#6B7280" style={{ flexShrink: 0 }} />
            </div>
          </div>

          {/* Right: Actions (Desktop Bookings/Account + Language Toggle) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Quick Emergency 15m Dispatch CTA */}
            <button
              type="button"
              onClick={() => setActiveView('service-detail')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 9px',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                borderRadius: '4px',
                fontSize: '0.71875rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="sahyog-btn"
            >
              <Zap size={12} fill="#DC2626" />
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
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: activeBookingsCount > 0 ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text-secondary, #374151)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              className="sahyog-btn"
            >
              <CalendarCheck size={14} color="currentColor" />
              <span>{language === 'hi' ? 'बुकिंग्स' : 'Bookings'}</span>
              {activeBookingsCount > 0 && (
                <span
                  style={{
                    padding: '1px 5px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--theme-accent-light, #F0FDF4)',
                    color: 'var(--theme-accent, #0C831F)',
                    border: '1px solid var(--theme-accent-border, #BBF7D0)',
                    fontSize: '0.625rem',
                    fontWeight: 800,
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
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: 'var(--theme-text-secondary, #374151)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              className="sahyog-btn"
            >
              <User size={14} color="var(--theme-text-secondary, #374151)" />
              <span>{language === 'hi' ? 'खाता' : 'Account'}</span>
            </button>

            {/* Language Toggle */}
            <LanguageToggle />
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE HEADER (Structured 2-Row Layout, < 768px)          */}
        {/* ========================================================= */}
        <div
          className="hide-desktop show-mobile-flex"
          style={{
            flexDirection: 'column',
            gap: '6px',
            padding: '8px 14px',
            width: '100%',
          }}
        >
          {/* Row 1: Brand Identity on Left, Language Switcher on Right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* Logo */}
            <div
              onClick={() => setActiveView('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '5px',
                  backgroundColor: 'var(--theme-accent, #0C831F)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <ShieldCheck size={15} strokeWidth={2.5} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: '#111827',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    display: 'block',
                  }}
                >
                  SAHYOG
                </span>
                <span
                  style={{
                    fontSize: '0.5rem',
                    fontWeight: 800,
                    color: 'var(--theme-accent, #0C831F)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginTop: '1px',
                  }}
                >
                  COOPERATIVE
                </span>
              </div>
            </div>

            {/* Language Toggle */}
            <LanguageToggle />
          </div>

          {/* Row 2: Location Selector on Left, Booking Status/Badge on Right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: '8px',
              paddingTop: '2px',
            }}
          >
            {/* Location Selector (Safe Truncation) */}
            <div
              onClick={() => setShowLocationModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                minWidth: 0,
                flex: 1,
              }}
              title="Change locality"
            >
              <MapPin size={13} color="var(--theme-accent, #0C831F)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#111827',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {selectedLocation}
              </span>
              <ChevronDown size={11} color="#6B7280" style={{ flexShrink: 0 }} />
            </div>

            {/* Right: Active Bookings Pill OR Zone Trust Badge */}
            {activeBookingsCount > 0 ? (
              <button
                type="button"
                onClick={() => setActiveView('history')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 7px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '9999px',
                  color: '#0C831F',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  height: '22px',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: '#0C831F',
                    display: 'inline-block',
                  }}
                />
                <span>
                  {activeBookingsCount} {language === 'hi' ? 'सक्रिय बुकिंग' : 'Active'}
                </span>
                <CalendarCheck size={11} />
              </button>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '2px 7px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '9999px',
                  color: '#64748B',
                  fontSize: '0.59375rem',
                  fontWeight: 600,
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  height: '20px',
                }}
              >
                <ShieldCheck size={10} color="#0C831F" />
                <span>{language === 'hi' ? '48 कारीगर लाइव' : '48 Pros Live'}</span>
              </div>
            )}
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
              borderRadius: '8px',
              maxWidth: '420px',
              width: '100%',
              padding: '16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              border: '1px solid #E5E7EB',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--theme-accent, #0C831F)" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  {language === 'hi' ? 'सेवा क्षेत्र चुनें' : 'Select Service Locality'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '2px' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.71875rem', color: '#6B7280', margin: 0, lineHeight: 1.35 }}>
              {language === 'hi'
                ? 'सहकारी तकनीशियन आपके निकटतम क्षेत्र से 15-20 मिनट में उपलब्ध होंगे।'
                : 'Choose your locality to view nearby verified cooperative artisans and dispatch arrival times.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '280px', overflowY: 'auto', marginTop: '4px' }}>
              {LOCATIONS.map((loc, idx) => {
                const isSelected = selectedLocation === loc.area;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedLocation(loc.area);
                      setShowLocationModal(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: `1px solid ${isSelected ? 'var(--theme-accent, #0C831F)' : '#E5E7EB'}`,
                      backgroundColor: isSelected ? 'var(--theme-accent-light, #F0FDF4)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background-color 120ms ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: '#111827' }}>
                        {loc.area}, {loc.city}
                      </div>
                      <div style={{ fontSize: '0.65625rem', color: isSelected ? 'var(--theme-accent, #0C831F)' : '#6B7280' }}>
                        {loc.tag}
                      </div>
                    </div>
                    {isSelected && <Check size={15} color="var(--theme-accent, #0C831F)" strokeWidth={2.5} />}
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
