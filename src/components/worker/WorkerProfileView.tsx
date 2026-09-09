import React from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, Award, Building2, Star, Edit3, ChevronRight, Zap, Phone, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WorkerProfileView: React.FC = () => {
  const { logout } = useAuth();
  const {
    worker,
    certificates,
    setActiveCertificate,
    setShowCertificateModal,
    setShowOnboardingModal,
    isEmergencyAvailable,
    setIsEmergencyAvailable,
    skillsMatrix,
  } = useWorker();
  const { language } = useLanguage();

  const handleOpenCert = (certId: string) => {
    const cert = certificates.find((c) => c.id === certId) || certificates[0];
    if (cert) {
      setActiveCertificate(cert);
      setShowCertificateModal(true);
    }
  };

  const verifiedSkillsCount = skillsMatrix.filter((s) => s.verified).length;


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px' }}>
      {/* 1. Worker Identity Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={worker.avatar}
            alt={worker.name}
            style={{
              width: '58px',
              height: '58px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              border: '2px solid var(--secondary)',
            }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                {worker.name}
              </h2>
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
                KYC Verified
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 700 }}>
              {worker.professions.join(' • ')}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.6875rem', fontWeight: 800, color: '#92400E', backgroundColor: '#FEF3C7', padding: '1px 5px', borderRadius: 'var(--radius-xs)' }}>
                <Star size={10} fill="#D97706" color="#D97706" />
                {worker.rating} ({worker.reviewCount} reviews)
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                • {worker.experienceYears} Yrs Exp • {worker.completedJobs} Jobs
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Locality Details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '0.6875rem',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-app)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Phone size={12} color="var(--primary)" />
            <span>{worker.phone} (Registered Phone)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} color="var(--primary)" />
            <span>Assigned Working Zone: <strong>{worker.zone}</strong></span>
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => setShowOnboardingModal(true)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
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
          <Edit3 size={13} />
          <span>{language === 'hi' ? 'प्रोफ़ाइल एवं ट्रेड कौशल संपादित करें' : 'Update Profile & Trade Skills'}</span>
        </button>
      </div>

      {/* 2. Cooperative Union & Safety Net Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '6px 8px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Cooperative Union</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{worker.cooperativeName}</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '6px 8px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Member Union ID</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>SYH-MEM-8942</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '6px 8px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Aadhaar KYC</div>
            <div style={{ fontWeight: 700, color: 'var(--success-dark)' }}>{worker.aadhaarNumber || 'Verified UIDAI'}</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '6px 8px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ color: 'var(--text-muted)' }}>Work Accident Cover</div>
            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>₹5,00,000 Group Plan</div>
          </div>
        </div>
      </div>

      {/* 3. Emergency Duty Toggle Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-xs)', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
            <Zap size={16} />
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

      {/* 4. Skills & Training Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Trade Skills
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--secondary)' }}>
            {verifiedSkillsCount} Verified
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            LMS Certifications
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--primary)' }}>
            {certificates.length} Credentials
          </div>
        </div>
      </div>

      {/* 5. Trade Certificate Wallet */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} color="var(--secondary)" />
            <span>Trade Certificate Wallet ({certificates.length})</span>
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            NSDC & Cooperative Federation Verified
          </span>
        </div>

        {certificates.map((cert) => (
          <div
            key={cert.id}
            onClick={() => handleOpenCert(cert.id)}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
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
              <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                <Award size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {cert.profession} Specialist
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {cert.certificateNumber} • Score: {cert.score}/10 Pass
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)' }}>
              <span>View Cert</span>
              <ChevronRight size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* 6. Sign Out Button */}
      <div style={{ marginTop: '8px' }}>
        <button
          type="button"
          onClick={() => logout()}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          className="sahyog-btn"
        >
          <LogOut size={16} />
          <span>Sign Out of Artisan Pro</span>
        </button>
      </div>
    </div>
  );
};
