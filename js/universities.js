// Static university data for all 4 universities
const universities = {
  aitu: {
    id: 'aitu',
    name: 'Astana IT University',
    shortName: 'AITU',
    city: 'Астана',
    description: 'Ведущий университет в области информационных технологий в Казахстане.',
    mission: 'Подготовка высококвалифицированных кадров и коммерциализация исследований для сферы ИКТ как драйверов развития Казахстана.',
    history: 'Основан в 2019 году. Университет быстро стал ведущим образовательным и исследовательским центром.',
    achievements: 'Активное участие в международных проектах, включая Erasmus+, и сотрудничество с ведущими университетами и компаниями мира.',
    programs: {
      bachelor: ['Computer Science', 'Software Engineering', 'Cybersecurity', 'Data Science'],
      master: []
    },
    tuition: {
      bachelor: 'Не указано',
      master: 'Не указано'
    },
    admission: {
      documents: ['Необходимые документы уточняются'],
      deadline: '5 декабря 2025',
      scholarships: 'Не указано'
    },
    international: {
      exchanges: [],
      duration: '',
      popularDestinations: '',
      opportunities: ''
    },
    keyStrengths: ['Международные проекты', 'Сотрудничество с ведущими компаниями'],
    matchScore: 0
  },

  kbtu: {
    id: 'kbtu',
    name: 'Казахстанско-Британский технический университет',
    shortName: 'KBTU',
    city: 'Алматы',
    description: 'Лучший технический вуз Казахстана с международными аккредитациями.',
    mission: 'Подготовка высококвалифицированных специалистов в области инженерии, IT и бизнеса.',
    history: 'Основан в 2001 году. Ведущий образовательный и исследовательский центр.',
    achievements: 'ТОП-400 QS World Rankings, аккредитация ABET и EUR-ACE.',
    programs: {
      bachelor: ['Информационные системы', 'Нефтегазовое дело'],
      master: []
    },
    tuition: {
      bachelor: '1,200,000 - 2,000,000 KZT/year',
      master: '1,800,000 - 3,000,000 KZT/year'
    },
    admission: {
      documents: ['Необходимые документы уточняются'],
      deadline: '20 июля 2025',
      scholarships: 'Не указано'
    },
    international: {
      exchanges: [],
      duration: '',
      popularDestinations: '',
      opportunities: ''
    },
    keyStrengths: ['Сильная инженерная база', 'Международные аккредитации'],
    matchScore: 0
  },

  uib: {
    id: 'uib',
    name: 'Университет Международного Бизнеса',
    shortName: 'UIB',
    city: 'Алматы',
    description: 'Ведущий университет в области бизнеса и управления.',
    mission: 'Подготовка лидеров в области бизнеса, экономики и управления.',
    history: 'Основан в 1992 году. Ведущий вуз в области бизнеса и управления.',
    achievements: 'Топ-10 университетов Казахстана, международные аккредитации.',
    programs: {
      bachelor: ['Бизнес-администрирование', 'Финансы', 'Маркетинг', 'Информационные технологии'],
      master: ['Управление проектами']
    },
    tuition: {
      bachelor: '1,410,000 - 1,590,000 KZT/year',
      master: '1,890,000 KZT/year'
    },
    admission: {
      documents: ['Необходимые документы уточняются'],
      deadline: '15 июля 2025',
      scholarships: 'Не указано'
    },
    international: {
      exchanges: [],
      duration: '',
      popularDestinations: '',
      opportunities: ''
    },
    keyStrengths: ['Международные аккредитации', 'Сотрудничество с ведущими университетами'],
    matchScore: 0
  }
};

// Helper function to get university by ID
function getUniversityById(id) {
  return universities[id.toLowerCase()];
}

// Get all universities list
function getAllUniversities() {
  return Object.values(universities);
}

// Get best match based on survey answers
function getBestMatch(answers) {
  // Simple matching logic - in real scenario, this would be more sophisticated
  const specialization = answers.specialization || '';
  const city = answers.city || '';
  const international = answers.international || '';
  const budget = answers.budget || '';
  const priority = answers.priority || '';

  // Matching rules based on inputs
  let scores = {
    aitu: 0,
    kbtu: 0,
    uib: 0
  };

  // IT/Tech specializations → AITU
  if (specialization.includes('IT') || specialization.includes('Programming') || specialization.includes('Data')) {
    scores.aitu += 30;
  }

  // Engineering specializations → KBTU
  if (specialization.includes('Engineer') || specialization.includes('Construction') || specialization.includes('Architecture')) {
    scores.kbtu += 30;
  }

  // Business specializations → UIB
  if (specialization.includes('Business') || specialization.includes('Management') || specialization.includes('Economics')) {
    scores.uib += 35;
  }

  // City preferences
  if (city === 'Астана') scores.aitu += 25;
  if (city === 'Алматы') {
    scores.kbtu += 20;
    scores.uib += 20;
  }

  // International importance
  if (international === 'High') {
    scores.aitu += 15;
    scores.kbtu += 10;
  }

  // Budget considerations
  if (budget === 'Low') {
    scores.kbtu += 15;
  }
  if (budget === 'High') {
    scores.aitu += 20;
  }

  // Priority factors
  if (priority === 'Quality') {
    scores.kbtu += 15;
  }
  if (priority === 'Reputation') {
    scores.kbtu += 20;
    scores.uib += 15;
  }
  if (priority === 'Innovation') {
    scores.aitu += 25;
  }

  // Find the university with highest score
  let bestMatch = 'aitu';
  let maxScore = scores.aitu;

  for (let uni in scores) {
    if (scores[uni] > maxScore) {
      maxScore = scores[uni];
      bestMatch = uni;
    }
  }

  return bestMatch;
}
