// AI Chat Assistant JavaScript with GROK Integration
// This file handles chat UI, open/close logic, GROK API and PostgreSQL database integration

// Configuration
const CHAT_CONFIG = {
  API_KEY: 'xai-Ks4nKK3ub7HLn7GEp8aGqo8IbYt1DHmqo0XChqKPN5fM2xZ3D2Q1K5HvNxQQY', // GROK API key
  API_URL: 'https://api.x.ai/v1/chat/completions',
  MODEL: 'grok-beta',
  BACKEND_URL: 'http://localhost:5000'
};

// Chat instance
let chatWindow = null;
let chatMessages = [];
let isLoading = false;
let databaseData = null;

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeChat();
  // Load database data asynchronously in background (non-blocking)
  setTimeout(() => loadDatabaseData(), 500);
});

// Initialize chat system
function initializeChat() {
  createChatWidget();
  setupChatEventListeners();
}

// Load database data from backend
async function loadDatabaseData() {
  try {
    console.log('Loading database data for chat context...');
    const startTime = performance.now();
    
    const response = await fetch(`${CHAT_CONFIG.BACKEND_URL}/api/all-data`);
    if (response.ok) {
      databaseData = await response.json();
      const loadTime = (performance.now() - startTime).toFixed(2);
      console.log(`✓ Database data loaded in ${loadTime}ms`);
    }
  } catch (error) {
    console.error('Error loading database data:', error);
    // Don't fail silently - warn but continue
    console.warn('Chat will work without database context');
  }
}

// Create chat widget HTML
function createChatWidget() {
  // Check if widget already exists
  if (document.getElementById('chatWidget')) {
    return;
  }

  const chatHTML = `
    <div id="chatWidget" class="chat-widget">
      <!-- Chat Toggle Button -->
      <button id="chatToggleBtn" class="chat-toggle-btn" title="AI Assistant">
        💬
      </button>

      <!-- Chat Window -->
      <div id="chatWindow" class="chat-window">
        <div class="chat-header">
          <h3>🤖 GROK - AI Assistant</h3>
          <button id="chatCloseBtn" class="chat-close-btn">✕</button>
        </div>

        <div id="chatBody" class="chat-body">
          <div class="chat-message bot-message">
            <div class="message-content">
              Привет! 👋 Я GROK - ваш AI ассистент. Я могу помочь вам узнать больше об университетах Казахстана. 
              <br><br>
              Я могу помочь с:
              <ul style="margin-top: 8px; margin-left: 20px;">
                <li>Информацией об университетах IITU, AITU, KBTU, UIB</li>
                <li>Академическими программами и специальностями</li>
                <li>Условиями поступления</li>
                <li>Международным сотрудничеством</li>
                <li>💡 Сравнением двух университетов (введите: "сравни IITU и KBTU")</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="chat-footer">
          <div class="chat-input-container">
            <input 
              type="text" 
              id="chatInput" 
              class="chat-input" 
              placeholder="Напишите свой вопрос..."
              autocomplete="off"
            >
            <button id="chatSendBtn" class="chat-send-btn">➤</button>
          </div>
          <div class="chat-disclaimer">
            <small>GROK AI ассистент с PostgreSQL интеграцией</small>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatHTML);
  chatWindow = document.getElementById('chatWindow');
}

// Setup chat event listeners
function setupChatEventListeners() {
  const toggleBtn = document.getElementById('chatToggleBtn');
  const closeBtn = document.getElementById('chatCloseBtn');
  const sendBtn = document.getElementById('chatSendBtn');
  const chatInput = document.getElementById('chatInput');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleChatWindow);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeChatWindow);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', sendChatMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }
}

// Toggle chat window visibility
function toggleChatWindow() {
  if (chatWindow) {
    chatWindow.classList.toggle('visible');

    // Focus input when window is opened
    if (chatWindow.classList.contains('visible')) {
      setTimeout(() => {
        const input = document.getElementById('chatInput');
        if (input) input.focus();
      }, 200);
    }
  }
}

// Close chat window
function closeChatWindow() {
  if (chatWindow) {
    chatWindow.classList.remove('visible');
  }
}

// Send chat message
function sendChatMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput ? chatInput.value.trim() : '';

  if (!message) return;
  if (isLoading) return;

  // Add user message to chat
  addChatMessage(message, 'user');
  chatInput.value = '';

  // Show typing indicator
  setLoadingState(true);

  // Check if user is asking for university comparison
  if (isComparisonRequest(message)) {
    handleUniversityComparison(message);
  } else {
    // Get AI response from GROK with database context
    getGROKResponse(message);
  }
}

// Add message to chat display
function addChatMessage(text, sender) {
  const chatBody = document.getElementById('chatBody');
  if (!chatBody) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}-message`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  // Use textContent to preserve newlines and formatting
  contentDiv.textContent = text;

  messageDiv.appendChild(contentDiv);
  chatBody.appendChild(messageDiv);

  // Auto-scroll to bottom
  chatBody.scrollTop = chatBody.scrollHeight;

  // Store in chat history
  chatMessages.push({
    role: sender === 'user' ? 'user' : 'assistant',
    content: text
  });
}

