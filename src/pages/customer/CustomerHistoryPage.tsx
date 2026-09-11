import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  Calendar,
  MapPin,
  User,
  Plus,
  Zap,
  ChevronRight,
} from 'lucide-react';

export const CustomerHistoryPage: React.FC = () => {
  const { bookings, setCurrentBookingId, setActiveView } = useBooking();
  const [selectedTab, setSelectedTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('all');

  const upcomingBookings = bookings.filter((b) => b.status === 'REQUESTED' || b.status === 'MATCHED');
  const ongoingBookings = bookings.filter(
    (b) => b.status === 'ACCEPTED' || b.status === 'ON_THE_WAY' || b.status === 'IN_PROGRESS'
  );
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');

  let displayedBookings = bookings;
  if (selectedTab === 'upcoming') displayedBookings = upcomingBookings;
  if (selectedTab === 'ongoing') displayedBookings = ongoingBookings;
  if (selectedTab === 'completed') displayedBookings = completedBookings;
  if (selectedTab === 'cancelled') displayedBookings = cancelledBookings;

  const handleOpenDetails = (bookingId: string) => {
    setCurrentBookingId(bookingId);
    setActiveView('tracking');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'Work In Progress' };
      case 'ON_THE_WAY':
        return { bg: 'var(--primary-light, #F0FDF4)', text: 'var(--sahyog-green-dark, #0F7A3E)', border: 'var(--primary-border, #D9E9C8)', label: 'Artisan On The Way' };
      case 'ACCEPTED':
        return { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', label: 'Job Accepted' };
      case 'COMPLETED':
        return { bg: '#DCFCE7', text: '#166534', border: '#86EFAC', label: 'Completed' };
      case 'CANCELLED':
        return { bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA', label: 'Cancelled' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', label: 'Requested' };
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--sahyog-cream, #FCFBF4)',
        padding: '16px 16px 88px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--sahyog-ink, #0B0B0B)', margin: '0 0 2px', letterSpacing: '-0.02em' }}>
            My Bookings
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
            Live status, OTP codes, and past service warranties
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveView('home')}
          style={{
            padding: '7px 12px',
            backgroundColor: 'var(--sahyog-green, #1DAA5C)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          className="sahyog-btn"
        >
          <Plus size={14} />
          <span>Book New</span>
        </button>
      </div>

      {/* Segmented Filter Tabs (Horizontal Scrollable) */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '14px',
          scrollbarWidth: 'none',
        }}
        className="hide-scrollbar"
      >
        {[
          { id: 'all', label: `All (${bookings.length})` },
          { id: 'ongoing', label: `Ongoing (${ongoingBookings.length})` },
          { id: 'upcoming', label: `Upcoming (${upcomingBookings.length})` },
          { id: 'completed', label: `Completed (${completedBookings.length})` },
          { id: 'cancelled', label: `Cancelled (${cancelledBookings.length})` },
        ].map((tab) => {
          const isSelected = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id as any)}
              style={{
                flex: '0 0 auto',
                padding: '7px 12px',
                borderRadius: '9999px',
                border: `1.5px solid ${isSelected ? 'var(--sahyog-green, #1DAA5C)' : '#E2E8F0'}`,
                backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                color: isSelected ? 'var(--sahyog-green, #1DAA5C)' : '#475569',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 120ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {displayedBookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayedBookings.map((b) => {
            const badge = getStatusBadge(b.status);
            const isLive = b.status !== 'COMPLETED' && b.status !== 'CANCELLED';

            return (
              <div
                key={b.id}
                onClick={() => handleOpenDetails(b.id)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: `1.5px solid ${isLive ? 'var(--sahyog-sage, #D9E9C8)' : '#E2E8F0'}`,
                  padding: '16px',
                  boxShadow: isLive ? '0 4px 14px rgba(29, 170, 92, 0.08)' : '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                className="hover-card"
              >
                {/* Card Top: Service & Status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#F0FDF4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--sahyog-green, #1DAA5C)',
                        flexShrink: 0,
                      }}
                    >
                      <Zap size={22} fill="var(--sahyog-green, #1DAA5C)" />
                    </div>

                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)', margin: 0 }}>
                        {b.serviceName}
                      </h3>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '1px' }}>
                        Token: <strong>{b.token}</strong> • {b.scheduledDate} ({b.scheduledTime})
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Professional & OTP row */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={15} color="#64748B" />
                    <span style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 600 }}>
                      {b.worker ? b.worker.name : 'Cooperative Artisan Assigned'}
                    </span>
                  </div>

                  {b.otp && isLive && (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--sahyog-sage, #D9E9C8)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        color: 'var(--sahyog-green, #1DAA5C)',
                      }}
                    >
                      OTP: {b.otp}
                    </div>
                  )}
                </div>

                {/* Address & Price Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: '#64748B', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <MapPin size={13} color="#94A3B8" style={{ flexShrink: 0 }} />
                    <span>{b.address || 'Indiranagar, Bangalore'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--sahyog-ink, #0B0B0B)' }}>
                      ₹{b.totalPrice}
                    </span>
                    <ChevronRight size={16} color="#94A3B8" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#F0FDF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sahyog-green, #1DAA5C)',
            }}
          >
            <Calendar size={28} />
          </div>

          <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--sahyog-ink, #0B0B0B)', margin: 0 }}>
            No bookings in this tab
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0, maxWidth: '260px' }}>
            Book a certified cooperative electrician, plumber, or cleaning pro in minutes.
          </p>

          <button
            type="button"
            onClick={() => setActiveView('home')}
            style={{
              marginTop: '8px',
              padding: '10px 20px',
              backgroundColor: 'var(--sahyog-green, #1DAA5C)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.8125rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
            className="sahyog-btn"
          >
            Explore Services
          </button>
        </div>
      )}
    </div>
  );
};
