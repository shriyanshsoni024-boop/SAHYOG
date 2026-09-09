import React from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { CheckCircle2, ShieldCheck, Wallet } from 'lucide-react';


export const WorkerEarningsView: React.FC = () => {
  const { worker, earningsHistory, todayEarnings, weeklyEarnings } = useWorker();
  const { language } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px' }}>
      {/* Earnings Overview Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 16px',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Cooperative Payout Balance
          </span>
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#34D399',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
            }}
          >
            0% COMMISSION
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            ₹{todayEarnings}
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
            {language === 'hi' ? 'आज की कुल कमाई' : "Today's Net Take-Home"}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #334155' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>This Week:</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF' }}>₹{weeklyEarnings}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>Completed Jobs:</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF' }}>{worker.completedJobs} Jobs</div>
          </div>
        </div>
      </div>

      {/* Bank Settlement Info Card */}
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
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--secondary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
            }}
          >
            <Wallet size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Bank Auto-Settlement Account
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              HDFC Bank •••• 4019 (UPI Verified) • Daily 09:00 PM
            </div>
          </div>
        </div>

        <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--success-dark)' }}>
          Active
        </span>
      </div>

      {/* Cooperative 0% Commission Dignity Transparency */}
      <div
        style={{
          backgroundColor: '#F0FDFA',
          border: '1px solid #99F6E4',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 800, color: 'var(--secondary)' }}>
          <ShieldCheck size={16} />
          <span>SAHYOG Dignified Labor Transparency</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.35, margin: '4px 0 0' }}>
          Unlike private aggregators who charge 25–30% commissions, SAHYOG charges <strong>0% commission</strong>. Customers pay standard rates directly, and a nominal ₹25 connection fee covers insurance and platform server maintenance.
        </p>
      </div>

      {/* Itemized Payout Transaction Ledger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Completed Job Transactions ({earningsHistory.length})
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            Auto-Updated via Booking Payouts
          </span>
        </div>

        {earningsHistory.map((ern) => (
          <div
            key={ern.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {ern.bookingToken}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                  {ern.date}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.625rem', color: 'var(--success-dark)', fontWeight: 800, backgroundColor: 'var(--success-light)', padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>
                <CheckCircle2 size={11} />
                <span>{ern.status === 'PAID' ? 'Settled' : 'Pending'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {ern.serviceName}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                  Customer: <strong>{ern.customerName}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--success-dark)' }}>
                  +₹{ern.netPayout}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                  Net Payout
                </div>
              </div>
            </div>

            {/* Price breakdown sub-row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px dashed var(--border-default)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>Customer Gross: ₹{ern.amount}</span>
              <span>Platform Fee: -₹{ern.platformFee}</span>
              <span style={{ fontWeight: 800, color: 'var(--success-dark)' }}>Take-Home: ₹{ern.netPayout}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
