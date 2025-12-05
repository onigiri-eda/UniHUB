// AI Chat Assistant JavaScript
// This file handles chat UI, open/close logic, and OpenAI API integration

// Configuration
const CHAT_CONFIG = {
  API_KEY: 'YOUR_OPENAI_API_KEY_HERE', // Replace with actual API key
  API_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-3.5-turbo'
};

// Chat instance
let chatWindow = null;
let chatMessages = [];
let isLoading = false;

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeChat();
});

// Initialize chat system
function initializeChat() {
  createChatWidget();
  setupChatEventListeners();
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
          <h3>AI Assistant</h3>
          <button id="chatCloseBtn" class="chat-close-btn">✕</button>
        </div>

        <div id="chatBody" class="chat-body">
          <div class="chat-message bot-message">
            <div class="message-content">
              Привет! 👋 Я ваш AI ассистент. Я могу помочь вам узнать больше об университетах. 
              <br><br>
              Могу помочь с:
              <ul style="margin-top: 8px; margin-left: 20px;">
                <li>Информацией об университетах</li>
                <li>Академическими программами</li>
                <li>Условиями поступления</li>
                <li>Международным сотрудничеством</li>
                <li>Сравнением университетов</li>
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
            <small>Это AI-ассистент, питаемый OpenAI</small>
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

  // Get AI response
  getAIResponse(message);
}

// Add message to chat display
function addChatMessage(text, sender) {
  const chatBody = document.getElementById('chatBody');
  if (!chatBody) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}-message`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
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

// Get AI response from OpenAI API
async function getAIResponse(userMessage) {
  try {
    // Check if API key is configured
    if (CHAT_CONFIG.API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
      // Demo mode: return static response
      simulateAIResponse(userMessage);
      return;
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt();

    // Prepare messages for API
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

    // Call OpenAI API
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
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    setLoadingState(false);
    addChatMessage(aiMessage, 'bot');
  } catch (error) {
    console.error('Chat error:', error);
    setLoadingState(false);
    addChatMessage(
      'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, проверьте конфигурацию API.',
      'bot'
    );
  }
}

// Simulate AI response (demo mode when API key not configured)
function simulateAIResponse(userMessage) {
  const responses = {
    default: 'Спасибо за вопрос! Это интересный вопрос. Дополнительную информацию вы можете найти на странице соответствующего университета.',
    muit: 'МУИТ (Морской университет информационных технологий) - это ведущий вуз в области IT и инженерии в Актау. Университет имеет партнёрства с Google, Microsoft и Shell. Программы включают Computer Science, Software Engineering и другие специальности.',
    kbtu: 'KBTU (Казахский национальный технический университет) - старейший технический вуз Казахстана, основанный в 1934 году. Расположен в Алматы и известен сильными программами по инженерии и архитектуре.',
    uib: 'UIB (Университет нефти и газа) специализируется на подготовке специалистов для нефтегазовой промышленности. Имеет партнёрства с Shell, Chevron и другими крупными компаниями.',
    aitu: 'AITU - современный частный университет в Алматы с фокусом на бизнес, IT и инновации. Партнёры включают Google, Cisco и Amazon. Известен высокими показателями трудоустройства.',
    tuition: 'Стоимость обучения варьируется в зависимости от университета и программы. Обычно бакалавриат стоит 1.2-3.5 млн KZT в год, магистратура - 1.8-5 млн KZT в год.',
    scholarship: 'Все университеты предлагают стипендии на основе заслуг. Некоторые предлагают корпоративные стипендии через партнёрские компании.',
    international: 'Все университеты имеют программы международного обмена с вузами в США, Европе, Канаде и других странах.',
    comparison: 'Каждый университет имеет свои сильные стороны. Выбор зависит от ваших приоритетов: IT, инженерия, нефтегаз или бизнес.'
  };

  // Simple keyword matching for demo responses
  const lowerMessage = userMessage.toLowerCase();
  let response = responses.default;

  if (lowerMessage.includes('муит')) response = responses.muit;
  else if (lowerMessage.includes('kbtu')) response = responses.kbtu;
  else if (lowerMessage.includes('uib')) response = responses.uib;
  else if (lowerMessage.includes('aitu')) response = responses.aitu;
  else if (lowerMessage.includes('стоимость') || lowerMessage.includes('цена') || lowerMessage.includes('оплат')) response = responses.tuition;
  else if (lowerMessage.includes('стипендия') || lowerMessage.includes('грант')) response = responses.scholarship;
  else if (lowerMessage.includes('обмен') || lowerMessage.includes('интернацион')) response = responses.international;
  else if (lowerMessage.includes('сравн') || lowerMessage.includes('лучше')) response = responses.comparison;

  setTimeout(() => {
    setLoadingState(false);
    addChatMessage(response, 'bot');
  }, 500);
}

// Build system prompt for AI assistant
function buildSystemPrompt() {
  const universityData = JSON.stringify(universities, null, 2);

  return `You are an AI assistant helping students choose a university in Kazakhstan. 
You have access to information about 4 universities: MUIT, KBTU, UIB, and AITU.

University Data:
${universityData}

You should:
1. Answer questions about the universities in Russian
2. Help students compare universities
3. Provide accurate information about programs, tuition, admission, and international opportunities
4. Be helpful and encouraging
5. Keep responses concise and well-structured
6. Use the provided university data as your knowledge base

Remember: This is an educational assistant, so be professional and helpful.`;
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
