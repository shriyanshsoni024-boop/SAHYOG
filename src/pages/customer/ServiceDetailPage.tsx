import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Sparkles, Zap, Clock, MapPin, Upload } from 'lucide-react';
import { ServiceTier } from '../../types';

export const ServiceDetailPage: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    selectedCategory,
    selectedTier,
    setSelectedTier,
    urgency,
    setUrgency,
    problemDescription,
    setProblemDescription,
    photoEstimate,
    setPhotoEstimate,
    setActiveView,
  } = useBooking();

  const [simulatingAi, setSimulatingAi] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<'today' | 'tomorrow'>('today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('morning');

  if (!selectedCategory) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Please select a service category.</p>
        <Button onClick={() => setActiveView('home')} style={{ marginTop: '12px' }}>
          Back to Home
        </Button>
      </div>
    );
  }

  const categoryName = language === 'hi' ? selectedCategory.nameHi : selectedCategory.name;

  const handleSimulatedPhotoUpload = () => {
    setSimulatingAi(true);
    setTimeout(() => {
      setSimulatingAi(false);
      const detectedTier: ServiceTier = selectedCategory.id === 'ac_repair' ? 'MEDIUM' : 'SMALL';
      setPhotoEstimate({
        detected: true,
        tier: detectedTier,
        confidence: 92,
        label: `${selectedCategory.name} - Standard complexity detected`,
      });
      setSelectedTier(detectedTier);
    }, 1000);
  };

  const getTierPrice = (tier: ServiceTier) => {
    const base = selectedCategory.basePrice;
    if (tier === 'SMALL') return base;
    if (tier === 'MEDIUM') return Math.round(base * 1.8);
    return Math.round(base * 2.8);
  };

  const currentPrice = getTierPrice(selectedTier);
  const connectionFee = 25;
  const totalPrice = currentPrice + connectionFee;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveView('home')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid var(--border-default)',
            }}
            aria-label="Back to home"
          >
            <ArrowLeft size={16} color="var(--text-primary)" />
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {categoryName}
            </h1>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {selectedCategory.category} • Standard Standardized Pricing
            </span>
          </div>
        </div>

        {/* Urgency Selector */}
        <div>
          <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
            {t('service_urgency')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setUrgency('NORMAL')}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${urgency === 'NORMAL' ? 'var(--primary)' : 'var(--border-default)'}`,
                backgroundColor: urgency === 'NORMAL' ? 'var(--primary-light)' : 'var(--bg-surface)',
                color: urgency === 'NORMAL' ? 'var(--primary)' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Clock size={15} />
              <span>{t('urgency_normal')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUrgency('EMERGENCY');
                setSelectedTier('MEDIUM');
              }}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${urgency === 'EMERGENCY' ? 'var(--danger)' : 'var(--border-default)'}`,
                backgroundColor: urgency === 'EMERGENCY' ? 'var(--danger-light)' : 'var(--bg-surface)',
                color: urgency === 'EMERGENCY' ? 'var(--danger)' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Zap size={15} color={urgency === 'EMERGENCY' ? 'var(--danger)' : 'var(--text-muted)'} />
              <span>{t('urgency_emergency')}</span>
            </button>
          </div>
        </div>

        {/* Problem Description */}
        <div>
          <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
            {t('problem_details')}
          </label>
          <textarea
            rows={3}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder={t('describe_problem_placeholder')}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-sans)',
              resize: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-surface)',
            }}
          />
        </div>

        {/* AI Complexity Estimation Scanner */}
        <div
          style={{
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            backgroundColor: 'var(--bg-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={15} color="var(--primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {t('upload_photo_label')}
              </span>
            </div>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--secondary)' }}>
              AI Assistant
            </span>
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            {t('upload_photo_hint')}
          </p>

          {photoEstimate ? (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--primary-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Detected Tier: {photoEstimate.tier} ({photoEstimate.confidence}% Confidence)
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                  {photoEstimate.label}
                </div>
              </div>
              <Badge variant="match" size="sm">Auto Selected</Badge>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={simulatingAi}
              leftIcon={<Upload size={13} />}
              onClick={handleSimulatedPhotoUpload}
              style={{ alignSelf: 'flex-start', marginTop: '2px' }}
            >
              Scan Problem Photo
            </Button>
          )}
        </div>

        {/* Tier Selection Cards (Urban Company Style Transparent Rate Card) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t('select_service_tier')}
              </label>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Fixed standardized labor rates • No hidden surge
              </div>
            </div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)' }}>
              100% Rate Transparency
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(['SMALL', 'MEDIUM', 'LARGE'] as ServiceTier[]).map((tier) => {
              const isSelected = selectedTier === tier;
              const tierTitle = tier === 'SMALL' ? t('tier_small') : tier === 'MEDIUM' ? t('tier_medium') : t('tier_large');
              const tierDesc = tier === 'SMALL' ? t('tier_small_desc') : tier === 'MEDIUM' ? t('tier_medium_desc') : t('tier_large_desc');
              const price = getTierPrice(tier);
              const isPopular = tier === 'MEDIUM';

              const inclusions = tier === 'SMALL'
                ? ['Single point repair / switch or tap check', 'Up to 30 mins labor included', '30-Day SAHYOG rework guarantee']
                : tier === 'MEDIUM'
                ? ['Complete circuit/pipe repair or servicing', 'Up to 60 mins dedicated pro labor', 'Full testing & cleanup included', '30-Day SAHYOG rework guarantee']
                : ['Major overhaul, wiring or multi-point setup', 'Up to 120 mins intensive artisan labor', 'Comprehensive diagnostic report', '30-Day SAHYOG rework guarantee'];

              return (
                <div
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-default)'}`,
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
                    transition: 'all var(--transition-fast)',
                  }}
                  className="hover-card"
                >
                  {isPopular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-9px',
                        right: '14px',
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        fontSize: '0.5625rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Most Popular
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-strong)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '2px',
                          flexShrink: 0,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                          {tierTitle}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {tierDesc}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ₹{price}
                      </div>
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                        Labor rate
                      </div>
                    </div>
                  </div>

                  {/* Bulleted Inclusions */}
                  <div style={{ paddingLeft: '28px', display: 'flex', flexDirection: 'column', gap: '3px', borderTop: '1px dashed var(--border-default)', paddingTop: '6px' }}>
                    {inclusions.map((inc, i) => (
                      <div key={i} style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: 'var(--success-dark)', fontWeight: 700 }}>✓</span>
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule Date & Time Slot */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
            {t('schedule_slot')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setSelectedSlot('today')}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${selectedSlot === 'today' ? 'var(--primary)' : 'var(--border-default)'}`,
                backgroundColor: selectedSlot === 'today' ? 'var(--primary-light)' : 'var(--bg-surface)',
                color: selectedSlot === 'today' ? 'var(--primary)' : 'var(--text-primary)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {t('today')} • Available
            </button>
            <button
              type="button"
              onClick={() => setSelectedSlot('tomorrow')}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${selectedSlot === 'tomorrow' ? 'var(--primary)' : 'var(--border-default)'}`,
                backgroundColor: selectedSlot === 'tomorrow' ? 'var(--primary-light)' : 'var(--bg-surface)',
                color: selectedSlot === 'tomorrow' ? 'var(--primary)' : 'var(--text-primary)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {t('tomorrow')}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '8px' }}>
            {[
              { id: 'morning', label: '09 AM - 12 PM', slotName: 'Morning' },
              { id: 'afternoon', label: '12 PM - 04 PM', slotName: 'Afternoon' },
              { id: 'evening', label: '04 PM - 08 PM', slotName: 'Evening' },
            ].map((slot) => {
              const isSelected = selectedTimeSlot === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-default)'}`,
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                    color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.625rem' }}>{slot.slotName}</span>
                  <span>{slot.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Verification Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.8125rem',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="var(--primary)" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t('current_location')}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Service will be rendered at this address</div>
            </div>
          </div>
          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>
            {t('change_location')}
          </span>
        </div>
      </div>

      {/* Sticky Bottom Action Bar (Consumer Marketplace Pattern) */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-default)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Estimated Price</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{totalPrice}
            <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>
              (incl. ₹25 fee)
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant={urgency === 'EMERGENCY' ? 'emergency' : 'primary'}
          size="lg"
          onClick={() => setActiveView('worker-matching')}
          style={{ flex: 1 }}
        >
          {t('find_workers_cta')}
        </Button>
      </div>
    </div>
  );
};
