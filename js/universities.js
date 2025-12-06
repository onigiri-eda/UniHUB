// Static university data for all 4 universities
const universities = {
  iitu: {
    id: 'iitu',
    name: 'International IT University',
    shortName: 'IITU',
    city: 'Алматы',
    description: 'Ведущий университет в области информационных технологий и бизнеса в Казахстане.',
    mission: 'Миссия IITU - формирование компетенций в области цифровой экономики и общества.',
    history: 'Основан в 2009 году. За 16 лет стал одним из ведущих университетов Казахстана в области информационных технологий и бизнеса.',
    achievements: 'Партнёры: IBM, Cisco, ORACLE, ITU, BOLASHAK, Microsoft, Unicef, ERICSSON.',
    programs: {
      bachelor: ['Information Security', 'Information Technology', 'Mathematical and computer modeling', 'Management'],
      master: ['MBA', 'IT Project Management', 'Artificial intelligence', 'Data Science']
    },
    tuition: {
      bachelor: '1,410,000 - 1,590,000 KZT/year',
      master: '1,890,000 KZT/year'
    },
    admission: {
      documents: [
        '1. Удостоверение личности (для идентификации)',
        '2. Заявление о приеме',
        '3. Медицинская справка формы №075 с флюорографией, действительная 1 год',
        '4. IELTS (при наличии) или результат теста по английскому языку',
        '5. Фотография 3×4 (6 штук)',
        '6. Аттестат с приложением или диплом об образовании',
        '7. Сертификат ЕНТ (электронная версия)',
        '8. Сертификат государственного гранта (при наличии)',
        '9. Копия аттестата об образовании (при наличии)',
        '10. Карта профилактических прививок (форма 063/U)'
      ],
      deadline: '1 Июля по 25 Августа',
      scholarships: 'Merit-based стипендии, корпоративные партнёрства, программы рассрочки'
    },
    international: {
      exchanges: ['USA', 'Europe', 'South Korea', 'Australia', 'China'],
      duration: '1-2 семестра',
      popularDestinations: 'США и Германия для обучения в технологических компаниях',
      opportunities: 'Программы обучения за границей, стажировки в ведущих компаниях'
    },
    keyStrengths: ['IT инновации', 'Международное сотрудничество', 'Высокий уровень трудоустройства'],
    matchScore: 0
  },

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
      master: ['Artificial Intelligence', 'Big Data Analytics', 'Machine Learning']
    },
    tuition: {
      bachelor: '2,200,000 - 2,400,000 KZT/year',
      master: '2,800,000 KZT/year'
    },
    admission: {
      documents: [
        '1. Удостоверение личности (для идентификации)',
        '2. Заявление о приеме',
        '3. Медицинская справка формы №075 с флюорографией, действительная 1 год',
        '4. IELTS (при наличии) или результат теста по английскому языку',
        '5. Фотография 3×4 (6 штук)',
        '6. Аттестат с приложением или диплом об образовании',
        '7. Сертификат ЕНТ (электронная версия)',
        '8. Сертификат государственного гранта (при наличии)',
        '9. Копия аттестата об образовании (при наличии)',
        '10. Карта профилактических прививок (форма 063/U)'
      ],
      deadline: '5 декабря 2025',
      scholarships: 'Merit-based стипендии, корпоративные партнёрства, программы рассрочки'
    },
    international: {
      exchanges: ['USA', 'Europe', 'South Korea', 'Japan', 'China'],
      duration: '1-2 семестра',
      popularDestinations: 'США, Южная Корея и Европа для обучения в технологических компаниях',
      opportunities: 'Программы обучения за границей, стажировки в ведущих компаниях'
    },
    keyStrengths: ['Международные проекты', 'Сотрудничество с ведущими компаниями', 'IT инновации'],
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
      bachelor: ['Информационные системы', 'Нефтегазовое дело', 'Кибербезопасность', 'Горное дело'],
      master: ['Управление проектами', 'Искусственный интеллект', 'Энергетика']
    },
    tuition: {
      bachelor: '1,750,000 - 2,100,000 KZT/year',
      master: '2,450,000 KZT/year'
    },
    admission: {
      documents: [
        '1. Удостоверение личности (для идентификации)',
        '2. Заявление о приеме',
        '3. Медицинская справка формы №075 с флюорографией, действительная 1 год',
        '4. IELTS (при наличии) или результат теста по английскому языку',
        '5. Фотография 3×4 (6 штук)',
        '6. Аттестат с приложением или диплом об образовании',
        '7. Сертификат ЕНТ (электронная версия)',
        '8. Сертификат государственного гранта (при наличии)',
        '9. Копия аттестата об образовании (при наличии)',
        '10. Карта профилактических прививок (форма 063/U)'
      ],
      deadline: '20 июля 2025',
      scholarships: 'Merit-based стипендии, корпоративные партнёрства, программы рассрочки'
    },
    international: {
      exchanges: ['UK', 'USA', 'Europe', 'Australia', 'China'],
      duration: '1-2 семестра',
      popularDestinations: 'Великобритания, США и Австралия для обучения в ведущих технических вузах',
      opportunities: 'Программы обучения за границей, стажировки в крупных компаниях'
    },
    keyStrengths: ['Сильная инженерная база', 'Международные аккредитации', 'Партнёрства с Shell и Chevron'],
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
      master: ['Управление проектами', 'Цифровой маркетинг', 'Финансовый менеджмент', 'MBA']
    },
    tuition: {
      bachelor: '1,500,000 - 1,800,000 KZT/year',
      master: '2,100,000 KZT/year'
    },
    admission: {
      documents: [
        '1. Удостоверение личности (для идентификации)',
        '2. Заявление о приеме',
        '3. Медицинская справка формы №075 с флюорографией, действительная 1 год',
        '4. IELTS (при наличии) или результат теста по английскому языку',
        '5. Фотография 3×4 (6 штук)',
        '6. Аттестат с приложением или диплом об образовании',
        '7. Сертификат ЕНТ (электронная версия)',
        '8. Сертификат государственного гранта (при наличии)',
        '9. Копия аттестата об образовании (при наличии)',
        '10. Карта профилактических прививок (форма 063/U)'
      ],
      deadline: '15 июля 2025',
      scholarships: 'Merit-based стипендии, корпоративные партнёрства, программы рассрочки'
    },
    international: {
      exchanges: ['USA', 'Europe', 'Canada', 'Australia', 'Singapore'],
      duration: '1-2 семестра',
      popularDestinations: 'США, Канада и Европа для обучения в бизнес-школах',
      opportunities: 'Программы обучения за границей, стажировки в консалтинговых компаниях'
    },
    keyStrengths: ['Международные аккредитации', 'Сотрудничество с ведущими университетами', 'Партнёрства с KPMG и Deloitte'],
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