// Get university info from database
async function getUniversityInfoFromDatabase(universityName) {
  try {
    const response = await fetch(`${CHAT_CONFIG.BACKEND_URL}/api/universities`);
    if (!response.ok) return null;
    
    const universities = await response.json();
    const lowerName = universityName.toLowerCase();
    
    // Find matching university
    const uni = universities.find(u => 
      u.name.toLowerCase().includes(lowerName) || 
      u.name.toLowerCase().startsWith(lowerName)
    );
    
    if (!uni) return null;
    
    // Get full data for this university
    const uniResponse = await fetch(`${CHAT_CONFIG.BACKEND_URL}/api/universities/${uni.id}`);
    if (!uniResponse.ok) return null;
    
    return await uniResponse.json();
  } catch (error) {
    console.error('Error fetching university info:', error);
    return null;
  }
}

// Get all programs from all universities
async function getAllProgramsFromDatabase() {
  try {
    const response = await fetch(`${CHAT_CONFIG.BACKEND_URL}/api/programs`);
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching programs:', error);
    return null;
  }
}

// Generate response about academic programs
async function generateProgramsResponse(userMessage) {
  try {
    const programs = await getAllProgramsFromDatabase();
    if (!programs || programs.length === 0) return null;
    
    const universities = await (await fetch(`${CHAT_CONFIG.BACKEND_URL}/api/universities`)).json();
    
    let response = `📚 АКАДЕМИЧЕСКИЕ ПРОГРАММЫ\n`;
    response += `${'='.repeat(50)}\n\n`;
    
    // Group programs by university
    const programsByUni = {};
    programs.forEach(prog => {
      if (!programsByUni[prog.university_id]) {
        programsByUni[prog.university_id] = { bachelor: [], master: [] };
      }
      
      const level = prog.level?.toLowerCase();
      if (level === 'bachelor' || level === 'бакалавриат') {
        programsByUni[prog.university_id].bachelor.push(prog.name);
      } else if (level === 'master' || level === 'магистратура') {
        programsByUni[prog.university_id].master.push(prog.name);
      }
    });
    
    // Format response
    universities.forEach(uni => {
      response += `🏫 ${uni.name}\n`;
      
      if (programsByUni[uni.id]) {
        const progs = programsByUni[uni.id];
        
        if (progs.bachelor.length > 0) {
          response += `   Бакалавриат (${progs.bachelor.length}):\n`;
          progs.bachelor.slice(0, 4).forEach(p => {
            response += `      • ${p}\n`;
          });
          if (progs.bachelor.length > 4) {
            response += `      ... и ещё ${progs.bachelor.length - 4}\n`;
          }
        }
        
        if (progs.master.length > 0) {
          response += `   Магистратура (${progs.master.length}):\n`;
          progs.master.slice(0, 4).forEach(p => {
            response += `      • ${p}\n`;
          });
          if (progs.master.length > 4) {
            response += `      ... и ещё ${progs.master.length - 4}\n`;
          }
        }
      }
      
      response += `\n`;
    });
    
    response += `${'='.repeat(50)}\n`;
    response += `💡 Выберите интересующий вас университет для более подробной информации.`;
    
    return response;
  } catch (error) {
    console.error('Error generating programs response:', error);
    return null;
  }
}

