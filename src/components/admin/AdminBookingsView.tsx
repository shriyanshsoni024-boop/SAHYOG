import React, { useState, useEffect } from 'react';
import { Booking } from '../../types';
import { bookingService } from '../../services/bookingService';
import { BookingDetailModal } from './BookingDetailModal';
import { CalendarCheck, Search, Zap, Clock, MapPin, User, ChevronRight } from 'lucide-react';

export const AdminBookingsView: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'emergency' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const loadBookings = async () => {
    const res = await bookingService.getBookings();
    if (res.success && res.data) {
      setBookings(res.data);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const emergencyBookings = bookings.filter((b) => b.urgency === 'EMERGENCY');
  const activeBookings = bookings.filter((b) =>
    ['REQUESTED', 'MATCHED', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)
  );

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.worker?.name && b.worker.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'active') return ['REQUESTED', 'MATCHED', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status);
    if (statusFilter === 'emergency') return b.urgency === 'EMERGENCY';
    if (statusFilter === 'completed') return b.status === 'COMPLETED';
    if (statusFilter === 'cancelled') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px' }}>
      {/* 1. Emergency Operations Priority Monitor (Section 5) */}
      <div
        style={{
          backgroundColor: '#FEF2F2',
          border: '1.5px solid #FCA5A5',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="var(--danger)" fill="var(--danger)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--danger)' }}>
              15-Minute Emergency Operations Monitor ({emergencyBookings.length} Priority)
            </span>
          </div>
          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--danger)', backgroundColor: '#FEE2E2', padding: '1px 6px', borderRadius: 'var(--radius-xs)' }}>
            Live SLA
          </span>
        </div>

        {emergencyBookings.length === 0 ? (
          <div style={{ fontSize: '0.6875rem', color: '#991B1B' }}>
            No active emergency dispatches at this moment.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {emergencyBookings.map((eb) => (
              <div
                key={eb.id}
                onClick={() => setSelectedBooking(eb)}
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {eb.token}
                    </span>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {eb.serviceName}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {eb.customerName} ↔ <strong>{eb.worker?.name || 'Assigned Worker'}</strong> ({eb.city})
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 800,
                      backgroundColor: eb.status === 'COMPLETED' ? 'var(--success-light)' : '#FEE2E2',
                      color: eb.status === 'COMPLETED' ? 'var(--success-dark)' : 'var(--danger)',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    {eb.status.replace(/_/g, ' ')}
                  </span>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {eb.scheduledTime || 'Immediate Priority'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Dispatch Stream & Search Monitor */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CalendarCheck size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Live Booking Dispatch Stream ({bookings.length})
            </h3>
          </div>
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-xs)',
            padding: '6px 10px',
            border: '1px solid var(--border-default)',
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search token, customer, worker, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '0.75rem',
              outline: 'none',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
          {(['all', 'active', 'emergency', 'completed', 'cancelled'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                backgroundColor: statusFilter === key ? 'var(--primary)' : 'var(--bg-muted)',
                color: statusFilter === key ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              {key === 'all' && `All (${bookings.length})`}
              {key === 'active' && `Active (${activeBookings.length})`}
              {key === 'emergency' && `Emergency (${emergencyBookings.length})`}
              {key === 'completed' && 'Completed'}
              {key === 'cancelled' && 'Cancelled'}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredBookings.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              No bookings found for the selected filter.
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {b.token}
                    </span>
                    {b.urgency === 'EMERGENCY' && (
                      <span style={{ fontSize: '0.5625rem', fontWeight: 800, color: 'var(--danger)', backgroundColor: '#FEF2F2', padding: '1px 5px', borderRadius: 'var(--radius-xs)' }}>
                        ⚡ Emergency
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {b.serviceName}
                  </div>

                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
                    <User size={10} /> {b.customerName} ↔ <strong>{b.worker?.name || 'Unassigned'}</strong>
                  </div>

                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                    <Clock size={10} /> {b.scheduledTime || 'Today'} • <MapPin size={10} /> {b.city}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    ₹{b.totalPrice}
                  </div>
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-xs)',
                      display: 'inline-block',
                      marginTop: '3px',
                      backgroundColor:
                        b.status === 'COMPLETED'
                          ? 'var(--success-light)'
                          : b.status === 'CANCELLED'
                          ? '#FEF2F2'
                          : '#EFF6FF',
                      color:
                        b.status === 'COMPLETED'
                          ? 'var(--success-dark)'
                          : b.status === 'CANCELLED'
                          ? 'var(--danger)'
                          : '#1D4ED8',
                    }}
                  >
                    {b.status.replace(/_/g, ' ')}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px', fontSize: '0.625rem', color: 'var(--primary)', marginTop: '4px', fontWeight: 700 }}>
                    <span>Details</span>
                    <ChevronRight size={10} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
};
