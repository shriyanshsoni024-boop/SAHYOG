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
    selectedLocation,
    setShowLocationModal,
  } = useBooking();

  const [simulatingAi, setSimulatingAi] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<'today' | 'tomorrow'>('today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('morning');

  if (!selectedCategory) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--theme-text-secondary, #374151)', fontSize: '0.875rem' }}>Please select a service category.</p>
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
      <div style={{ padding: '16px 16px 90px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveView('home')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--theme-muted, #F8F9FA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid var(--border-default)',
            }}
            aria-label="Back to home"
          >
            <ArrowLeft size={16} color="var(--theme-text, #111827)" />
          </button>
          <div>
            <h1 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--theme-text, #111827)', margin: 0 }}>
              {categoryName}
            </h1>
            <span style={{ fontSize: '0.6875rem', color: 'var(--theme-text-muted, #6B7280)' }}>
              {selectedCategory.category} • Standard Rate Card
            </span>
          </div>
        </div>

        {/* Urgency Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--theme-text, #111827)', marginBottom: '5px', display: 'block' }}>
            {t('service_urgency')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setUrgency('NORMAL')}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-xs)',
                border: `1.5px solid ${urgency === 'NORMAL' ? 'var(--theme-accent, #0C831F)' : 'var(--border-default)'}`,
                backgroundColor: urgency === 'NORMAL' ? 'var(--theme-accent-light, #F0FDF4)' : '#FFFFFF',
                color: urgency === 'NORMAL' ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text, #111827)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Clock size={14} />
              <span>{t('urgency_normal')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUrgency('EMERGENCY');
                setSelectedTier('MEDIUM');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-xs)',
                border: `1.5px solid ${urgency === 'EMERGENCY' ? 'var(--danger)' : 'var(--border-default)'}`,
                backgroundColor: urgency === 'EMERGENCY' ? 'var(--danger-light)' : '#FFFFFF',
                color: urgency === 'EMERGENCY' ? 'var(--danger)' : 'var(--theme-text, #111827)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Zap size={14} color={urgency === 'EMERGENCY' ? 'var(--danger)' : 'var(--theme-text-muted, #6B7280)'} />
              <span>{t('urgency_emergency')}</span>
            </button>
          </div>
        </div>

        {/* Problem Description */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--theme-text, #111827)', marginBottom: '5px', display: 'block' }}>
            {t('problem_details')}
          </label>
          <textarea
            rows={2}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder={t('describe_problem_placeholder')}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-default)',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-sans)',
              resize: 'none',
              outline: 'none',
              color: 'var(--theme-text, #111827)',
              backgroundColor: '#FFFFFF',
            }}
          />
        </div>

        {/* AI Complexity Estimation Scanner */}
        <div
          style={{
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
            padding: '10px 12px',
            backgroundColor: 'var(--theme-muted, #F8F9FA)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={14} color="var(--theme-accent, #0C831F)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--theme-text, #111827)' }}>
                {t('upload_photo_label')}
              </span>
            </div>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--theme-accent, #0C831F)' }}>
              AI Assistant
            </span>
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--theme-text-muted, #6B7280)', margin: 0 }}>
            {t('upload_photo_hint')}
          </p>

          {photoEstimate ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--theme-accent-border, #BBF7D0)',
                borderRadius: 'var(--radius-xs)',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--theme-accent, #0C831F)' }}>
                  Detected Tier: {photoEstimate.tier} ({photoEstimate.confidence}% Confidence)
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--theme-text-muted, #6B7280)' }}>
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
              leftIcon={<Upload size={12} />}
              onClick={handleSimulatedPhotoUpload}
              style={{ alignSelf: 'flex-start', marginTop: '2px', padding: '4px 8px', fontSize: '0.75rem' }}
            >
              Scan Problem Photo
            </Button>
          )}
        </div>

        {/* Tier Selection Cards (Transparent Rate Card) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--theme-text, #111827)' }}>
                {t('select_service_tier')}
              </label>
              <div style={{ fontSize: '0.6875rem', color: 'var(--theme-text-muted, #6B7280)' }}>
                Fixed standardized labor rates • No hidden surge
              </div>
            </div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--theme-accent, #0C831F)' }}>
              100% Rate Transparency
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: `1.5px solid ${isSelected ? 'var(--theme-accent, #0C831F)' : 'var(--border-default)'}`,
                    backgroundColor: isSelected ? 'var(--theme-accent-light, #F0FDF4)' : '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
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
                        top: '-8px',
                        right: '12px',
                        backgroundColor: 'var(--primary, #F8CB46)',
                        color: 'var(--primary-text, #111827)',
                        fontSize: '0.5625rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--primary-hover, #EAB308)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Most Popular
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? 'var(--theme-accent, #0C831F)' : 'var(--border-strong)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '2px',
                          flexShrink: 0,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--theme-accent, #0C831F)' }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: isSelected ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text, #111827)' }}>
                          {tierTitle}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--theme-text-secondary, #374151)', marginTop: '1px' }}>
                          {tierDesc}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--theme-text, #111827)' }}>
                        ₹{price}
                      </div>
                      <div style={{ fontSize: '0.5625rem', color: 'var(--theme-text-muted, #6B7280)' }}>
                        Labor rate
                      </div>
                    </div>
                  </div>

                  {/* Bulleted Inclusions */}
                  <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '2px', borderTop: '1px dashed var(--border-default)', paddingTop: '5px' }}>
                    {inclusions.map((inc, i) => (
                      <div key={i} style={{ fontSize: '0.6875rem', color: 'var(--theme-text-secondary, #374151)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: 'var(--theme-accent, #0C831F)', fontWeight: 700 }}>✓</span>
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
          <label style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', marginBottom: '5px', display: 'block' }}>
            {t('schedule_slot')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setSelectedSlot('today')}
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-xs)',
                border: `1.5px solid ${selectedSlot === 'today' ? 'var(--theme-accent, #0C831F)' : 'var(--border-default)'}`,
                backgroundColor: selectedSlot === 'today' ? 'var(--theme-accent-light, #F0FDF4)' : '#FFFFFF',
                color: selectedSlot === 'today' ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text, #111827)',
                fontSize: '0.75rem',
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
                padding: '8px 10px',
                borderRadius: 'var(--radius-xs)',
                border: `1.5px solid ${selectedSlot === 'tomorrow' ? 'var(--theme-accent, #0C831F)' : 'var(--border-default)'}`,
                backgroundColor: selectedSlot === 'tomorrow' ? 'var(--theme-accent-light, #F0FDF4)' : '#FFFFFF',
                color: selectedSlot === 'tomorrow' ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text, #111827)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {t('tomorrow')}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '6px' }}>
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
                    padding: '6px 4px',
                    borderRadius: 'var(--radius-xs)',
                    border: `1px solid ${isSelected ? 'var(--theme-accent, #0C831F)' : 'var(--border-default)'}`,
                    backgroundColor: isSelected ? 'var(--theme-accent-light, #F0FDF4)' : '#FFFFFF',
                    color: isSelected ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text-secondary, #374151)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span style={{ color: isSelected ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text-muted, #6B7280)', fontSize: '0.5625rem' }}>{slot.slotName}</span>
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
            padding: '9px 12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.75rem',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={15} color="var(--theme-accent, #0C831F)" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--theme-text, #111827)' }}>{t('current_location')}</div>
              <div style={{ fontSize: '0.625rem', color: 'var(--theme-text-muted, #6B7280)' }}>{selectedLocation} • 15m Dispatch Area</div>
            </div>
          </div>
          <span
            onClick={() => setShowLocationModal(true)}
            style={{ color: 'var(--theme-accent, #0C831F)', fontWeight: 800, fontSize: '0.6875rem', cursor: 'pointer' }}
          >
            {t('change_location')}
          </span>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-default)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
          zIndex: 40,
        }}
      >
        <div>
          <div style={{ fontSize: '0.625rem', color: 'var(--theme-text-muted, #6B7280)' }}>Estimated Price</div>
          <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--theme-text, #111827)' }}>
            ₹{totalPrice}
            <span style={{ fontSize: '0.625rem', fontWeight: 500, color: 'var(--theme-text-muted, #6B7280)', marginLeft: '4px' }}>
              (incl. ₹25 fee)
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant={urgency === 'EMERGENCY' ? 'emergency' : 'primary'}
          size="md"
          onClick={() => setActiveView('worker-matching')}
          style={{ flex: 1 }}
        >
          {t('find_workers_cta')}
        </Button>
      </div>
    </div>
  );
};
