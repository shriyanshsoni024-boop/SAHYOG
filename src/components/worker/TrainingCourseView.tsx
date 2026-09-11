import React, { useState } from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { TrainingModule } from '../../types';
import {
  BookOpen,
  PlayCircle,
  ExternalLink,
  CheckCircle,
  Award,
  Search
} from 'lucide-react';

const MODULE_THUMBNAILS: Record<string, string> = {
  'tm-elec-mcb': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=480',
  'tm-ac-jet': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=480',
  'tm-plumb-drain': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=480',
  'tm-carp-locks': 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=480',
  'tm-appliance-wm': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=480',
  'tm-paint-waterproof': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=480',
  'tm-clean-deep': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=480',
  'tm-mason-tiles': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=480',
};

export const TrainingCourseView: React.FC = () => {
  const { trainingModules, setActiveQuizModule, setShowQuizModal, worker, certificates, setActiveCertificate, setShowCertificateModal } = useWorker();
  const { language } = useLanguage();

  const [filterTab, setFilterTab] = useState<'all' | 'required' | 'recommended' | 'completed'>('all');
  const [selectedVideo, setSelectedVideo] = useState<TrainingModule | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleStartQuiz = (mod: TrainingModule) => {
    setActiveQuizModule(mod);
    setShowQuizModal(true);
  };

  const handleViewCertForModule = (mod: TrainingModule) => {
    const matchedCert = certificates.find(c => c.profession.toLowerCase() === mod.profession.toLowerCase()) || certificates[0];
    if (matchedCert) {
      setActiveCertificate(matchedCert);
      setShowCertificateModal(true);
    }
  };

  // Grouping logic based on worker professions
  const requiredModules = trainingModules.filter(m => 
    worker.professions.some(p => p.toLowerCase().includes(m.profession.toLowerCase()) || m.profession.toLowerCase().includes(p.toLowerCase())) &&
    !m.completed
  );

  const recommendedModules = trainingModules.filter(m => 
    !worker.professions.some(p => p.toLowerCase().includes(m.profession.toLowerCase()) || m.profession.toLowerCase().includes(p.toLowerCase())) &&
    !m.completed
  );

  const completedModules = trainingModules.filter(m => m.completed);

  // Overall training completion metrics
  const completedCount = completedModules.length;
  const totalCount = trainingModules.length;
  const overallProgressPercent = Math.round((completedCount / totalCount) * 100);

  // Filter modules to display
  let displayedModules = trainingModules;
  if (filterTab === 'required') {
    displayedModules = requiredModules;
  } else if (filterTab === 'recommended') {
    displayedModules = recommendedModules;
  } else if (filterTab === 'completed') {
    displayedModules = completedModules;
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedModules = displayedModules.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.profession.toLowerCase().includes(q) ||
      m.titleHi.includes(q)
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px' }}>
      {/* Header & Overall Progress Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={18} color="var(--primary)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {language === 'hi' ? 'सहकारी व्यावसायिक प्रशिक्षण (LMS)' : 'Worker Vocational LMS & Training'}
            </h2>
          </div>
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--primary-border, #D9E9C8)',
              textTransform: 'uppercase',
            }}
          >
            NSDC Aligned
          </span>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.35 }}>
          {language === 'hi'
            ? '15-मिनट के व्यावहारिक वीडियो पाठ देखें और 10-अंकों के कौशल परीक्षण में 70%+ अंक प्राप्त कर सरकारी मान्यता प्राप्त प्रमाण पत्र अर्जित करें।'
            : 'Watch Indian trade video lessons on YouTube and clear the 10-mark MCQ assessment (70%+ pass) to earn accredited cooperative certificates.'}
        </p>

        {/* Progress Bar & Stats */}
        <div style={{ backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-xs)', padding: '10px 12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-primary)' }}>
              {language === 'hi' ? 'कुल प्रशिक्षण प्रगति:' : 'Overall Training Progress:'}{' '}
              <strong>{completedCount} of {totalCount} Modules Certified</strong>
            </span>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{overallProgressPercent}% Complete</span>
          </div>

          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${overallProgressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--primary)',
                transition: 'width var(--transition-fast)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Active YouTube Video Player (if opened) */}
      {selectedVideo && (
        <div
          style={{
            backgroundColor: '#0F172A',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlayCircle size={15} />
              <span>▶ Now Playing: {selectedVideo.title}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
            >
              ✕ Close Player
            </button>
          </div>

          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-xs)' }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
              title={selectedVideo.title}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <a
              href={selectedVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#93C5FD', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}
            >
              <span>Watch directly on YouTube</span>
              <ExternalLink size={12} />
            </a>

            <button
              type="button"
              onClick={() => {
                setSelectedVideo(null);
                handleStartQuiz(selectedVideo);
              }}
              style={{
                padding: '8px 14px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 800,
                fontSize: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              className="sahyog-btn"
            >
              <Award size={14} />
              <span>Take 10-Mark Assessment →</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.75rem',
              fontWeight: filterTab === 'all' ? 800 : 600,
              border: `1px solid ${filterTab === 'all' ? 'var(--primary)' : 'var(--border-default)'}`,
              backgroundColor: filterTab === 'all' ? 'var(--primary)' : '#FFFFFF',
              color: filterTab === 'all' ? '#FFFFFF' : 'var(--text-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            All Modules ({trainingModules.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('required')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.75rem',
              fontWeight: filterTab === 'required' ? 800 : 600,
              border: `1px solid ${filterTab === 'required' ? 'var(--primary)' : 'var(--border-default)'}`,
              backgroundColor: filterTab === 'required' ? 'var(--primary)' : '#FFFFFF',
              color: filterTab === 'required' ? '#FFFFFF' : 'var(--text-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Required Training ({requiredModules.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('recommended')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.75rem',
              fontWeight: filterTab === 'recommended' ? 800 : 600,
              border: `1px solid ${filterTab === 'recommended' ? 'var(--primary)' : 'var(--border-default)'}`,
              backgroundColor: filterTab === 'recommended' ? 'var(--primary)' : '#FFFFFF',
              color: filterTab === 'recommended' ? '#FFFFFF' : 'var(--text-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Recommended ({recommendedModules.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('completed')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.75rem',
              fontWeight: filterTab === 'completed' ? 800 : 600,
              border: `1px solid ${filterTab === 'completed' ? 'var(--primary)' : 'var(--border-default)'}`,
              backgroundColor: filterTab === 'completed' ? 'var(--primary)' : '#FFFFFF',
              color: filterTab === 'completed' ? '#FFFFFF' : 'var(--text-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Completed ({completedModules.length})
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder={language === 'hi' ? 'प्रशिक्षण मॉड्यूल खोजें...' : 'Search training by trade or topic...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px 7px 32px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-default)',
              fontSize: '0.75rem',
              backgroundColor: '#FFFFFF',
            }}
          />
        </div>
      </div>

      {/* Modules Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayedModules.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              No training modules match the selected filter.
            </div>
          </div>
        ) : (
          displayedModules.map((mod) => {
            const isTradeRequired = worker.professions.some(p => p.toLowerCase().includes(mod.profession.toLowerCase()) || mod.profession.toLowerCase().includes(p.toLowerCase()));
            const thumbnail = MODULE_THUMBNAILS[mod.id] || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=480';

            return (
              <div
                key={mod.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Card Top: Thumbnail + Header */}
                <div style={{ display: 'flex', gap: '12px', padding: '12px 14px' }}>
                  {/* Thumbnail with duration badge */}
                  <div
                    onClick={() => setSelectedVideo(mod)}
                    style={{
                      position: 'relative',
                      width: '100px',
                      height: '70px',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: '1px solid var(--border-default)',
                    }}
                  >
                    <img
                      src={thumbnail}
                      alt={mod.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      <PlayCircle size={22} />
                    </div>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: '#FFFFFF',
                        fontSize: '0.5625rem',
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: '2px',
                      }}
                    >
                      {mod.duration}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 800,
                          backgroundColor: 'var(--bg-muted)',
                          color: 'var(--text-secondary)',
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                        }}
                      >
                        {mod.profession}
                      </span>

                      {isTradeRequired && (
                        <span
                          style={{
                            fontSize: '0.5625rem',
                            fontWeight: 800,
                            backgroundColor: '#FEF3C7',
                            color: '#B45309',
                            padding: '1px 4px',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid #FDE68A',
                          }}
                        >
                          Required Trade
                        </span>
                      )}

                      {mod.completed && (
                        <span
                          style={{
                            fontSize: '0.5625rem',
                            fontWeight: 800,
                            color: 'var(--success-dark)',
                            backgroundColor: 'var(--success-light)',
                            padding: '1px 5px',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--success-border)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            marginLeft: 'auto',
                          }}
                        >
                          <CheckCircle size={10} />
                          {mod.score ? `${mod.score}/10 Pass` : 'Certified'}
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => setSelectedVideo(mod)}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        margin: '0 0 3px',
                        lineHeight: 1.25,
                        cursor: 'pointer',
                      }}
                    >
                      {language === 'hi' ? mod.titleHi : mod.title}
                    </h3>

                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {language === 'hi' ? mod.descriptionHi : mod.description}
                    </p>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    backgroundColor: 'var(--bg-app)',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedVideo(mod)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0,
                    }}
                  >
                    <PlayCircle size={14} />
                    <span>Watch Video ({mod.duration})</span>
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {mod.completed ? (
                      <button
                        type="button"
                        onClick={() => handleViewCertForModule(mod)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--border-default)',
                          color: 'var(--primary)',
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Award size={13} />
                        <span>View Certificate</span>
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleStartQuiz(mod)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: mod.completed ? 'var(--bg-app)' : 'var(--primary)',
                        color: mod.completed ? 'var(--text-secondary)' : '#FFFFFF',
                        border: mod.completed ? '1px solid var(--border-default)' : 'none',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      className="sahyog-btn"
                    >
                      <Award size={13} />
                      <span>{mod.completed ? 'Retake Test' : 'Start 10-Mark Test'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
