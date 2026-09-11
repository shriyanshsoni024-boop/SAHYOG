import React from 'react';
import { Booking } from '../../types';
import { X, CalendarCheck, MapPin, Phone, User, KeyRound, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const grossAmount = booking.totalPrice || 474;
  const platformFee = booking.connectionFee || 25;
  const netPayout = grossAmount - platformFee;

  return (
    <div
      className="animate-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="animate-modal-enter"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '460px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CalendarCheck size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Dispatch Order {booking.token}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="sahyog-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast) var(--ease-out-smooth)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Status & Priority Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-app)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Booking Status
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary)', marginTop: '1px' }}>
              {booking.status.replace(/_/g, ' ')}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {booking.urgency === 'EMERGENCY' && (
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  backgroundColor: '#FEE2E2',
                  color: '#B91C1C',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #FCA5A5',
                }}
              >
                ⚡ Emergency Priority
              </span>
            )}
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              {booking.tier} Tier
            </span>
          </div>
        </div>

        {/* Service Details */}
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {booking.serviceName}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '3px 0 0', lineHeight: 1.4 }}>
            "{booking.description}"
          </p>
        </div>

        {/* Customer & Worker Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.6875rem' }}>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <User size={11} /> Customer
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {booking.customerName}
            </div>
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '1px' }}>
              <Phone size={10} /> {booking.customerPhone}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-app)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={11} color="var(--primary)" /> Assigned Artisan
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {booking.worker?.name || 'Pending Assignment'}
            </div>
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '1px' }}>
              <Phone size={10} /> {booking.worker?.phone || 'N/A'}
            </div>
          </div>
        </div>

        {/* Location & OTP Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: 'var(--bg-app)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', fontSize: '0.6875rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', color: 'var(--text-secondary)' }}>
            <MapPin size={12} color="var(--primary)" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{booking.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={11} /> Slot: <strong>{booking.scheduledTime || 'Today'}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 800, color: 'var(--primary)' }}>
              <KeyRound size={11} /> Start OTP: <strong>{booking.otp || '4829'}</strong>
            </span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            backgroundColor: 'var(--primary-light, #F0FDF4)',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--primary-border, #D9E9C8)',
            fontSize: '0.75rem',
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)' }}>
              Customer Total: ₹{grossAmount} • Coop Fee: ₹{platformFee}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Labor Payout (0% Aggregator Commission)
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Net Artisan Pay</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--success-dark)' }}>
              ₹{netPayout}
            </div>
          </div>
        </div>

        {/* Audit Status History Timeline */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Status Audit Timeline ({(booking.statusHistory || []).length} events)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(booking.statusHistory || []).map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.6875rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={12} color="var(--success-dark)" />
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                    {item.note && (
                      <span style={{ color: 'var(--text-secondary)', marginLeft: '4px' }}>
                        • {item.note}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                  {item.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-xs)',
            fontWeight: 800,
            fontSize: '0.8125rem',
            border: 'none',
            cursor: 'pointer',
            marginTop: '4px',
          }}
        >
          Close Order
        </button>
      </div>
    </div>
  );
};
