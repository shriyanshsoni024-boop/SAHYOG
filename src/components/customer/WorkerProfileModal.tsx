import React from 'react';
import { Worker } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Rating } from '../ui/Rating';
import { ShieldCheck, Award, BookOpen, MapPin, Check, UserCheck } from 'lucide-react';
import { MOCK_REVIEWS } from '../../data/mockData';

export interface WorkerProfileModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (worker: Worker) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  isOpen,
  onClose,
  onSelect,
}) => {
  const { t, language } = useLanguage();

  if (!worker) return null;
  const workerName = language === 'hi' ? worker.nameHi : worker.name;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('worker_details')} maxWidth="440px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Header Profile Section */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <img
            src={worker.avatar}
            alt={worker.name}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              border: '1px solid var(--border-default)',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {workerName}
              </h3>
              <Badge variant="verified" size="sm" icon={<ShieldCheck size={11} />}>
                KYC Verified
              </Badge>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <Rating value={worker.rating} count={worker.reviewCount} size={12} />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                • {worker.experienceYears} {t('years_exp')}
              </span>
            </div>

            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={11} color="var(--primary)" />
              <span>{worker.zone}</span>
            </div>
          </div>
        </div>

        {/* Cooperative Affiliation Box */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <Award size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {t('cooperative_affiliation')}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1px' }}>
              {worker.cooperativeName}
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '1px' }}>
              Aadhaar KYC & Skill Verified • Artisan Reg #KA-ART-8492
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {t('professions_skills')}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {worker.skills.map((skill, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-muted)',
                  border: '1px solid var(--border-default)',
                  padding: '3px 7px',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Check size={11} color="var(--success-dark)" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {t('certifications')}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {worker.certificates.map((cert, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <BookOpen size={14} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {cert.title}
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    {cert.issuer} ({cert.issuedYear})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Match Breakdown */}
        {worker.matchScoreBreakdown && (
          <div style={{ backgroundColor: '#F9FAFB', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Intelligent Suitability Breakdown ({worker.matchScore}%)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
              <div>Skill Suitability: <strong>{worker.matchScoreBreakdown.skillMatch}/30</strong></div>
              <div>Experience: <strong>{worker.matchScoreBreakdown.experience}/20</strong></div>
              <div>Distance: <strong>{worker.matchScoreBreakdown.distance}/20</strong></div>
              <div>Availability & Rating: <strong>{worker.matchScoreBreakdown.availability + worker.matchScoreBreakdown.rating}/20</strong></div>
            </div>
          </div>
        )}

        {/* Recent Customer Reviews */}
        <div>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {t('recent_reviews')}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {MOCK_REVIEWS.slice(0, 2).map((rev) => (
              <div
                key={rev.id}
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{rev.authorName}</span>
                  <Rating value={rev.rating} showValue={false} size={11} />
                </div>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Book Button */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<UserCheck size={16} />}
          onClick={() => {
            onClose();
            onSelect(worker);
          }}
        >
          {t('select_worker')} & Continue
        </Button>
      </div>
    </Modal>
  );
};
