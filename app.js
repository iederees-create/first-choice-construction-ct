/**
 * First Choice Construction - Interactive Client App
 * Handles Theme Toggling, Project Tracking Dashboard, and AI Assistant Chat
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initProjectTracker();
    initChatAssistant();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.classList.add('light-theme');
        themeToggle.checked = true;
    } else {
        document.body.classList.remove('light-theme');
        themeToggle.checked = false;
    }

    // Toggle theme on switch change
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
}

/* ==========================================================================
   2. Project Tracker Dashboard
   ========================================================================== */
function initProjectTracker() {
    const trackBtn = document.getElementById('track-btn');
    const trackInput = document.getElementById('track-input');
    const trackerResult = document.getElementById('tracker-result');

    if (!trackBtn || !trackInput || !trackerResult) return;

    // Demo project database
    const projectsDb = {
        'FIRST100': {
            name: "Double-Storey Home Extension",
            location: "Bellville, Cape Town",
            client: "Mr. & Mrs. Henderson",
            progress: 72,
            budgetUsed: "R235,000",
            budgetTotal: "R320,000",
            startDate: "March 15, 2026",
            estCompletion: "June 25, 2026",
            milestones: [
                { title: "Site Excavation & Foundation", status: "completed" },
                { title: "Concrete Slab & Structural Framing", status: "completed" },
                { title: "Brickwork & Room Extension Walls", status: "completed" },
                { title: "Roofing, Insulation & Trusses", status: "active" },
                { title: "Plumbing & Electrical First-Fix", status: "active" },
                { title: "Interior Plastering, Painting & Fittings", status: "pending" }
            ],
            brief: "Constructing a modern 2-bedroom upper-level extension over the existing garage, integrating high-insulation double brickwork and matching slate roof tiles."
        }
    };

    trackBtn.addEventListener('click', performTrack);
    trackInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performTrack();
    });

    function performTrack() {
        const code = trackInput.value.trim().toUpperCase();
        
        if (!code) {
            showError("Please enter a valid tracking code.");
            return;
        }

        const project = projectsDb[code];

        if (project) {
            renderDashboard(project);
        } else {
            showError("Code not found. Try the demo code: <strong>FIRST100</strong>");
        }
    }

    function showError(message) {
        trackerResult.innerHTML = `
            <div class="tracker-error-card">
                <p>${message}</p>
            </div>
        `;
        trackerResult.style.display = 'block';
    }

    function renderDashboard(proj) {
        let milestonesHtml = '';
        proj.milestones.forEach(m => {
            let badgeClass = 'milestone-badge-pending';
            let icon = '○';
            if (m.status === 'completed') {
                badgeClass = 'milestone-badge-done';
                icon = '✓';
            } else if (m.status === 'active') {
                badgeClass = 'milestone-badge-active';
                icon = '⚡';
            }
            milestonesHtml += `
                <div class="milestone-row">
                    <span class="milestone-status-icon ${badgeClass}">${icon}</span>
                    <div class="milestone-details">
                        <h5>${m.title}</h5>
                        <p class="milestone-status-text">${m.status.toUpperCase()}</p>
                    </div>
                </div>
            `;
        });

        trackerResult.innerHTML = `
            <div class="tracker-dashboard-card animate-fade-in">
                <div class="dashboard-header">
                    <div>
                        <span class="dashboard-meta-badge">LIVE TRACKING</span>
                        <h4>${proj.name}</h4>
                        <p class="dashboard-meta">${proj.location} &bull; Client: ${proj.client}</p>
                    </div>
                    <div class="dashboard-progress-circle">
                        <span class="progress-val">${proj.progress}%</span>
                    </div>
                </div>
                
                <p class="dashboard-brief"><strong>Project Brief:</strong> ${proj.brief}</p>
                
                <div class="dashboard-stats-grid">
                    <div class="dashboard-stat-box">
                        <span class="stat-box-lbl">Started</span>
                        <span class="stat-box-val">${proj.startDate}</span>
                    </div>
                    <div class="dashboard-stat-box">
                        <span class="stat-box-lbl">Est. Completion</span>
                        <span class="stat-box-val">${proj.estCompletion}</span>
                    </div>
                    <div class="dashboard-stat-box">
                        <span class="stat-box-lbl">Budget Spent</span>
                        <span class="stat-box-val">${proj.budgetUsed} / ${proj.budgetTotal}</span>
                    </div>
                </div>

                <div class="dashboard-progress-bar-container">
                    <div class="dashboard-progress-bar" style="width: ${proj.progress}%"></div>
                </div>

                <div class="milestones-section">
                    <h4>Milestones & Status</h4>
                    <div class="milestones-list">
                        ${milestonesHtml}
                    </div>
                </div>
            </div>
        `;
        trackerResult.style.display = 'block';
    }
}

