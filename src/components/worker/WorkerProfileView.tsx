import React from 'react';
import { useWorker } from '../../context/WorkerContext';
import { ShieldCheck, Award, Building2, Star, Edit3, ChevronRight, Zap } from 'lucide-react';

export const WorkerProfileView: React.FC = () => {
  const { worker, certificates, setActiveCertificate, setShowCertificateModal, setShowOnboardingModal, isEmergencyAvailable, setIsEmergencyAvailable } = useWorker();

  const handleOpenCert = (certId: string) => {
    const cert = certificates.find(c => c.id === certId) || certificates[0];
    setActiveCertificate(cert);
    setShowCertificateModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* Profile Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={worker.avatar}
            alt={worker.name}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              objectFit: 'cover',
              border: '2px solid var(--secondary)',
            }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                {worker.name}
              </h2>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success-dark)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--success-border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <ShieldCheck size={11} />
                KYC Verified
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 600 }}>
              {worker.professions.join(' • ')}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 800, color: '#92400E', backgroundColor: '#FEF3C7', padding: '1px 6px', borderRadius: 'var(--radius-xs)' }}>
                <Star size={11} fill="#D97706" color="#D97706" />
                {worker.rating} ({worker.reviewCount} reviews)
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                • {worker.experienceYears} Years Exp
              </span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => setShowOnboardingModal(true)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Edit3 size={14} />
          <span>Update Profile & Trade Skills</span>
        </button>
      </div>

      {/* Emergency Availability Toggle */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
            <Zap size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              15-Minute Emergency Squad Dispatch
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              Receive priority urgent calls with 0% platform fee
            </div>
          </div>
        </div>

        <input
          type="checkbox"
          checked={isEmergencyAvailable}
          onChange={(e) => setIsEmergencyAvailable(e.target.checked)}
          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--danger)' }}
        />
      </div>

      {/* Cooperative Union Identity */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '14px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Building2 size={16} color="var(--primary)" />
          <span>Cooperative Membership & Safety Net</span>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          • Affiliation: <strong>{worker.cooperativeName}</strong><br />
          • Member ID: <strong>SYH-MEM-8942</strong><br />
          • Working Zone: <strong>{worker.zone}</strong><br />
          • Aadhaar KYC: <strong>{worker.aadhaarNumber || 'Verified UIDAI'}</strong>
        </div>
      </div>

      {/* Certificate Wallet */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Trade Certificate Wallet ({certificates.length})
          </span>
        </div>

        {certificates.map((cert) => (
          <div
            key={cert.id}
            onClick={() => handleOpenCert(cert.id)}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 14px',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-xs)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            className="hover-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {cert.profession} Specialist
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {cert.certificateNumber} • Score: {cert.score}/10
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)' }}>
              <span>View</span>
              <ChevronRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
