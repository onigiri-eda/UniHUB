// Main JavaScript file for survey logic, animations, and page navigation

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  setupScrollAnimations();
});

// Setup all event listeners
function setupEventListeners() {
  const startSurveyBtn = document.getElementById('startSurveyBtn');
  const showResultsBtn = document.getElementById('showResultsBtn');

  if (startSurveyBtn) {
    startSurveyBtn.addEventListener('click', scrollToSurvey);
  }

  if (showResultsBtn) {
    showResultsBtn.addEventListener('click', handleSurveySubmission);
  }

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // Close mobile menu when link is clicked
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navMenu) {
        navMenu.classList.remove('active');
        if (mobileMenuToggle) {
          mobileMenuToggle.classList.remove('active');
        }
      }
    });
  });
}

// Smooth scroll to survey section
function scrollToSurvey() {
  const surveySection = document.getElementById('surveySection');
  if (surveySection) {
    surveySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Set focus to first form element
    setTimeout(() => {
      const firstInput = surveySection.querySelector('select');
      if (firstInput) {
        firstInput.focus();
      }
    }, 800);
  }
}

// Handle survey submission and show best match
function handleSurveySubmission() {
  // Get form data
  const surveyForm = document.getElementById('surveyForm');
  if (!surveyForm) return;

  const formData = new FormData(surveyForm);
  const answers = {
    specialization: formData.get('specialization'),
    city: formData.get('city'),
    international: formData.get('international'),
    budget: formData.get('budget'),
    priority: formData.get('priority')
  };

  // Validate that all fields are filled
  for (let field in answers) {
    if (!answers[field]) {
      alert('Пожалуйста, заполните все поля опроса');
      return;
    }
  }

  // Get best match
  const bestMatchId = getBestMatch(answers);
  const bestMatchUni = getUniversityById(bestMatchId);

  if (bestMatchUni) {
    displayBestMatch(bestMatchUni);
    smoothScrollToResults();
  }
}

// Display best match results
function displayBestMatch(university) {
  let resultsContainer = document.getElementById('resultsContainer');

  // Create container if it doesn't exist
  if (!resultsContainer) {
    const surveySection = document.getElementById('surveySection');
    if (surveySection) {
      resultsContainer = document.createElement('div');
      resultsContainer.id = 'resultsContainer';
      resultsContainer.className = 'best-match-container';
      surveySection.parentNode.insertBefore(resultsContainer, surveySection.nextSibling);
    } else {
      return;
    }
  }

  // Clear previous results
  resultsContainer.innerHTML = '';

  // Create best match HTML
  const matchPercentage = Math.floor(Math.random() * (98 - 75) + 75); // Random 75-98%

  const resultsHTML = `
    <div class="best-match-result fade-in">
      <div class="result-header">
        <h2>🎯 Ваш лучший вариант</h2>
      </div>
      <div class="result-content">
        <h3>${university.shortName}</h3>
        <p class="result-description">${university.description}</p>
        
        <div class="match-score">
          <div class="score-label">Совпадение с вашими критериями:</div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${matchPercentage}%"></div>
          </div>
          <div class="score-value">${matchPercentage}%</div>
        </div>

        <div class="key-strengths">
          <h4>Ключевые преимущества:</h4>
          <ul>
            ${university.keyStrengths.map(strength => `<li>✓ ${strength}</li>`).join('')}
          </ul>
        </div>

        <div class="result-actions">
          <a href="${university.id}.html" class="btn btn-primary">Подробнее</a>
          <button class="btn btn-secondary" onclick="resetSurvey()">Пройти заново</button>
        </div>
      </div>
    </div>
  `;

  resultsContainer.innerHTML = resultsHTML;
  resultsContainer.style.display = 'block';

  // Trigger animation
  setTimeout(() => {
    const resultElement = resultsContainer.querySelector('.best-match-result');
    if (resultElement) {
      resultElement.classList.add('show');
    }
  }, 10);
}