/* ==========================================================================
   3. AI Chat Assistant (Sliding Drawer)
   ========================================================================== */
function initChatAssistant() {
    const chatToggle = document.getElementById('chat-toggle-btn');
    const chatDrawer = document.getElementById('chat-drawer');
    const chatClose = document.getElementById('chat-close-btn');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatToggle || !chatDrawer || !chatClose || !chatInput || !chatSend || !chatMessages) return;

    // Toggle drawer state
    chatToggle.addEventListener('click', () => {
        chatDrawer.classList.toggle('open');
        // Clear initial notification badge if any
        const badge = chatToggle.querySelector('.notification-badge');
        if (badge) badge.style.display = 'none';
    });

    chatClose.addEventListener('click', () => {
        chatDrawer.classList.remove('open');
    });

    // Handle sending message
    chatSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Append User message
        appendMessage('user', text);
        chatInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Process response with realistic delay
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = generateAIResponse(text);
            appendMessage('bot', botResponse);
        }, 1200);
    }

    function appendMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender === 'user' ? 'user-message' : 'bot-message'}`;
        bubble.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    let typingIndicator = null;
    function showTypingIndicator() {
        if (typingIndicator) return;
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-bubble bot-message typing-indicator-bubble';
        typingIndicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.remove();
            typingIndicator = null;
        }
    }

    function generateAIResponse(message) {
        const msg = message.toLowerCase();
        
        // Quote / Estimates
        if (msg.includes('quote') || msg.includes('book') || msg.includes('schedule') || msg.includes('consult')) {
            return "I can definitely schedule a free consultation! Could you please share your name, phone number, and a brief description of what you'd like to build or renovate? I'll have our estimator contact you directly.";
        }
        
        // Pricing / Cost
        if (msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('rate')) {
            return "Project costs depend on scope. Home extensions in Cape Town typically start at R8,000/sqm, while room paving and boundary walls vary. We offer <strong>free site visits in Bellville</strong> to give a detailed, itemized quote. What works for you?";
        }

        // Project duration / Timeline
        if (msg.includes('time') || msg.includes('long') || msg.includes('duration') || msg.includes('weeks') || msg.includes('months')) {
            return "Minor renovations take 1–3 weeks, extensions take 4–8 weeks, and custom new builds can take 3–6 months depending on size and architectural approvals. Let me know what you are looking to build!";
        }

        // Contact info
        if (msg.includes('contact') || msg.includes('phone') || msg.includes('call') || msg.includes('number') || msg.includes('email')) {
            return "You can reach us at <strong>+27 68 123 4567</strong> or email <strong>estimates@firstchoiceconstruction.co.za</strong>. We are based in Bellville, Cape Town.";
        }

        // Services details
        if (msg.includes('renov') || msg.includes('build') || msg.includes('pav') || msg.includes('wall') || msg.includes('extend')) {
            return "First Choice Construction specializes in structural extensions, paving, boundary walls, new residential builds, and project management in Bellville. All our work is COC-certified and fully insured. Would you like details on a specific service?";
        }

        // Location check
        if (msg.includes('where') || msg.includes('location') || msg.includes('bellville') || msg.includes('area') || msg.includes('cape town')) {
            return "We are based in Bellville, Cape Town and service the entire Northern Suburbs and surrounding areas. We do free onsite consultations in these suburbs.";
        }

        // Fallback
        return "That sounds like a great project! First Choice Construction has over 200 completed jobs and a 4.9-star rating in Bellville. Would you like to schedule a free site visit to discuss, or should I explain our structural warranty?";
    }
}
