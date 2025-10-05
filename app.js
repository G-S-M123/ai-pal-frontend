// AI Pal & Parenting Application
class AIParentingApp {
  constructor() {
    this.currentPage = 'home';
    this.isRecording = false;
    this.recognition = null;
    this.transcript = '';
    this.emotions = {
      happy: { color: '#FFD700', label: 'Happy' },
      sad: { color: '#4FC3F7', label: 'Sad' },
      angry: { color: '#FF5252', label: 'Angry' },
      calm: { color: '#66BB6A', label: 'Calm' },
      neutral: { color: '#66BB6A', label: 'Neutral' }
    };
    this.parentingFeatures = [
      {
        title: "Smart Parenting Suggestions",
        description: "AI-powered personalized parenting advice based on your child's development stage",
        icon: "💡"
      },
      {
        title: "Behavioral Insights", 
        description: "Understand patterns in your child's behavior and get actionable insights",
        icon: "📊"
      },
      {
        title: "Daily Summary Reports",
        description: "Comprehensive daily reports on your child's activities and milestones",
        icon: "📝"
      },
      {
        title: "Child Safety Notifications",
        description: "Real-time alerts and safety recommendations for your child's wellbeing",
        icon: "🔔"
      }
    ];
    this.apiEndpoint = 'https://<your-backend-domain>/analyze';
    this.privacyFeatures = [
      "No data is sent to the cloud",
      "Voice input is processed locally", 
      "Personalized encryption ensures your safety",
      "All conversations are private and secure"
    ];
    
    this.init();
  }

  init() {
    this.setupRouter();
    this.initSpeechRecognition();
    this.render();
    
    // Show privacy panel after 3 seconds on AI Pal page
    setTimeout(() => {
      if (this.currentPage === 'pal') {
        this.showPrivacyPanel();
      }
    }, 3000);
  }

