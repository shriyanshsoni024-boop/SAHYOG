import React from 'react';
import { BookingStatus } from '../../types';
import { Check, Clock, Navigation, Wrench, CheckCircle, LucideIcon } from 'lucide-react';

export interface StateProgressProps {
  currentStatus: BookingStatus;
}

const STEPS: { status: BookingStatus; label: string; icon: LucideIcon }[] = [
  { status: 'REQUESTED', label: 'Requested', icon: Clock },
  { status: 'ACCEPTED', label: 'Accepted', icon: Check },
  { status: 'ON_THE_WAY', label: 'On Way', icon: Navigation },
  { status: 'IN_PROGRESS', label: 'In Progress', icon: Wrench },
  { status: 'COMPLETED', label: 'Done', icon: CheckCircle },
];

export const StateProgress: React.FC<StateProgressProps> = ({ currentStatus }) => {
  const getStepIndex = (status: BookingStatus) => {
    switch (status) {
      case 'REQUESTED': return 0;
      case 'MATCHED': return 0;
      case 'ACCEPTED': return 1;
      case 'ON_THE_WAY': return 2;
      case 'IN_PROGRESS': return 3;
      case 'COMPLETED': return 4;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div style={{ padding: '12px 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Background Connecting Line */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
            right: '20px',
            height: '3px',
            backgroundColor: 'var(--border-default)',
            zIndex: 0,
          }}
        />
        {/* Active Line Fill */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
            width: `${Math.max(0, Math.min(100, (currentIndex / (STEPS.length - 1)) * 100))}%`,
            maxWidth: 'calc(100% - 40px)',
            height: '3px',
            backgroundColor: 'var(--success)',
            transition: 'width 0.4s ease',
            zIndex: 1,
          }}
        />

        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.status}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2,
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDone
                    ? 'var(--success)'
                    : isCurrent
                    ? 'var(--primary)'
                    : 'var(--bg-surface)',
                  color: isDone || isCurrent ? '#ffffff' : 'var(--text-muted)',
                  border: isDone || isCurrent ? 'none' : '2px solid var(--border-strong)',
                  boxShadow: isCurrent ? '0 0 0 4px var(--primary-focus)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon size={14} />
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? 'var(--primary)' : isDone ? 'var(--success-dark)' : 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
