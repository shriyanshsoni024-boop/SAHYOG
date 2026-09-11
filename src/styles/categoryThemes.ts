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

const PRONTO_CATEGORY_THEME_BASE = {
  primary: '#1DAA5C',
  primaryDark: '#0F7A3E',
  primaryLight: '#F0FDF4',
  primaryBorder: '#D9E9C8',
  headerBg: 'linear-gradient(135deg, #1DAA5C 0%, #0F7A3E 100%)',
  headerText: '#FFFFFF',
  accent: '#F4C430',
};

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  all: {
    id: 'all',
    name: 'All Services',
    nameHi: 'सभी सेवाएं',
    ...PRONTO_CATEGORY_THEME_BASE,
    tagline: 'One professional, multiple home services',
    iconName: 'LayoutGrid',
  },
  cleaning: {
    id: 'cleaning',
    name: 'Cleaning',
    nameHi: 'सफाई सेवा',
    ...PRONTO_CATEGORY_THEME_BASE,
    tagline: 'Spotless deep cleaning with eco-friendly sanitizers',
    iconName: 'Sparkles',
  },
  electrician: {
    id: 'electrician',
    name: 'Electrician',
    nameHi: 'इलेक्ट्रीशियन',
    ...PRONTO_CATEGORY_THEME_BASE,
    tagline: 'Certified electricians for wiring, MCB & appliances',
    iconName: 'Zap',
  },
  plumbing: {
    id: 'plumbing',
    name: 'Plumbing',
    nameHi: 'प्लंबिंग',
    ...PRONTO_CATEGORY_THEME_BASE,
    tagline: 'Leak-proof plumbing, fittings & drainage care',
    iconName: 'Wrench',
  },
  ac: {
    id: 'ac',
    name: 'AC Repair',
    nameHi: 'एसी रिपेयर',
    ...PRONTO_CATEGORY_THEME_BASE,
    tagline: 'Jet foam servicing, gas refill & cooling fixes',
    iconName: 'Snowflake',
  },
  carpentry: {
    id: 'carpentry',
    name: 'Carpentry',
    nameHi: 'कारपेंटर',
    ...PRONTO_CATEGORY_THEME_BASE,
    tagline: 'Furniture assembly, lock repair & woodwork polish',
    iconName: 'Hammer',
  },
  appliance: {
    id: 'appliance',
    name: 'Appliance Repair',
    nameHi: 'उपकरण मरम्मत',
    ...PRONTO_CATEGORY_THEME_BASE,
    tagline: 'Refrigerator, washing machine & microwave care',
    iconName: 'Tv',
  },
  painting: {
    id: 'painting',
    name: 'Painting',
    nameHi: 'पेंटिंग',
    ...PRONTO_CATEGORY_THEME_BASE,
    tagline: 'Interior & exterior painting, water-proofing & touchups',
    iconName: 'Paintbrush',
  },
  pest_control: {
    id: 'pest_control',
    name: 'Pest Control',
    nameHi: 'पेस्ट कंट्रोल',
    ...PRONTO_CATEGORY_THEME_BASE,
    tagline: 'Odorless pest management & termite protection',
    iconName: 'ShieldAlert',
  },
};

export const getCategoryTheme = (categoryId: string): CategoryTheme => {
  const key = categoryId.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  return CATEGORY_THEMES[key] || CATEGORY_THEMES.all;
};
