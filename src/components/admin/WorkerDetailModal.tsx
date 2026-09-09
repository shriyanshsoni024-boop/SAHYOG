import React from 'react';
import { Worker } from '../../types';
import { X, ShieldCheck, Award, Star, Phone, MapPin, Building2, Zap, Briefcase } from 'lucide-react';

interface WorkerDetailModalProps {
  worker: Worker | null;
  onClose: () => void;
}

export const WorkerDetailModal: React.FC<WorkerDetailModalProps> = ({ worker, onClose }) => {
  if (!worker) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '440px',
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
            <Briefcase size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Artisan Profile & KYC Dossier
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Worker Summary Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'var(--bg-app)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
          }}
        >
          <img
            src={worker.avatar}
            alt={worker.name}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-sm)',
              objectFit: 'cover',
              border: '1.5px solid var(--primary)',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {worker.name}
              </h4>
              <span
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success-dark)',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--success-border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                <ShieldCheck size={10} />
                {worker.verificationStatus}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
              {worker.professions.join(' • ')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.6875rem', fontWeight: 800, color: '#92400E', backgroundColor: '#FEF3C7', padding: '1px 5px', borderRadius: 'var(--radius-xs)' }}>
                <Star size={10} fill="#D97706" color="#D97706" />
                {worker.rating} ({worker.reviewCount} reviews)
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                • {worker.experienceYears} Yrs Exp • {worker.completedJobs} Jobs
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Union Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.6875rem' }}>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Phone Number</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
              <Phone size={11} /> {worker.phone}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Assigned Zone</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
              <MapPin size={11} /> {worker.zone}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Cooperative Union</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
              <Building2 size={11} /> {worker.cooperativeName}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Emergency Squad</div>
            <div style={{ fontWeight: 700, color: worker.emergencyAvailable ? 'var(--danger)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
              <Zap size={11} /> {worker.emergencyAvailable ? '15-min Ready' : 'Standard'}
            </div>
          </div>
        </div>

        {/* Skills List */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Verified Skills ({(worker.skills || []).length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {(worker.skills || []).map((skill, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.6875rem',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                  fontWeight: 600,
                  border: '1px solid var(--primary-border)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={13} color="var(--secondary)" />
            <span>Accredited Trade Certificates ({(worker.certificates || []).length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(worker.certificates || []).map((cert, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cert.title}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    {cert.issuer} • Issued {cert.issuedYear}
                  </div>
                </div>
                {cert.certificateNumber && (
                  <span style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--secondary)' }}>
                    {cert.certificateNumber}
                  </span>
                )}
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
            marginTop: '6px',
          }}
        >
          Close Dossier
        </button>
      </div>
    </div>
  );
};
