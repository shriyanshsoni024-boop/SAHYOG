export interface CategoryTheme {
  id: string;
  name: string;
  nameHi: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryBorder: string;
  headerBg: string;
  headerText: string;
  accent: string;
  tagline: string;
  iconName: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  all: {
    id: 'all',
    name: 'All Services',
    nameHi: 'सभी सेवाएं',
    primary: '#0C831F',
    primaryDark: '#086317',
    primaryLight: '#F0FDF4',
    primaryBorder: '#BBF7D0',
    headerBg: 'linear-gradient(135deg, #0C831F 0%, #086317 100%)',
    headerText: '#FFFFFF',
    accent: '#22C55E',
    tagline: 'One professional, multiple home services',
    iconName: 'LayoutGrid',
  },
  cleaning: {
    id: 'cleaning',
    name: 'Cleaning',
    nameHi: 'सफाई सेवा',
    primary: '#059669',
    primaryDark: '#047857',
    primaryLight: '#ECFDF5',
    primaryBorder: '#A7F3D0',
    headerBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    headerText: '#FFFFFF',
    accent: '#10B981',
    tagline: 'Spotless deep cleaning with eco-friendly sanitizers',
    iconName: 'Sparkles',
  },
  electrician: {
    id: 'electrician',
    name: 'Electrician',
    nameHi: 'इलेक्ट्रीशियन',
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primaryLight: '#EFF6FF',
    primaryBorder: '#BFDBFE',
    headerBg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    headerText: '#FFFFFF',
    accent: '#60A5FA',
    tagline: 'Certified electricians for wiring, MCB & appliances',
    iconName: 'Zap',
  },
  plumbing: {
    id: 'plumbing',
    name: 'Plumbing',
    nameHi: 'प्लंबिंग',
    primary: '#0D9488',
    primaryDark: '#0F766E',
    primaryLight: '#F0FDFA',
    primaryBorder: '#99F6E4',
    headerBg: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    headerText: '#FFFFFF',
    accent: '#14B8A6',
    tagline: 'Leak-proof plumbing, fittings & drainage care',
    iconName: 'Wrench',
  },
  ac: {
    id: 'ac',
    name: 'AC Repair',
    nameHi: 'एसी रिपेयर',
    primary: '#0284C7',
    primaryDark: '#0369A1',
    primaryLight: '#F0F9FF',
    primaryBorder: '#BAE6FD',
    headerBg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    headerText: '#FFFFFF',
    accent: '#38BDF8',
    tagline: 'Jet foam servicing, gas refill & cooling fixes',
    iconName: 'Snowflake',
  },
  carpentry: {
    id: 'carpentry',
    name: 'Carpentry',
    nameHi: 'कारपेंटर',
    primary: '#D97706',
    primaryDark: '#B45309',
    primaryLight: '#FFFBEB',
    primaryBorder: '#FDE68A',
    headerBg: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    headerText: '#FFFFFF',
    accent: '#F59E0B',
    tagline: 'Furniture assembly, lock repair & woodwork polish',
    iconName: 'Hammer',
  },
  appliance: {
    id: 'appliance',
    name: 'Appliance Repair',
    nameHi: 'उपकरण मरम्मत',
    primary: '#4F46E5',
    primaryDark: '#4338CA',
    primaryLight: '#EEF2FF',
    primaryBorder: '#C7D2FE',
    headerBg: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
    headerText: '#FFFFFF',
    accent: '#818CF8',
    tagline: 'Refrigerator, washing machine & microwave care',
    iconName: 'Tv',
  },
  painting: {
    id: 'painting',
    name: 'Painting',
    nameHi: 'पेंटिंग',
    primary: '#7C3AED',
    primaryDark: '#6D28D9',
    primaryLight: '#F5F3FF',
    primaryBorder: '#DDD6FE',
    headerBg: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    headerText: '#FFFFFF',
    accent: '#A78BFA',
    tagline: 'Interior & exterior painting, water-proofing & touchups',
    iconName: 'Paintbrush',
  },
  pest_control: {
    id: 'pest_control',
    name: 'Pest Control',
    nameHi: 'पेस्ट कंट्रोल',
    primary: '#65A30D',
    primaryDark: '#4D7C0F',
    primaryLight: '#F7FEE7',
    primaryBorder: '#D9F99D',
    headerBg: 'linear-gradient(135deg, #65A30D 0%, #4D7C0F 100%)',
    headerText: '#FFFFFF',
    accent: '#84CC16',
    tagline: 'Odorless pest management & termite protection',
    iconName: 'ShieldAlert',
  },
};

export const getCategoryTheme = (categoryId: string): CategoryTheme => {
  const key = categoryId.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  return CATEGORY_THEMES[key] || CATEGORY_THEMES.all;
};
