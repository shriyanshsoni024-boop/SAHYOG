import React from 'react';
import { Worker } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Rating } from '../ui/Rating';
import { ShieldCheck, MapPin, Sparkles, Check, Award } from 'lucide-react';

export interface WorkerCardProps {
  worker: Worker;
  onSelect: (worker: Worker) => void;
  onViewProfile: (worker: Worker) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onSelect, onViewProfile }) => {
  const { t, language } = useLanguage();
  const workerName = language === 'hi' ? worker.nameHi : worker.name;

  return (
    <Card
      variant="default"
      padding="none"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1.5px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
      }}
      className="hover-card"
    >
      {/* Top Match & Verification Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-muted)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Sparkles size={13} color="var(--primary)" />
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--primary-dark, #0F7A3E)' }}>
            {t('match_score')}: {worker.matchScore || 92}%
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Badge variant="verified" size="sm" icon={<ShieldCheck size={11} />}>
            {t('kyc_verified')}
          </Badge>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--success-dark)', backgroundColor: 'var(--success-light)', border: '1px solid var(--success-border)', padding: '1px 5px', borderRadius: 'var(--radius-xs)' }}>
            Police Cleared
          </span>
        </div>
      </div>

      {/* Main Artisan Info */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Avatar with Online Pulse */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={worker.avatar}
              alt={worker.name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                border: '1px solid var(--border-strong)',
              }}
            />
            <span
              className="animate-pulse-live"
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
                border: '2px solid #ffffff',
              }}
              title="Available Now"
            />
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {workerName}
              </h3>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--primary-dark, #0F7A3E)', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'var(--primary-light, #F0FDF4)', padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>
                <MapPin size={11} />
                {worker.distanceKm} km away
              </span>
            </div>

            {/* Professions list */}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              {worker.professions.join(' • ')}
            </div>

            {/* Rating & Experience */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Rating value={worker.rating} count={worker.reviewCount} size={11} />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                • {worker.experienceYears} {t('years_exp')}
              </span>
            </div>
          </div>
        </div>

        {/* Cooperative Union Endorsement Tag */}
        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Award size={13} color="var(--primary)" />
          <span>Cooperative: <strong style={{ color: 'var(--text-primary)' }}>{worker.cooperativeName}</strong></span>
        </div>

        {/* Why Recommended Bullets */}
        {worker.matchReasons && worker.matchReasons.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            {worker.matchReasons.slice(0, 2).map((reason, idx) => (
              <div key={idx} style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Check size={12} color="var(--success-dark)" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '8px', marginTop: '2px' }}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onViewProfile(worker)}
          >
            {t('view_profile')}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onSelect(worker)}
          >
            {t('select_worker')} →
          </Button>
        </div>
      </div>
    </Card>
  );
};
