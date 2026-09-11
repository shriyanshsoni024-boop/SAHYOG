import React from 'react';
import {
  LayoutGrid,
  Sparkles,
  Zap,
  Wrench,
  Snowflake,
  Hammer,
  Tv,
  Paintbrush,
  ShieldAlert,
  LucideIcon,
} from 'lucide-react';
import { CATEGORY_THEMES, CategoryTheme } from '../../styles/categoryThemes';

interface CategoryTabsBarProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  activeTheme?: CategoryTheme;
}

const CATEGORIES_LIST: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'cleaning', label: 'Cleaning', icon: Sparkles },
  { id: 'electrician', label: 'Electrician', icon: Zap },
  { id: 'plumbing', label: 'Plumbing', icon: Wrench },
  { id: 'ac', label: 'AC Repair', icon: Snowflake },
  { id: 'carpentry', label: 'Carpentry', icon: Hammer },
  { id: 'appliance', label: 'Appliance', icon: Tv },
  { id: 'painting', label: 'Painting', icon: Paintbrush },
  { id: 'pest_control', label: 'Pest Control', icon: ShieldAlert },
];

export const CategoryTabsBar: React.FC<CategoryTabsBarProps> = ({
  selectedCategoryId,
  onSelectCategory,
  activeTheme: _activeTheme,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '6px 16px',
        scrollbarWidth: 'none',
      }}
      className="hide-scrollbar"
    >
      {CATEGORIES_LIST.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        const Icon = cat.icon;
        const catTheme = CATEGORY_THEMES[cat.id] || CATEGORY_THEMES.all;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className="sahyog-btn"
            style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '9999px',
              backgroundColor: isSelected ? catTheme.primary : '#FFFFFF',
              color: isSelected ? '#FFFFFF' : '#475569',
              border: `1.5px solid ${isSelected ? catTheme.primary : '#E2E8F0'}`,
              boxShadow: isSelected ? `0 4px 12px ${catTheme.primary}40` : '0 1px 4px rgba(0,0,0,0.04)',
              fontSize: '0.8125rem',
              fontWeight: isSelected ? 800 : 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast) var(--ease-out-smooth)',
              transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon size={16} strokeWidth={isSelected ? 2.5 : 2} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
