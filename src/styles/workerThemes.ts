export interface WorkerTheme {
  id: string;
  name: string;
  nameHi: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryBorder: string;
  headerBg: string;
  accent: string;
  tagline: string;
  taglineHi: string;
}

export const WORKER_THEMES: Record<string, WorkerTheme> = {
  electrician: {
    id: 'electrician',
    name: 'Electrician Pro',
    nameHi: 'इलेक्ट्रीशियन प्रो',
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primaryLight: '#EFF6FF',
    primaryBorder: '#BFDBFE',
    headerBg: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
    accent: '#60A5FA',
    tagline: 'Certified Power & Wiring Artisan',
    taglineHi: 'प्रमाणित विद्युत व वायरिंग कारीगर',
  },
  plumbing: {
    id: 'plumbing',
    name: 'Plumbing Specialist',
    nameHi: 'प्लंबिंग विशेषज्ञ',
    primary: '#0D9488',
    primaryDark: '#0F766E',
    primaryLight: '#F0FDFA',
    primaryBorder: '#99F6E4',
    headerBg: 'linear-gradient(135deg, #115E59 0%, #0D9488 100%)',
    accent: '#14B8A6',
    tagline: 'Precision Fittings & Pipeline Artisan',
    taglineHi: 'सटीक फिटिंग व पाइपलाइन कारीगर',
  },
  ac: {
    id: 'ac',
    name: 'HVAC & AC Master',
    nameHi: 'एसी व एचवीएसी मास्टर',
    primary: '#0284C7',
    primaryDark: '#0369A1',
    primaryLight: '#F0F9FF',
    primaryBorder: '#BAE6FD',
    headerBg: 'linear-gradient(135deg, #075985 0%, #0284C7 100%)',
    accent: '#38BDF8',
    tagline: 'Cooling Systems & Jet Wash Specialist',
    taglineHi: 'कूलिंग सिस्टम व जेट सर्विस विशेषज्ञ',
  },
  carpentry: {
    id: 'carpentry',
    name: 'Master Carpenter',
    nameHi: 'मास्टर कारपेंटर',
    primary: '#D97706',
    primaryDark: '#B45309',
    primaryLight: '#FFFBEB',
    primaryBorder: '#FDE68A',
    headerBg: 'linear-gradient(135deg, #92400E 0%, #D97706 100%)',
    accent: '#F59E0B',
    tagline: 'Woodcraft & Custom Furniture Artisan',
    taglineHi: 'काष्ठकला व फर्नीचर कारीगर',
  },
  appliance: {
    id: 'appliance',
    name: 'Appliance Technician',
    nameHi: 'उपकरण तकनीशियन',
    primary: '#4F46E5',
    primaryDark: '#4338CA',
    primaryLight: '#EEF2FF',
    primaryBorder: '#C7D2FE',
    headerBg: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 100%)',
    accent: '#818CF8',
    tagline: 'Multi-Brand Diagnostics & Repair Pro',
    taglineHi: 'मल्टी-ब्रांड रिपेयर व डायग्नोस्टिक्स',
  },
  cleaning: {
    id: 'cleaning',
    name: 'Deep Cleaning Specialist',
    nameHi: 'सफाई विशेषज्ञ',
    primary: '#059669',
    primaryDark: '#047857',
    primaryLight: '#ECFDF5',
    primaryBorder: '#A7F3D0',
    headerBg: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
    accent: '#10B981',
    tagline: 'Sanitization & Deep Cleaning Pro',
    taglineHi: 'गहन स्वच्छता व सैनिटाइजेशन',
  },
  painting: {
    id: 'painting',
    name: 'Finishing & Painter',
    nameHi: 'पेंटिंग कारीगर',
    primary: '#7C3AED',
    primaryDark: '#6D28D9',
    primaryLight: '#F5F3FF',
    primaryBorder: '#DDD6FE',
    headerBg: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
    accent: '#A78BFA',
    tagline: 'Waterproofing & Decorative Finishing',
    taglineHi: 'वॉटरप्रूफिंग व फिनिशिंग कारीगर',
  },
  pest_control: {
    id: 'pest_control',
    name: 'Pest Control Expert',
    nameHi: 'कीट नियंत्रण विशेषज्ञ',
    primary: '#65A30D',
    primaryDark: '#4D7C0F',
    primaryLight: '#F7FEE7',
    primaryBorder: '#D9F99D',
    headerBg: 'linear-gradient(135deg, #3F6212 0%, #65A30D 100%)',
    accent: '#84CC16',
    tagline: 'Odorless Herbal Pest Management',
    taglineHi: 'गंधहीन हर्बल कीट प्रबंधन',
  },
  default: {
    id: 'default',
    name: 'Cooperative Artisan Pro',
    nameHi: 'सहकारी कारीगर प्रो',
    primary: '#0C831F',
    primaryDark: '#086317',
    primaryLight: '#F0FDF4',
    primaryBorder: '#BBF7D0',
    headerBg: 'linear-gradient(135deg, #086317 0%, #0C831F 100%)',
    accent: '#22C55E',
    tagline: 'Verified Guild Member • 0% Commission',
    taglineHi: 'सत्यापित गिल्ड सदस्य • 0% कमीशन',
  },
};

export function getWorkerTheme(professions: string[] = []): WorkerTheme {
  if (!professions || professions.length === 0) return WORKER_THEMES.default;

  const tradeStr = professions.join(' ').toLowerCase();

  if (tradeStr.includes('electric') || tradeStr.includes('wiring') || tradeStr.includes('mcb')) {
    return WORKER_THEMES.electrician;
  }
  if (tradeStr.includes('plumb') || tradeStr.includes('pipe') || tradeStr.includes('water')) {
    return WORKER_THEMES.plumbing;
  }
  if (tradeStr.includes('ac') || tradeStr.includes('hvac') || tradeStr.includes('cool')) {
    return WORKER_THEMES.ac;
  }
  if (tradeStr.includes('carpent') || tradeStr.includes('wood') || tradeStr.includes('furnitur')) {
    return WORKER_THEMES.carpentry;
  }
  if (tradeStr.includes('appliance') || tradeStr.includes('tv') || tradeStr.includes('fridge') || tradeStr.includes('ro')) {
    return WORKER_THEMES.appliance;
  }
  if (tradeStr.includes('clean') || tradeStr.includes('wash') || tradeStr.includes('sofa')) {
    return WORKER_THEMES.cleaning;
  }
  if (tradeStr.includes('paint') || tradeStr.includes('polish') || tradeStr.includes('waterproof')) {
    return WORKER_THEMES.painting;
  }
  if (tradeStr.includes('pest') || tradeStr.includes('termite')) {
    return WORKER_THEMES.pest_control;
  }

  return WORKER_THEMES.default;
}