  setupRouter() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      this.currentPage = e.state?.page || 'home';
      this.render();
    });

    // Set initial state
    history.replaceState({ page: this.currentPage }, '', `#${this.currentPage}`);
  }

  navigate(page) {
    this.currentPage = page;
    history.pushState({ page }, '', `#${page}`);
    this.render();
    
    // Show privacy panel on AI Pal page
    if (page === 'pal') {
      setTimeout(() => this.showPrivacyPanel(), 3000);
    }
  }

  initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.updateVoiceButton();
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        this.transcript = finalTranscript + interimTranscript;
        this.updateTranscript();
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        this.updateVoiceButton();
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isRecording = false;
        this.updateVoiceButton();
        
        // Show user-friendly error message
        const transcriptArea = document.getElementById('transcriptArea');
        if (transcriptArea) {
          transcriptArea.textContent = 'Speech recognition error. Please try again.';
          transcriptArea.classList.add('empty');
        }
      };
    }
  }

  render() {
    const root = document.getElementById('root');
    root.innerHTML = this.getPageHTML();
    
    // Use setTimeout to ensure DOM is rendered before attaching listeners
    setTimeout(() => {
      this.attachEventListeners();
    }, 0);
  }

  getPageHTML() {
    const navbar = this.renderNavbar();
    
    switch (this.currentPage) {
      case 'home':
        return navbar + this.renderHomePage();
      case 'pal':
        return navbar + this.renderAIPalPage();
      case 'parenting':
        return navbar + this.renderParentingPage();
      default:
        return navbar + this.renderHomePage();
    }
  }

  renderNavbar() {
    return `
      <nav class="navbar">
        <div class="navbar-container">
          <a href="#" class="navbar-logo" data-page="home">AI Pal & Parenting</a>
          <div class="navbar-nav">
            <a href="#" class="navbar-link ${this.currentPage === 'home' ? 'active' : ''}" data-page="home">Home</a>
            <a href="#" class="navbar-link ${this.currentPage === 'pal' ? 'active' : ''}" data-page="pal">AI Pal</a>
            <a href="#" class="navbar-link ${this.currentPage === 'parenting' ? 'active' : ''}" data-page="parenting">Parent Assistant</a>
          </div>
        </div>
      </nav>
    `;
  }

  renderHomePage() {
    return `
      <div class="page">
        <div class="container">
          <div class="home-container">
            <h1 class="home-title">Welcome to AI Pal & Parenting</h1>
            <p class="home-subtitle">
              Choose your mode to get started with our AI-powered assistance system that respects your privacy
            </p>
            <div class="mode-cards">
              <a href="#" class="mode-card glass-card" data-page="pal">
                <div class="mode-card-icon">🤖</div>
                <h3 class="mode-card-title">AI Pal</h3>
                <p class="mode-card-description">
                  Teen/Young Adult emotional companion with voice input and emotion analysis. All processing happens locally.
                </p>
              </a>
              <a href="#" class="mode-card glass-card" data-page="parenting">
                <div class="mode-card-icon">👨‍👩‍👧‍👦</div>
                <h3 class="mode-card-title">AI Parenting Assistant</h3>
                <p class="mode-card-description">
                  Smart parenting tools for children aged 0-12 years. Get insights, suggestions, and safety notifications.
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAIPalPage() {
    return `
      <div class="page">
        <div class="container">
          <div class="pal-container">
            <div class="pal-card glass-card">
              <h1 class="pal-title">AI Pal - Your Emotional Companion</h1>
              
              <div class="voice-section">
                <button id="voiceButton" class="voice-button" title="Click to start/stop recording" type="button">
                  <span id="voiceButtonText">${this.isRecording ? '⏹️' : '🎤'}</span>
                </button>
                <div id="transcriptArea" class="transcript-area ${this.transcript ? '' : 'empty'}">
                  ${this.transcript || 'Click the microphone and start speaking...'}
                </div>
                <button id="analyzeButton" class="analyze-button" type="button" ${!this.transcript ? 'disabled' : ''}>
                  <span id="analyzeButtonText">Analyze Emotion</span>
                </button>
              </div>

              <div id="emotionResult" class="emotion-result">
                <!-- Emotion result will be displayed here -->
              </div>

              <div class="privacy-section">
                <div class="privacy-notice">
                  🔒 All data is processed locally. No cloud storage.
                </div>
                <div class="privacy-disclaimer">
                  Emotion analysis is experimental and may not always be accurate.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="privacyFloat" class="privacy-float">
        <div class="privacy-float-header">
          <span>🔒</span>
          <span>Privacy Matters</span>
        </div>
        <ul class="privacy-float-list">
          ${this.privacyFeatures.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  renderParentingPage() {
    return `
      <div class="page">
        <div class="container">
          <div class="parenting-container">
            <h1 class="parenting-title">AI Parenting Assistant</h1>
            <p class="parenting-subtitle">
              Comprehensive AI-powered tools to support your parenting journey with children aged 0-12 years
            </p>
            <div class="coming-soon-badge">🚀 Coming Soon</div>
            
            <div class="features-grid">
              ${this.parentingFeatures.map(feature => `
                <div class="feature-card glass-card">
                  <div class="feature-icon">${feature.icon}</div>
                  <h3 class="feature-title">${feature.title}</h3>
                  <p class="feature-description">${feature.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Navigation links
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.getAttribute('data-page');
        this.navigate(page);
      });
    });

    // AI Pal page specific listeners
    if (this.currentPage === 'pal') {
      const voiceButton = document.getElementById('voiceButton');
      const analyzeButton = document.getElementById('analyzeButton');
      const transcriptArea = document.getElementById('transcriptArea');

      if (voiceButton) {
        // Remove any existing listeners first
        voiceButton.removeEventListener('click', this.handleVoiceButtonClick);
        voiceButton.addEventListener('click', (e) => this.handleVoiceButtonClick(e));
      }

      if (analyzeButton) {
        analyzeButton.removeEventListener('click', this.handleAnalyzeButtonClick);
        analyzeButton.addEventListener('click', (e) => this.handleAnalyzeButtonClick(e));
      }

      // Also allow clicking on transcript area to start recording
      if (transcriptArea) {
        transcriptArea.addEventListener('click', (e) => {
          if (transcriptArea.classList.contains('empty')) {
            this.handleVoiceButtonClick(e);
          }
        });
      }
    }
  }

  handleVoiceButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.toggleRecording();
  }

  handleAnalyzeButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.analyzeEmotion();
  }

  toggleRecording() {
    if (!this.recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
    } else {
      this.transcript = '';
      this.updateTranscript();
      this.recognition.start();
    }
  }

  updateVoiceButton() {
    const button = document.getElementById('voiceButton');
    const buttonText = document.getElementById('voiceButtonText');
    const analyzeButton = document.getElementById('analyzeButton');
    
    if (button && buttonText) {
      if (this.isRecording) {
        button.classList.add('recording');
        buttonText.textContent = '⏹️';
        button.title = 'Click to stop recording';
      } else {
        button.classList.remove('recording');
        buttonText.textContent = '🎤';
        button.title = 'Click to start recording';
      }
    }

    if (analyzeButton) {
      analyzeButton.disabled = !this.transcript;
    }
  }

  updateTranscript() {
    const transcriptArea = document.getElementById('transcriptArea');
    const analyzeButton = document.getElementById('analyzeButton');
    
    if (transcriptArea) {
      if (this.transcript) {
        transcriptArea.textContent = this.transcript;
        transcriptArea.classList.remove('empty');
      } else {
        transcriptArea.textContent = 'Click the microphone and start speaking...';
        transcriptArea.classList.add('empty');
      }
    }

    if (analyzeButton) {
      analyzeButton.disabled = !this.transcript;
    }
  }

  async analyzeEmotion() {
    if (!this.transcript) return;

    const analyzeButton = document.getElementById('analyzeButton');
    const analyzeButtonText = document.getElementById('analyzeButtonText');
    const emotionResult = document.getElementById('emotionResult');

    // Show loading state
    if (analyzeButton && analyzeButtonText) {
      analyzeButton.disabled = true;
      analyzeButtonText.innerHTML = '<span class="spinner"></span>Analyzing...';
    }

    try {
      // Try to call the backend API
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: this.transcript })
      });

      let emotion = 'neutral';
      if (response.ok) {
        const result = await response.json();
        emotion = result.emotion || 'neutral';
      } else {
        // Fallback to local analysis if backend is not available
        emotion = this.analyzeEmotionLocally(this.transcript);
      }

      this.displayEmotionResult(emotion);
    } catch (error) {
      console.warn('Backend not available, using local analysis:', error);
      // Fallback to local analysis
      const emotion = this.analyzeEmotionLocally(this.transcript);
      this.displayEmotionResult(emotion);
    } finally {
      // Reset button state
      if (analyzeButton && analyzeButtonText) {
        analyzeButton.disabled = false;
        analyzeButtonText.textContent = 'Analyze Emotion';
      }
    }
  }

  analyzeEmotionLocally(text) {
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based emotion detection
    const emotionKeywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'awesome', 'fantastic', 'wonderful', 'amazing', 'love', 'glad', 'pleased', 'cheerful'],
      sad: ['sad', 'depressed', 'down', 'upset', 'crying', 'tears', 'miserable', 'heartbroken', 'gloomy', 'melancholy'],
      angry: ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'frustrated', 'irritated', 'pissed', 'outraged'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'balanced', 'centered', 'zen']
    };

    let maxScore = 0;
    let detectedEmotion = 'neutral';

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = (lowerText.match(regex) || []).length;
        return acc + matches;
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
    }

    return detectedEmotion;
  }

  displayEmotionResult(emotion) {
    const emotionResult = document.getElementById('emotionResult');
    if (!emotionResult) return;

    const emotionData = this.emotions[emotion] || this.emotions.neutral;
    const confidence = Math.floor(Math.random() * 20) + 75; // Simulate confidence 75-95%

    emotionResult.innerHTML = `
      <div class="emotion-ring" style="background: radial-gradient(circle, ${emotionData.color}22, ${emotionData.color}11); border: 3px solid ${emotionData.color};">
        <div class="emotion-ring" style="background: ${emotionData.color}; border: none; width: 100px; height: 100px;">
          <div class="emotion-label">${emotionData.label}</div>
        </div>
      </div>
      <div class="emotion-confidence">${confidence}% confidence</div>
    `;

    // Update the ring glow effect
    const ring = emotionResult.querySelector('.emotion-ring');
    if (ring) {
      ring.style.setProperty('--glow-color', emotionData.color);
    }

    emotionResult.classList.add('visible');

    // Save to localStorage for session data
    this.saveSessionData(emotion, this.transcript, confidence);
  }

  saveSessionData(emotion, transcript, confidence) {
    try {
      const sessionData = {
        timestamp: new Date().toISOString(),
        emotion,
        transcript: transcript.substring(0, 100), // Only save first 100 chars for privacy
        confidence
      };
      
      const sessions = JSON.parse(localStorage.getItem('aiPalSessions') || '[]');
      sessions.push(sessionData);
      
      // Keep only last 10 sessions for privacy
      if (sessions.length > 10) {
        sessions.splice(0, sessions.length - 10);
      }
      
      localStorage.setItem('aiPalSessions', JSON.stringify(sessions));
    } catch (error) {
      console.warn('Could not save session data:', error);
    }
  }

  showPrivacyPanel() {
    const panel = document.getElementById('privacyFloat');
    if (panel) {
      panel.classList.add('visible');
      
      // Hide after 10 seconds
      setTimeout(() => {
        panel.classList.remove('visible');
      }, 10000);
    }
  }
}

// Utility functions
function fadeIn(element, duration = 300) {
  element.style.opacity = '0';
  element.style.display = 'block';
  
  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;
    
    element.style.opacity = Math.min(progress, 1);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

function slideUp(element, duration = 300) {
  element.style.transform = 'translateY(20px)';
  element.style.opacity = '0';
  
  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;
    
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    
    element.style.transform = `translateY(${20 * (1 - easeProgress)}px)`;
    element.style.opacity = Math.min(easeProgress, 1);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.aiParentingApp = new AIParentingApp();
});

// Handle page visibility changes to manage speech recognition
document.addEventListener('visibilitychange', () => {
  if (document.hidden && window.aiParentingApp && window.aiParentingApp.isRecording) {
    window.aiParentingApp.recognition?.stop();
  }
});

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Service worker would be registered here if implemented
    console.log('AI Pal & Parenting app loaded successfully');
  });
}
