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

const PRONTO_WORKER_THEME_BASE = {
  primary: '#1DAA5C',
  primaryDark: '#0F7A3E',
  primaryLight: '#F0FDF4',
  primaryBorder: '#D9E9C8',
  headerBg: 'linear-gradient(135deg, #0F7A3E 0%, #1DAA5C 100%)',
  accent: '#F4C430',
};

export const WORKER_THEMES: Record<string, WorkerTheme> = {
  electrician: {
    id: 'electrician',
    name: 'Electrician Pro',
    nameHi: 'इलेक्ट्रीशियन प्रो',
    ...PRONTO_WORKER_THEME_BASE,
    tagline: 'Certified Power & Wiring Artisan',
    taglineHi: 'प्रमाणित विद्युत व वायरिंग कारीगर',
  },
  plumbing: {
    id: 'plumbing',
    name: 'Plumbing Specialist',
    nameHi: 'प्लंबिंग विशेषज्ञ',
    ...PRONTO_WORKER_THEME_BASE,
    tagline: 'Precision Fittings & Pipeline Artisan',
    taglineHi: 'सटीक फिटिंग व पाइपलाइन कारीगर',
  },
  ac: {
    id: 'ac',
    name: 'HVAC & AC Master',
    nameHi: 'एसी व एचवीएसी मास्टर',
    ...PRONTO_WORKER_THEME_BASE,
    tagline: 'Cooling Systems & Jet Wash Specialist',
    taglineHi: 'कूलिंग सिस्टम व जेट सर्विस विशेषज्ञ',
  },
  carpentry: {
    id: 'carpentry',
    name: 'Master Carpenter',
    nameHi: 'मास्टर कारपेंटर',
    ...PRONTO_WORKER_THEME_BASE,
    tagline: 'Woodcraft & Custom Furniture Artisan',
    taglineHi: 'काष्ठकला व फर्नीचर कारीगर',
  },
  appliance: {
    id: 'appliance',
    name: 'Appliance Technician',
    nameHi: 'उपकरण तकनीशियन',
    ...PRONTO_WORKER_THEME_BASE,
    tagline: 'Multi-Brand Diagnostics & Repair Pro',
    taglineHi: 'मल्टी-ब्रांड रिपेयर व डायग्नोस्टिक्स',
  },
  cleaning: {
    id: 'cleaning',
    name: 'Deep Cleaning Specialist',
    nameHi: 'सफाई विशेषज्ञ',
    ...PRONTO_WORKER_THEME_BASE,
    tagline: 'Sanitization & Deep Cleaning Pro',
    taglineHi: 'गहन स्वच्छता व सैनिटाइजेशन',
  },
  painting: {
    id: 'painting',
    name: 'Finishing & Painter',
    nameHi: 'पेंटिंग कारीगर',
    ...PRONTO_WORKER_THEME_BASE,
    tagline: 'Waterproofing & Decorative Finishing',
    taglineHi: 'वॉटरप्रूफिंग व फिनिशिंग कारीगर',
  },
  pest_control: {
    id: 'pest_control',
    name: 'Pest Control Expert',
    nameHi: 'कीट नियंत्रण विशेषज्ञ',
    ...PRONTO_WORKER_THEME_BASE,
    tagline: 'Odorless Herbal Pest Management',
    taglineHi: 'गंधहीन हर्बल कीट प्रबंधन',
  },
  default: {
    id: 'default',
    name: 'Cooperative Artisan Pro',
    nameHi: 'सहकारी कारीगर प्रो',
    ...PRONTO_WORKER_THEME_BASE,
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
