import { ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    nameHi: 'इलेक्ट्रीशियन',
    category: 'Electrical',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
    description: 'Wiring, MCB tripping, fan, switches, inverter & short-circuit repair',
    descriptionHi: 'वायरिंग, एमसीबी, पंखा, स्विच, इन्वर्टर और शॉर्ट सर्किट मरम्मत',
    basePrice: 199,
    popular: true,
    skills: ['Electrical Wiring', 'Fan Installation', 'Switch Installation', 'Fault Repair', 'Safety Inspection', 'MCB Diagnostics']
  },
  {
    id: 'ac_repair',
    name: 'AC Repair & Service',
    nameHi: 'एसी रिपेयर एवं सर्विस',
    category: 'Cooling & HVAC',
    icon: 'Snowflake',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    description: 'Cooling issues, jet foam wash, gas refill, PCB & compressor diagnostics',
    descriptionHi: 'कूलिंग समस्या, जेट वॉश, गैस रीफिल, पीसीबी और कंप्रेसर मरम्मत',
    basePrice: 449,
    popular: true,
    skills: ['AC Installation', 'AC Servicing', 'Gas Refill', 'Cooling Problem', 'Compressor Issue', 'Jet Wash']
  },
  {
    id: 'plumber',
    name: 'Plumber',
    nameHi: 'प्लंबर',
    category: 'Plumbing',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80',
    description: 'Leakage fixes, tap replacement, pipe fittings, motor & drainage blockage',
    descriptionHi: 'लीकेज समाधान, नल बदलना, पाइप फिटिंग, मोटर और ड्रेनेज ब्लॉकेज',
    basePrice: 199,
    popular: true,
    skills: ['Pipe Leakage', 'Tap Repair', 'Drain Blockage', 'Water Motor', 'Geyser Connection', 'Sanitary Fitting']
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    nameHi: 'बढ़ई / कारपेंटर',
    category: 'Woodwork & Furniture',
    icon: 'Hammer',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format&fit=crop&q=80',
    description: 'Door lock, hinge repair, furniture assembly, cupboard & wood polishing',
    descriptionHi: 'डोर लॉक, कब्जा रिपेयर, फर्नीचर असेंबली, अलमारी एवं पॉलिश',
    basePrice: 249,
    popular: false,
    skills: ['Door Repair', 'Lock Fitting', 'Furniture Assembly', 'Hinge Adjustment', 'Wood Polishing', 'Custom Shelf']
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    nameHi: 'उपकरण मरम्मत',
    category: 'Home Appliances',
    icon: 'Tv',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&auto=format&fit=crop&q=80',
    description: 'Washing machine, refrigerator, microwave, water purifier servicing',
    descriptionHi: 'वाशिंग मशीन, फ्रिज, माइक्रोवेव, वॉटर प्यूरीफायर रिपेयर',
    basePrice: 299,
    popular: true,
    skills: ['Refrigerator Repair', 'Washing Machine Repair', 'RO Servicing', 'Microwave Repair', 'Geyser Repair']
  },
  {
    id: 'painter',
    name: 'Painter',
    nameHi: 'पेंटर',
    category: 'Wall & Home Care',
    icon: 'Paintbrush',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80',
    description: 'Wall touch-ups, moisture damp proofing, interior & exterior painting',
    descriptionHi: 'वॉल टच-अप, सीलन समाधान, इंटीरियर एवं एक्सटीरियर पेंटिंग',
    basePrice: 499,
    popular: false,
    skills: ['Wall Touchup', 'Waterproofing', 'Emulsion Painting', 'Enamel Paint', 'Distemper', 'Texture Painting']
  },
  {
    id: 'cleaner',
    name: 'Deep Cleaning',
    nameHi: 'डीप क्लीनिंग',
    category: 'Sanitization',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80',
    description: 'Bathroom deep clean, kitchen degreasing, sofa & mattress shampooing',
    descriptionHi: 'बाथरूम डीप क्लीन, किचन डीग्रीसिंग, सोफा एवं मैट्रेस शैम्पू',
    basePrice: 399,
    popular: false,
    skills: ['Bathroom Cleaning', 'Kitchen Degreasing', 'Sofa Shampoo', 'Balcony Cleaning', 'Floor Scrubbing']
  },
  {
    id: 'mason',
    name: 'Mason / Civil Work',
    nameHi: 'राजमिस्त्री / सिविल वर्क',
    category: 'Construction',
    icon: 'ShieldAlert',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80',
    description: 'Tile replacement, wall plaster, crack fixing & minor civil alterations',
    descriptionHi: 'टाइल बदलना, दीवार प्लास्टर, दरारें भरना और छोटे सिविल कार्य',
    basePrice: 399,
    popular: false,
    skills: ['Tile Fitting', 'Plastering', 'Grouting', 'Brick Work', 'Crack Sealing']
  }
];
