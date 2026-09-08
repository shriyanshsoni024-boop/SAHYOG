import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Rating } from '../../components/ui/Rating';
import { CalendarCheck, ChevronRight, PlusCircle, RotateCcw, Clock, ShieldCheck } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/services';

export const CustomerHistoryPage: React.FC = () => {
  const { t } = useLanguage();
  const { bookings, setCurrentBookingId, setActiveView, startServiceBooking } = useBooking();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const activeBookings = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');

  const displayedBookings = activeTab === 'active' 
    ? activeBookings 
    : activeTab === 'completed' 
    ? pastBookings 
    : bookings;

  const handleRebook = (serviceName: string) => {
    const matched = SERVICE_CATEGORIES.find(c => c.name.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(c.name.toLowerCase())) || SERVICE_CATEGORIES[0];
    startServiceBooking(matched, false);
  };

  return (
    <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t('nav_bookings')}
          </h1>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            Track active requests and view past receipts
          </span>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle size={14} />}
          onClick={() => setActiveView('home')}
        >
          Book New
        </Button>
      </div>

      {/* Segmented Filter Bar */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[
          { id: 'all', label: `All (${bookings.length})` },
          { id: 'active', label: `Active (${activeBookings.length})` },
          { id: 'completed', label: `Completed (${pastBookings.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as 'all' | 'active' | 'completed')}
            className={`chip ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {displayedBookings.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
          <CalendarCheck size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('no_bookings_title')}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '280px', margin: '4px auto 14px' }}>
            {t('no_bookings_desc')}
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setActiveView('home')}
          >
            Explore Services
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayedBookings.map((b) => {
            const isOngoing = b.status !== 'COMPLETED' && b.status !== 'CANCELLED';

            return (
              <Card
                key={b.id}
                variant="default"
                padding="md"
                style={{
                  border: isOngoing ? '1.5px solid var(--primary-border)' : '1px solid var(--border-default)',
                  backgroundColor: isOngoing ? 'var(--primary-light)' : 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: 'var(--shadow-xs)',
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isOngoing ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {b.token}
                      </span>
                      <Badge variant={isOngoing ? (b.urgency === 'EMERGENCY' ? 'emergency' : 'match') : 'success'} size="sm">
                        {b.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {b.serviceName} ({b.tier} Tier)
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>₹{b.totalPrice}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} /> {b.scheduledDate} ({b.scheduledTime})
                      </span>
                    </div>

                    {b.worker && (
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} color="var(--success-dark)" />
                        <span>Artisan: <strong>{b.worker.name}</strong> ({b.worker.cooperativeName})</span>
                      </div>
                    )}
                  </div>

                  {b.customerRating && (
                    <Rating value={b.customerRating} size={11} />
                  )}
                </div>

                {b.customerReview && (
                  <div
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      fontSize: '0.6875rem',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic',
                    }}
                  >
                    "{b.customerReview}"
                  </div>
                )}

                {/* Actions Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-default)', paddingTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentBookingId(b.id);
                      setActiveView('tracking');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--primary)',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <span>{isOngoing ? 'Track Live Progress' : 'View Service Details'}</span>
                    <ChevronRight size={14} />
                  </button>

                  {!isOngoing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<RotateCcw size={12} />}
                      onClick={() => handleRebook(b.serviceName)}
                    >
                      Book Again
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
