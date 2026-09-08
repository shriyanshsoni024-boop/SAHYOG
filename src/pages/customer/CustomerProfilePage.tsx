import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LanguageToggle } from '../../components/common/LanguageToggle';
import { User, Phone, MapPin, Coins, HeartHandshake, ShieldCheck, ChevronRight, Headphones, FileText } from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {t('nav_profile')}
        </h1>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
          Manage account, addresses, Super Coins & preferences
        </span>
      </div>

      {/* Profile Header */}
      <Card variant="elevated" padding="md">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              border: '2px solid var(--primary-border)',
              flexShrink: 0,
            }}
          >
            <User size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Ananya Deshmukh</h3>
              <Badge variant="verified" size="sm" icon={<ShieldCheck size={11} />}>Verified</Badge>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Phone size={12} />
              <span>+91 99801 22334</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <MapPin size={12} />
              <span>Indiranagar, Bangalore</span>
            </div>
          </div>
        </div>

        {/* Super Coins Balance */}
        <div
          style={{
            marginTop: '14px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Coins size={22} color="#D97706" />
            <div>
              <div style={{ fontSize: '0.625rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                SAHYOG Super Coins
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#78350F' }}>
                375 Coins (₹375 value)
              </div>
            </div>
          </div>
          <Badge variant="tier" size="sm">
            Gold Member
          </Badge>
        </div>
      </Card>

      {/* Saved Addresses */}
      <Card padding="md">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Saved Addresses
          </h4>
          <span style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>
            + Add New
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Home (Default)
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                #412, 12th Main, Indiranagar 4th Block, Bangalore 560038
              </div>
            </div>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>
              Selected
            </span>
          </div>

          <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Office
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                Prestige Meridian, MG Road, Bangalore 560001
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings & Preferences */}
      <Card padding="md">
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Preferences & Language
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>App Language (भाषा)</span>
          <LanguageToggle />
        </div>
      </Card>

      {/* Support & Dispute Assistance */}
      <Card padding="md">
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
          Help & Cooperative Support
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              <Headphones size={15} color="var(--primary)" />
              <span>Cooperative Support Helpline (24x7)</span>
            </div>
            <ChevronRight size={14} color="var(--text-muted)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderTop: '1px solid var(--border-default)', paddingTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              <FileText size={15} color="var(--primary)" />
              <span>SAHYOG 30-Day Guarantee Policy</span>
            </div>
            <ChevronRight size={14} color="var(--text-muted)" />
          </div>
        </div>
      </Card>

      {/* Cooperative Federation Backing Manifesto */}
      <Card
        style={{
          backgroundColor: '#F0FDFA',
          border: '1px solid #99F6E4',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
        padding="md"
      >
        <HeartHandshake size={24} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Cooperative Worker Ecosystem
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.4 }}>
            SAHYOG is backed by regional worker cooperatives, ensuring 100% fair artisan compensation, accident insurance, and verified skills without corporate middleman gouging.
          </p>
        </div>
      </Card>
    </div>
  );
};