// Format university info for display
function formatUniversityInfo(uniData) {
  if (!uniData) return null;
  
  let info = `📖 ${uniData.name}\n`;
  info += `${'='.repeat(50)}\n\n`;
  info += `📍 Город: ${uniData.city || 'N/A'}\n\n`;
  
  if (uniData.mission) {
    info += `🎯 Миссия:\n${uniData.mission}\n\n`;
  }
  
  if (uniData.history) {
    info += `📜 История:\n${uniData.history}\n\n`;
  }
  
  if (uniData.programs) {
    if (uniData.programs.bachelor && uniData.programs.bachelor.length > 0) {
      info += `📚 Программы бакалавриата (${uniData.programs.bachelor.length}):\n`;
      uniData.programs.bachelor.slice(0, 5).forEach(prog => {
        info += `   • ${prog}\n`;
      });
      if (uniData.programs.bachelor.length > 5) {
        info += `   ... и еще ${uniData.programs.bachelor.length - 5} программ\n`;
      }
      info += `\n`;
    }
    
    if (uniData.programs.master && uniData.programs.master.length > 0) {
      info += `📚 Программы магистратуры (${uniData.programs.master.length}):\n`;
      uniData.programs.master.slice(0, 5).forEach(prog => {
        info += `   • ${prog}\n`;
      });
      if (uniData.programs.master.length > 5) {
        info += `   ... и еще ${uniData.programs.master.length - 5} программ\n`;
      }
      info += `\n`;
    }
  }
  
  if (uniData.admission) {
    info += `💰 Стоимость обучения:\n`;
    if (uniData.admission.tuition) {
      info += `   Бакалавриат: ${uniData.admission.tuition.bachelor ? uniData.admission.tuition.bachelor.toLocaleString() + ' тг' : 'N/A'}\n`;
      info += `   Магистратура: ${uniData.admission.tuition.master ? uniData.admission.tuition.master.toLocaleString() + ' тг' : 'N/A'}\n`;
    }
    if (uniData.admission.scholarships) {
      info += `\n🎓 Стипендии:\n${uniData.admission.scholarships}\n`;
    }
    info += `\n`;
  }
  
  if (uniData.international) {
    info += `🌍 Международное сотрудничество:\n`;
    if (uniData.international.exchanges && Array.isArray(uniData.international.exchanges)) {
      info += `   Партнёры: ${uniData.international.exchanges.join(', ')}\n`;
    } else if (uniData.international.exchanges && typeof uniData.international.exchanges === 'string') {
      info += `   Партнёры: ${uniData.international.exchanges}\n`;
    }
    if (uniData.international.duration) {
      info += `   Длительность обмена: ${uniData.international.duration}\n`;
    }
    if (uniData.international.opportunities) {
      info += `   Возможности: ${uniData.international.opportunities}\n`;
    }
  }
  
  info += `\n${'='.repeat(50)}\n`;
  info += `💡 Для подробной информации посетите сайт университета или свяжитесь с приёмной комиссией.`;
  
  return info;
}

