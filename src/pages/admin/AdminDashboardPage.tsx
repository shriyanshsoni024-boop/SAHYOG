import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Building2, Users, ShieldCheck, Zap, Activity, TrendingUp, AlertTriangle, Check, X, Sparkles } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [kycQueue, setKycQueue] = useState([
    { id: 'v-1', name: 'Manish Verma', profession: 'Electrician', cooperative: 'East Zone Cooperative', documents: 'Aadhaar + ITI Diploma', status: 'PENDING' },
    { id: 'v-2', name: 'Kavita Rao', profession: 'Appliance Repair', cooperative: 'City Women Artisan Union', documents: 'Aadhaar + NSDC Level 2', status: 'PENDING' },
  ]);

  const [activeServices] = useState([
    { token: 'SYH-48291', customer: 'Ananya Deshmukh', worker: 'Rahul Kumar', service: 'AC Repair', status: 'ACCEPTED', urgency: 'NORMAL', time: '10:18 AM' },
    { token: 'SYH-77210', customer: 'Rohan Joshi', worker: 'Suresh Patil', service: 'Electrician', status: 'IN_PROGRESS', urgency: 'EMERGENCY', time: '10:05 AM' },
    { token: 'SYH-31904', customer: 'Ananya Deshmukh', worker: 'Suresh Patil', service: 'Electrician', status: 'COMPLETED', urgency: 'EMERGENCY', time: '04:55 PM' },
  ]);

  const handleKycAction = (id: string, _action: 'APPROVED' | 'REJECTED') => {
    setKycQueue(prev => prev.filter(k => k.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Cooperative Federation Header Banner */}
      <div
        style={{
          backgroundColor: '#1E293B',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={24} color="#60A5FA" />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Bangalore District Cooperative Workforce Federation
            </h1>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '4px' }}>
            Cooperative Union Node #KA-BLR-04 • Monitoring 128 registered skilled artisans across 6 urban zones
          </p>
        </div>

        <Badge variant="verified" size="md">
          Federation Live
        </Badge>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Total Workers</span>
            <Users size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>128</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--success-dark)', fontWeight: 600, marginTop: '2px' }}>
            96 KYC Verified
          </div>
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Available Now</span>
            <Activity size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginTop: '6px' }}>41</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            32% Online Availability
          </div>
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Active Bookings</span>
            <TrendingUp size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '6px' }}>24</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            91 Completed this week
          </div>
        </Card>

        <Card padding="md" style={{ backgroundColor: '#FEF2F2', border: '1.5px solid #FCA5A5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)' }}>Emergency Dispatches</span>
            <Zap size={18} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)', marginTop: '6px' }}>6</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--danger)', fontWeight: 600, marginTop: '2px' }}>
            Average response: 14 min
          </div>
        </Card>
      </div>

      {/* AI Demand Forecasting & Workforce Allocation Recommendation (PRD Section 47 & 48) */}
      <Card
        variant="elevated"
        style={{
          backgroundColor: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                AI Demand Forecasting & Predictive Workforce Allocation
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Analyzes 90-day booking spikes to turn predictions into direct operational recommendations for the cooperative.
              </p>
            </div>
          </div>
          <Badge variant="match" size="md">
            AI Engine v1.0
          </Badge>
        </div>

        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <AlertTriangle size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary)' }}>
                Surge Alert: Electrical & AC Repair demand projected +42% in Indiranagar/Koramangala Zone
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Only 6 electricians currently active in Zone 4. <strong>Recommendation:</strong> Reallocate 4 idle certified electricians from Central Zone to maintain sub-15 minute arrival SLAs.
              </div>
            </div>
          </div>

          <Button size="sm" variant="primary">
            Apply Reallocation (4 Workers)
          </Button>
        </div>
      </Card>

      {/* Split View: KYC Verification Queue & Live Service Monitor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* KYC Verification Queue */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} color="var(--success-dark)" />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800 }}>
                Pending Artisan KYC Verifications ({kycQueue.length})
              </h3>
            </div>
          </div>

          {kycQueue.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              All pending verification requests are cleared.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {kycQueue.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-muted)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                      {item.profession} • {item.cooperative}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Docs: {item.documents}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleKycAction(item.id, 'APPROVED')}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--success)',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                      }}
                    >
                      <Check size={14} />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKycAction(item.id, 'REJECTED')}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--danger)',
                        border: '1px solid var(--border-default)',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Live Service Monitoring */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800 }}>
                Live Service Stream ({activeServices.length})
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeServices.map((svc) => (
              <div
                key={svc.token}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{svc.token}</span>
                    <Badge variant={svc.urgency === 'EMERGENCY' ? 'emergency' : 'neutral'} size="sm">
                      {svc.urgency}
                    </Badge>
                  </div>
                  <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>
                    {svc.customer} ↔ <strong>{svc.worker}</strong> ({svc.service})
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <Badge variant={svc.status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                    {svc.status}
                  </Badge>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {svc.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
