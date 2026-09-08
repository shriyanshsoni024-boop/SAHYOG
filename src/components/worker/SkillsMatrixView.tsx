import React from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { SkillItem } from '../../types';
import { Award, CheckCircle, PlayCircle, Plus, ShieldCheck } from 'lucide-react';

export const SkillsMatrixView: React.FC = () => {
  const { skillsMatrix, trainingModules, setActiveQuizModule, setShowQuizModal, setActiveTab, certificates, setActiveCertificate, setShowCertificateModal } = useWorker();
  const { language } = useLanguage();

  const handleLaunchQuiz = (skill: SkillItem) => {
    // Find matching training module
    const matchedModule = trainingModules.find(m => m.profession.toLowerCase() === skill.profession.toLowerCase()) || trainingModules[0];
    setActiveQuizModule(matchedModule);
    setShowQuizModal(true);
  };

  const handleViewCert = (certNumber?: string) => {
    if (!certNumber) return;
    const cert = certificates.find(c => c.certificateNumber === certNumber) || certificates[0];
    setActiveCertificate(cert);
    setShowCertificateModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* Header Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={18} color="var(--secondary)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {language === 'hi' ? 'कारीगर कौशल मैट्रिक्स' : 'Worker Skills Matrix'}
            </h2>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            {language === 'hi'
              ? 'बहु-कौशल सत्यापन से आपकी बुकिंग प्राथमिकता और मैच स्कोर बढ़ता है।'
              : 'Multi-trade skill certifications boost your job allocation match score.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('training')}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--secondary-light)',
            color: 'var(--secondary)',
            border: '1px solid #99F6E4',
            borderRadius: 'var(--radius-md)',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          className="sahyog-btn"
        >
          <Plus size={14} />
          <span>Add Skills</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--secondary)' }}>
            {skillsMatrix.filter(s => s.verified).length}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            Verified Skills
          </div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-warm)' }}>
            {skillsMatrix.filter(s => !s.verified).length}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            Tests Pending
          </div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>
            {certificates.length}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            Certificates
          </div>
        </div>
      </div>

      {/* Skills List by Profession */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Assessed & Registered Skills
        </div>

        {skillsMatrix.map((skill) => {
          const isCertified = skill.verified;

          return (
            <div
              key={skill.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: 'var(--bg-muted)',
                      color: 'var(--text-secondary)',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    {skill.profession}
                  </span>

                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: isCertified ? 'var(--success-dark)' : 'var(--accent-warm-dark)',
                      backgroundColor: isCertified ? 'var(--success-light)' : 'var(--accent-warm-light)',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    {skill.level}
                  </span>
                </div>

                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {language === 'hi' ? skill.nameHi : skill.name}
                </div>

                {skill.certificateNumber && (
                  <div
                    onClick={() => handleViewCert(skill.certificateNumber)}
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--secondary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <ShieldCheck size={13} />
                    <span>Cert: {skill.certificateNumber} (View)</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div>
                {isCertified ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: 'var(--success-dark)',
                      backgroundColor: 'var(--success-light)',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--success-border)',
                    }}
                  >
                    <CheckCircle size={14} />
                    <span>Verified</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLaunchQuiz(skill)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--secondary)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    className="sahyog-btn"
                  >
                    <PlayCircle size={14} />
                    <span>Take Test</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