// Get AI response from GROK API with database context
async function getGROKResponse(userMessage) {
  try {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user is asking about a specific university
    const universities = ['IITU', 'AITU', 'KBTU', 'UIB'];
    const mentionedUni = universities.find(uni => lowerMessage.includes(uni.toLowerCase()));
    
    if (mentionedUni) {
      // Try to get university info from database first
      const uniInfo = await getUniversityInfoFromDatabase(mentionedUni);
      if (uniInfo) {
        const formatted = formatUniversityInfo(uniInfo);
        if (formatted) {
          setLoadingState(false);
          addChatMessage(formatted, 'bot');
          return;
        }
      }
    }
    
    // Check if asking about programs, tuition, scholarships, etc.
    const generalTopics = ['программ', 'программы', 'курс', 'курсы', 'стипенди', 'грант', 'стоимост', 'цена', 'обучени'];
    const asksAboutGeneral = generalTopics.some(topic => lowerMessage.includes(topic));
    
    if (asksAboutGeneral && !mentionedUni) {
      const programsResponse = await generateProgramsResponse(userMessage);
      if (programsResponse) {
        setLoadingState(false);
        addChatMessage(programsResponse, 'bot');
        return;
      }
    }
    
    // Build system prompt with database context
    const systemPrompt = buildSystemPromptWithDatabaseContext();

    // Prepare messages for GROK API
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    console.log('Sending request to GROK API...');

    // Call GROK API
    const response = await fetch(CHAT_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHAT_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: CHAT_CONFIG.MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GROK API error:', errorData);
      throw new Error(`GROK API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    setLoadingState(false);
    addChatMessage(aiMessage, 'bot');
  } catch (error) {
    console.error('Chat error:', error);
    setLoadingState(false);
    
    // Try fallback: get info from database
    const lowerMessage = userMessage.toLowerCase();
    const universities = ['IITU', 'AITU', 'KBTU', 'UIB'];
    const mentionedUni = universities.find(uni => lowerMessage.includes(uni.toLowerCase()));
    
    if (mentionedUni) {
      const uniInfo = await getUniversityInfoFromDatabase(mentionedUni);
      if (uniInfo) {
        const formatted = formatUniversityInfo(uniInfo);
        if (formatted) {
          addChatMessage(formatted, 'bot');
          return;
        }
      }
    }
    
    // Try general programs response as fallback
    const generalTopics = ['программ', 'программы', 'курс', 'курсы', 'стипенди', 'грант', 'стоимост', 'цена', 'обучени'];
    const asksAboutGeneral = generalTopics.some(topic => lowerMessage.includes(topic));
    
    if (asksAboutGeneral) {
      const programsResponse = await generateProgramsResponse(userMessage);
      if (programsResponse) {
        addChatMessage(programsResponse, 'bot');
        return;
      }
    }
    
    addChatMessage(
      'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, повторите позже.',
      'bot'
    );
  }
}

// Simulate AI response (demo mode when API key not configured)
function simulateAIResponse(userMessage) {
  const responses = {
    default: 'Спасибо за вопрос! Это интересный вопрос. Дополнительную информацию вы можете найти на странице соответствующего университета.',
    iitu: 'IITU - Международный университет информационных технологий в Алматы. Специализируется на IT, Computer Science и инженерии. Имеет сильные международные партнёрства.',
    aitu: 'AITU - Астанинский IT университет. Современный университет в столице, ориентированный на инновации и новые технологии. Известен сильными программами AI и Data Science.',
    kbtu: 'KBTU - Казахский национальный технический университет. Старейший и один из самых престижных технических университетов Казахстана. Расположен в Алматы.',
    uib: 'UIB - Университет международного бизнеса. Специализируется на бизнес-образовании и подготовке специалистов в области экономики и менеджмента.',
    comparison: 'Каждый университет имеет свои сильные стороны. Выбор зависит от ваших приоритетов: IT, инженерия или бизнес.'
  };

  // Simple keyword matching for demo responses
  const lowerMessage = userMessage.toLowerCase();
  let response = responses.default;

  if (lowerMessage.includes('iitu')) response = responses.iitu;
  else if (lowerMessage.includes('aitu')) response = responses.aitu;
  else if (lowerMessage.includes('kbtu')) response = responses.kbtu;
  else if (lowerMessage.includes('uib')) response = responses.uib;
  else if (lowerMessage.includes('сравн') || lowerMessage.includes('разни')) response = responses.comparison;

  setTimeout(() => {
    setLoadingState(false);
    addChatMessage(response, 'bot');
  }, 500);
}

// Build system prompt for AI assistant with database context
function buildSystemPromptWithDatabaseContext() {
  // Create a more readable context for GROK from the database
  let dbContextText = '';
  
  if (databaseData && databaseData.universities && databaseData.universities.length > 0) {
    dbContextText = `KAZAKH UNIVERSITIES DATABASE:\n\n`;
    
    // List all universities
    dbContextText += `Available Universities:\n`;
    databaseData.universities.forEach(uni => {
      dbContextText += `- ${uni.name} (${uni.city})\n`;
    });
    
    dbContextText += `\nTotal Academic Programs: ${databaseData.programs ? databaseData.programs.length : 0}\n`;
    dbContextText += `Total Admission Records: ${databaseData.admission ? databaseData.admission.length : 0}\n`;
    dbContextText += `International Cooperation Records: ${databaseData.cooperation ? databaseData.cooperation.length : 0}\n\n`;
    
    // Show programs grouped by university
    if (databaseData.programs && databaseData.programs.length > 0) {
      dbContextText += `Sample Programs Available:\n`;
      const programsByUni = {};
      databaseData.programs.slice(0, 30).forEach(prog => {
        if (!programsByUni[prog.university_id]) {
          programsByUni[prog.university_id] = [];
        }
        programsByUni[prog.university_id].push(prog.name);
      });
      
      Object.entries(programsByUni).forEach(([uniId, progs]) => {
        const uni = databaseData.universities.find(u => u.id == uniId);
        if (uni) {
          dbContextText += `${uni.name}: ${progs.slice(0, 3).join(', ')}\n`;
        }
      });
    }
  } else {
    dbContextText = 'KAZAKH UNIVERSITIES DATABASE:\nUniversities: IITU, AITU, KBTU, UIB\nLocations: Almaty and Astana\nSpecializations: IT, Engineering, Business';
  }
  
  return `You are GROK, an intelligent AI assistant helping students choose universities in Kazakhstan.

${dbContextText}

Your responsibilities:
1. Answer questions about universities IITU, AITU, KBTU, UIB in Russian
2. Provide accurate information from the database above: programs, admission requirements, international cooperation
3. Help students compare universities by extracting data from database
4. Be helpful, professional, and encouraging
5. Keep responses concise and well-structured (max 300 words)
6. Use actual data from the database provided above

When answering about universities:
- Use information from the database context
- Be specific about available programs, tuition fees, and admission requirements
- When comparing universities, highlight key differences in programs and location
- Always respond in Russian
- Be accurate and base answers on provided database information

Important:
- You have access to real data from PostgreSQL database
- Use this data directly in your responses
- Be confident when citing database information
- Suggest the comparison feature for detailed university comparisons`;
}

// Check if user is asking for university comparison
function isComparisonRequest(message) {
  const keywords = ['сравни', 'сравнить', 'vs', 'или', 'what\'s the difference', 'разница', 'отличие', 'compare'];
  const universities = ['iitu', 'aitu', 'kbtu', 'uib'];
  
  const lowerMessage = message.toLowerCase();
  
  // Check if message contains comparison keywords
  const hasComparisonKeyword = keywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check if message mentions at least 2 universities
  const mentionedUniversities = universities.filter(uni => lowerMessage.includes(uni));
  
  return hasComparisonKeyword && mentionedUniversities.length >= 2;
}

// Handle university comparison request
async function handleUniversityComparison(message) {
  try {
    // Extract university names from message
    const universities = ['iitu', 'aitu', 'kbtu', 'uib'];
    const lowerMessage = message.toLowerCase();
    const mentionedUniversities = universities.filter(uni => lowerMessage.includes(uni));
    
    if (mentionedUniversities.length < 2) {
      setLoadingState(false);
      addChatMessage('Пожалуйста, укажите две университета для сравнения. Пример: "сравни IITU и KBTU"', 'bot');
      return;
    }

    const uni1 = mentionedUniversities[0].toUpperCase();
    const uni2 = mentionedUniversities[1].toUpperCase();

    // Get comparison data from backend
    const response = await fetch(`${CHAT_CONFIG.BACKEND_URL}/api/compare-universities?uni1=${uni1}&uni2=${uni2}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch comparison data');
    }

    const comparisonData = await response.json();
    const comparisonText = formatComparisonResponse(comparisonData, uni1, uni2);
    
    setLoadingState(false);
    addChatMessage(comparisonText, 'bot');
  } catch (error) {
    console.error('Comparison error:', error);
    setLoadingState(false);
    addChatMessage(
      'Извините, не удалось получить данные для сравнения. Пожалуйста, повторите позже.',
      'bot'
    );
  }
}

// Format comparison response
function formatComparisonResponse(data, uni1, uni2) {
  const { university1, university2 } = data;
  
  let comparison = `📊 СРАВНЕНИЕ: ${uni1} ⚔️ ${uni2}\n`;
  comparison += `${'='.repeat(50)}\n\n`;
  
  // University names and cities
  comparison += `🏫 НАЗВАНИЕ И ГОРОД\n`;
  comparison += `─ ${uni1}: ${university1.name || 'N/A'}\n`;
  comparison += `  Город: ${university1.city || 'N/A'}\n\n`;
  comparison += `─ ${uni2}: ${university2.name || 'N/A'}\n`;
  comparison += `  Город: ${university2.city || 'N/A'}\n\n`;
  
  // Programs
  comparison += `📚 АКАДЕМИЧЕСКИЕ ПРОГРАММЫ\n`;
  comparison += `─ ${uni1}: ${university1.programs.length} программ\n`;
  if (university1.programs.length > 0) {
    comparison += `  Примеры: ${university1.programs.slice(0, 3).join(', ')}\n`;
  }
  comparison += `\n`;
  comparison += `─ ${uni2}: ${university2.programs.length} программ\n`;
  if (university2.programs.length > 0) {
    comparison += `  Примеры: ${university2.programs.slice(0, 3).join(', ')}\n`;
  }
  comparison += `\n`;
  
  // Tuition fees
  comparison += `💰 СТОИМОСТЬ ОБУЧЕНИЯ\n`;
  comparison += `─ ${uni1}:\n`;
  comparison += `  Бакалавриат: ${university1.tuition_bachelor ? university1.tuition_bachelor.toLocaleString() + ' тг' : 'N/A'}\n`;
  comparison += `  Магистратура: ${university1.tuition_master ? university1.tuition_master.toLocaleString() + ' тг' : 'N/A'}\n`;
  comparison += `\n`;
  comparison += `─ ${uni2}:\n`;
  comparison += `  Бакалавриат: ${university2.tuition_bachelor ? university2.tuition_bachelor.toLocaleString() + ' тг' : 'N/A'}\n`;
  comparison += `  Магистратура: ${university2.tuition_master ? university2.tuition_master.toLocaleString() + ' тг' : 'N/A'}\n`;
  comparison += `\n`;
  
  // Scholarships
  comparison += `🎓 СТИПЕНДИИ И ГРАНТЫ\n`;
  comparison += `─ ${uni1}: ${university1.scholarships || 'N/A'}\n`;
  comparison += `─ ${uni2}: ${university2.scholarships || 'N/A'}\n`;
  comparison += `\n`;
  
  // International partnerships
  comparison += `🌍 МЕЖДУНАРОДНЫЕ ПАРТНЁРЫ\n`;
  comparison += `─ ${uni1}: ${university1.partners || 'N/A'}\n`;
  comparison += `─ ${uni2}: ${university2.partners || 'N/A'}\n`;
  comparison += `\n`;
  
  comparison += `${'='.repeat(50)}\n`;
  comparison += `💡 Совет: Выберите университет в зависимости от:\n`;
  comparison += `   • Интересующих вас программ\n`;
  comparison += `   • Расходов на обучение\n`;
  comparison += `   • Наличия стипендий и грантов\n`;
  comparison += `   • Возможности международного обучения`;
  
  return comparison;
}

// Set loading state with typing indicator
function setLoadingState(loading) {
  isLoading = loading;
  const chatBody = document.getElementById('chatBody');
  const sendBtn = document.getElementById('chatSendBtn');
  const chatInput = document.getElementById('chatInput');

  if (loading) {
    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div class="message-content"><span></span><span></span><span></span></div>';

    if (chatBody) {
      chatBody.appendChild(typingDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    if (sendBtn) sendBtn.disabled = true;
    if (chatInput) chatInput.disabled = true;
  } else {
    // Remove typing indicator
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }

    if (sendBtn) sendBtn.disabled = false;
    if (chatInput) chatInput.disabled = false;
  }
}

// Clear chat history
function clearChatHistory() {
  chatMessages = [];
  const chatBody = document.getElementById('chatBody');
  if (chatBody) {
    chatBody.innerHTML = `
      <div class="chat-message bot-message">
        <div class="message-content">
          История чата очищена. Как я могу вам помочь?
        </div>
      </div>
    `;
  }
}

// Export functions for external use
window.chatAPI = {
  toggleChat: toggleChatWindow,
  closeChat: closeChatWindow,
  sendMessage: sendChatMessage,
  clearHistory: clearChatHistory
};