// Smooth scroll to results
function smoothScrollToResults() {
  setTimeout(() => {
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 200);
}

// Reset survey
function resetSurvey() {
  const surveyForm = document.getElementById('surveyForm');
  if (surveyForm) {
    surveyForm.reset();
  }

  const resultsContainer = document.getElementById('resultsContainer');
  if (resultsContainer) {
    resultsContainer.style.display = 'none';
  }

  scrollToSurvey();
}

// Setup animations on scroll
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elements = document.querySelectorAll('.section, .program-card, .info-block');
  elements.forEach(el => observer.observe(el));
}

// Navigate to university page
function navigateToUniversity(universityId) {
  window.location.href = `${universityId}.html`;
}

// Get current university ID from URL or page
function getCurrentUniversityId() {
  const path = window.location.pathname;
  const matches = path.match(/\/([a-z]+)\.html/);
  return matches ? matches[1] : null;
}

// Initialize university page specific features
function initUniversityPage() {
  const uniId = getCurrentUniversityId();
  if (!uniId) return;

  const university = getUniversityById(uniId);
  if (university) {
    // Populate page with university data
    populateUniversityPage(university);
    setupScrollAnimations();
  }
}

// Populate university page with data
function populateUniversityPage(university) {
  // Update page title
  document.title = `${university.name} | Выбор Университета`;

  // Update hero/header section
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');

  if (heroTitle) heroTitle.textContent = university.shortName;
  if (heroSubtitle) heroSubtitle.textContent = university.city;

  // Update About section
  const aboutMission = document.getElementById('aboutMission');
  const aboutHistory = document.getElementById('aboutHistory');
  const aboutAchievements = document.getElementById('aboutAchievements');

  if (aboutMission) aboutMission.textContent = university.mission;
  if (aboutHistory) aboutHistory.textContent = university.history;
  if (aboutAchievements) aboutAchievements.textContent = university.achievements;

  // Update Programs section
  const bachelorPrograms = document.getElementById('bachelorPrograms');
  const masterPrograms = document.getElementById('masterPrograms');

  if (bachelorPrograms) {
    bachelorPrograms.innerHTML = university.programs.bachelor
      .map(prog => `<li>${prog}</li>`)
      .join('');
  }

  if (masterPrograms) {
    masterPrograms.innerHTML = university.programs.master
      .map(prog => `<li>${prog}</li>`)
      .join('');
  }

  // Update Admission section
  const admissionDocs = document.getElementById('admissionDocs');
  const admissionDeadline = document.getElementById('admissionDeadline');
  const admissionScholarships = document.getElementById('admissionScholarships');
  const tuitionBachelor = document.getElementById('tuitionBachelor');
  const tuitionMaster = document.getElementById('tuitionMaster');

  if (admissionDocs) {
    admissionDocs.innerHTML = university.admission.documents
      .map(doc => `<li>${doc}</li>`)
      .join('');
  }
  if (admissionDeadline) admissionDeadline.textContent = university.admission.deadline;
  if (admissionScholarships) admissionScholarships.textContent = university.admission.scholarships;
  if (tuitionBachelor) tuitionBachelor.textContent = university.tuition.bachelor;
  if (tuitionMaster) tuitionMaster.textContent = university.tuition.master;

  // Update International section
  const intlExchanges = document.getElementById('intlExchanges');
  const intlDuration = document.getElementById('intlDuration');
  const intlDestinations = document.getElementById('intlDestinations');
  const intlOpportunities = document.getElementById('intlOpportunities');

  if (intlExchanges) {
    intlExchanges.innerHTML = university.international.exchanges
      .map(country => `<span class="tag">${country}</span>`)
      .join('');
  }
  if (intlDuration) intlDuration.textContent = university.international.duration;
  if (intlDestinations) intlDestinations.textContent = university.international.popularDestinations;
  if (intlOpportunities) intlOpportunities.textContent = university.international.opportunities;
}

// Call initUniversityPage on university pages
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUniversityPage);
} else {
  initUniversityPage();
}
