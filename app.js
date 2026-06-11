/**
 * First Choice Construction - Interactive Client App
 * Handles Theme Toggling, Project Tracking Dashboard, AI Assistant Chat,
 * and the Interactive Structural Engineering Simulator.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initProjectTracker();
    initChatAssistant();
    initStructuralSimulator();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.classList.add('light-theme');
        themeToggle.checked = true;
    } else {
        document.body.classList.remove('light-theme');
        themeToggle.checked = false;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
        // Dispatch event so other components (like canvas/SVG details) can redraw if needed
        window.dispatchEvent(new Event('themeChanged'));
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
        trackerResult.innerHTML = `<div class="tracker-error-card"><p>${message}</p></div>`;
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

    chatToggle.addEventListener('click', () => {
        chatDrawer.classList.toggle('open');
        const badge = chatToggle.querySelector('.notification-badge');
        if (badge) badge.style.display = 'none';
    });

    chatClose.addEventListener('click', () => {
        chatDrawer.classList.remove('open');
    });

    chatSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        chatInput.value = '';
        showTypingIndicator();

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
        if (msg.includes('quote') || msg.includes('book') || msg.includes('schedule') || msg.includes('consult')) {
            return "I can definitely schedule a free consultation! Could you please share your name, phone number, and a brief description of what you'd like to build or renovate? I'll have our estimator contact you directly.";
        }
        if (msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('rate')) {
            return "Project costs depend on scope. Home extensions in Cape Town typically start at R8,000/sqm, while room paving and boundary walls vary. We offer <strong>free site visits in Bellville</strong> to give a detailed, itemized quote. What works for you?";
        }
        if (msg.includes('time') || msg.includes('long') || msg.includes('duration') || msg.includes('weeks') || msg.includes('months')) {
            return "Minor renovations take 1–3 weeks, extensions take 4–8 weeks, and custom new builds can take 3–6 months depending on size and architectural approvals. Let me know what you are looking to build!";
        }
        if (msg.includes('contact') || msg.includes('phone') || msg.includes('call') || msg.includes('number') || msg.includes('email')) {
            return "You can reach us at <strong>+27 68 123 4567</strong> or email <strong>estimates@firstchoiceconstruction.co.za</strong>. We are based in Bellville, Cape Town.";
        }
        if (msg.includes('renov') || msg.includes('build') || msg.includes('pav') || msg.includes('wall') || msg.includes('extend')) {
            return "First Choice Construction specializes in structural extensions, paving, boundary walls, new residential builds, and project management in Bellville. All our work is COC-certified and fully insured. Would you like details on a specific service?";
        }
        if (msg.includes('where') || msg.includes('location') || msg.includes('bellville') || msg.includes('area') || msg.includes('cape town')) {
            return "We are based in Bellville, Cape Town and service the entire Northern Suburbs and surrounding areas. We do free onsite consultations in these suburbs.";
        }
        return "That sounds like a great project! First Choice Construction has over 200 completed jobs and a 4.9-star rating in Bellville. Would you like to schedule a free site visit to discuss, or should I explain our structural warranty?";
    }
}

/* ==========================================================================
   4. Interactive Structural Engineering Simulator
   ========================================================================== */
function initStructuralSimulator() {
    // Controls
    const materialSelect = document.getElementById('sim-material');
    const supportSelect = document.getElementById('sim-support');
    const lengthSlider = document.getElementById('sim-length');
    const loadSlider = document.getElementById('sim-load');

    // Values Displays
    const lengthVal = document.getElementById('sim-length-val');
    const loadVal = document.getElementById('sim-load-val');

    // Telemetry Outputs
    const deflectionOut = document.getElementById('telemetry-deflection');
    const stressOut = document.getElementById('telemetry-stress');
    const safetyStatus = document.getElementById('telemetry-safety');

    // SVGs
    const beamPath = document.getElementById('sim-beam-path');
    const supportLeft = document.getElementById('sim-support-left');
    const supportRight = document.getElementById('sim-support-right');
    const loadArrow = document.getElementById('sim-load-arrow');
    const loadArrowHead = document.getElementById('sim-load-arrow-head');
    const loadArrowText = document.getElementById('sim-load-arrow-text');

    // Math Formulas
    const formulaE = document.getElementById('formula-val-e');
    const formulaI = document.getElementById('formula-val-i');
    const formulaL = document.getElementById('formula-val-l');
    const formulaP = document.getElementById('formula-val-p');
    const formulaResult = document.getElementById('formula-val-result');

    if (!materialSelect || !supportSelect || !lengthSlider || !loadSlider) return;

    // Constants
    const MATERIALS = {
        timber: { name: "Timber (Pine)", E: 10e9, yield: 15e6, color: "#a8a29e" },
        concrete: { name: "Concrete (C25)", E: 30e9, yield: 30e6, color: "#78716c" },
        steel: { name: "Structural Steel", E: 200e9, yield: 250e6, color: "#64748b" }
    };

    // Beam cross-section parameters (Rectangular: 150mm wide x 300mm deep)
    const b = 0.15; // meters
    const h = 0.30; // meters
    const I = (b * Math.pow(h, 3)) / 12; // Moment of Inertia = 0.0003375 m4
    const y = h / 2; // Distance to outer fiber = 0.15m

    function calculateDeflection() {
        const matKey = materialSelect.value;
        const support = supportSelect.value;
        const L = parseFloat(lengthSlider.value);
        const mass = parseFloat(loadSlider.value);

        // Update slider display labels
        lengthVal.innerText = `${L.toFixed(1)}m`;
        loadVal.innerText = `${mass.toLocaleString()} kg`;

        const E = MATERIALS[matKey].E;
        const yieldStrength = MATERIALS[matKey].yield;
        const P = mass * 9.81; // Force in Newtons

        let maxDeflection = 0;
        let maxStress = 0;

        if (support === 'supported') {
            // Simply supported beam with central point load
            // Max deflection at center: w = (P * L^3) / (48 * E * I)
            maxDeflection = (P * Math.pow(L, 3)) / (48 * E * I);
            // Max bending moment at center: M = P * L / 4
            const M = (P * L) / 4;
            // Bending stress: sigma = M * y / I
            maxStress = (M * y) / I;
        } else {
            // Cantilever beam with load at free end
            // Max deflection at end: w = (P * L^3) / (3 * E * I)
            maxDeflection = (P * Math.pow(L, 3)) / (3 * E * I);
            // Max bending moment at wall: M = P * L
            const M = P * L;
            maxStress = (M * y) / I;
        }

        // Stress ratio relative to yield strength
        const stressRatio = maxStress / yieldStrength;
        
        // Deflection limit ratio (standard building code L/360)
        const limitDeflection = L / 360;
        const deflectionRatio = maxDeflection / limitDeflection;

        // Determine safety status
        let status = 'SAFE';
        let statusClass = 'status-safe';

        if (stressRatio >= 1.0) {
            status = 'COLLAPSE / FAILURE';
            statusClass = 'status-critical';
        } else if (deflectionRatio >= 1.0 || stressRatio >= 0.75) {
            status = 'WARNING (EXCEEDS CODE)';
            statusClass = 'status-warning';
        }

        // Update Telemetry Display
        deflectionOut.innerHTML = `<strong>${(maxDeflection * 1000).toFixed(1)} mm</strong> (Limit: ${(limitDeflection * 1000).toFixed(1)} mm)`;
        stressOut.innerHTML = `<strong>${(maxStress / 1e6).toFixed(2)} MPa</strong> (Yield: ${(yieldStrength / 1e6).toFixed(0)} MPa)`;
        
        safetyStatus.innerHTML = `<span class="badge-status ${statusClass}">${status}</span>`;

        // Update Math Formula card variables
        formulaE.innerText = (E / 1e9).toFixed(0);
        formulaI.innerText = I.toFixed(7);
        formulaL.innerText = L.toFixed(2);
        formulaP.innerText = P.toFixed(0);
        formulaResult.innerText = (maxDeflection * 1000).toFixed(2);

        // Update SVG Graphics
        updateVisualBeam(maxDeflection, support, L, stressRatio);
    }

    function updateVisualBeam(deflection, support, L, stressRatio) {
        // Draw coordinate dimensions
        const startX = 100;
        const endX = 700;
        const lengthX = endX - startX;
        const yBase = 100; // Baseline beam Y coordinate
        const beamThickness = 20;

        // Visual scale: how many pixels deflection per meter of real deflection
        // Standard max deflection in database is around 0.15m (150mm), which should correspond to ~60px bend
        const visualScale = 400; // 400px per meter
        const scaledDeflection = deflection * visualScale;

        // Limit visual deformation so the drawing doesn't break
        const clampedVisualDeflection = Math.min(scaledDeflection, 80);

        // Generate points along the beam (21 points)
        const points = [];
        const numPoints = 20;

        for (let i = 0; i <= numPoints; i++) {
            const fraction = i / numPoints;
            const x = startX + fraction * lengthX;
            const realX = fraction * L; // Real distance along beam

            let w = 0; // Real deflection at this point
            const P = parseFloat(loadSlider.value) * 9.81;
            const E = MATERIALS[materialSelect.value].E;

            if (support === 'supported') {
                // Simply supported: Load at center (L/2)
                if (realX <= L / 2) {
                    w = (P * realX * (3 * L * L - 4 * realX * realX)) / (48 * E * I);
                } else {
                    const symmetricX = L - realX;
                    w = (P * symmetricX * (3 * L * L - 4 * symmetricX * symmetricX)) / (48 * E * I);
                }
            } else {
                // Cantilever: Fixed at left (x=0), Load at right (x=L)
                w = (P * Math.pow(realX, 2) * (3 * L - realX)) / (6 * E * I);
            }

            // Scale to visual coordinates
            const visualDeflection = w * visualScale;
            const y = yBase + Math.min(visualDeflection, 90);
            points.push({ x, y });
        }

        // Construct Top & Bottom paths for the SVG beam outline
        let dTop = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i <= numPoints; i++) {
            dTop += ` L ${points[i].x} ${points[i].y}`;
        }

        let dBottom = `M ${points[numPoints].x} ${points[numPoints].y + beamThickness}`;
        for (let i = numPoints - 1; i >= 0; i--) {
            dBottom += ` L ${points[i].x} ${points[i].y + beamThickness}`;
        }

        // Full closed beam path
        const dFull = `${dTop} L ${points[numPoints].x} ${points[numPoints].y + beamThickness} ${dBottom} Z`;
        beamPath.setAttribute('d', dFull);

        // Color based on stress level (gradient or stroke color)
        // If stress is high, color turns red
        const baseColor = MATERIALS[materialSelect.value].color;
        const colorVal = interpolateColor(baseColor, '#ef4444', Math.min(stressRatio, 1.0));
        beamPath.setAttribute('fill', colorVal);
        beamPath.setAttribute('stroke', interpolateColor('#ffffff', '#ef4444', Math.min(stressRatio, 1.0)));

        // Position supports
        if (support === 'supported') {
            supportLeft.setAttribute('transform', `translate(${startX}, ${yBase + beamThickness})`);
            supportRight.setAttribute('transform', `translate(${endX}, ${yBase + beamThickness})`);
            supportRight.style.display = 'block';

            // Position load arrow in the middle
            const midPoint = points[Math.floor(numPoints / 2)];
            loadArrow.setAttribute('x1', midPoint.x);
            loadArrow.setAttribute('y1', midPoint.y - 40);
            loadArrow.setAttribute('x2', midPoint.x);
            loadArrow.setAttribute('y2', midPoint.y - 5);

            loadArrowHead.setAttribute('points', `${midPoint.x - 6},${midPoint.y - 12} ${midPoint.x},${midPoint.y - 2} ${midPoint.x + 6},${midPoint.y - 12}`);
            
            loadArrowText.setAttribute('x', midPoint.x);
            loadArrowText.setAttribute('y', midPoint.y - 45);
        } else {
            // Cantilever: fixed at left
            supportLeft.setAttribute('transform', `translate(${startX - 10}, ${yBase - 20})`);
            supportRight.style.display = 'none'; // No right support

            // Position load arrow at the right end
            const endPoint = points[numPoints];
            loadArrow.setAttribute('x1', endPoint.x);
            loadArrow.setAttribute('y1', endPoint.y - 40);
            loadArrow.setAttribute('x2', endPoint.x);
            loadArrow.setAttribute('y2', endPoint.y - 5);

            loadArrowHead.setAttribute('points', `${endPoint.x - 6},${endPoint.y - 12} ${endPoint.x},${endPoint.y - 2} ${endPoint.x + 6},${endPoint.y - 12}`);
            
            loadArrowText.setAttribute('x', endPoint.x);
            loadArrowText.setAttribute('y', endPoint.y - 45);
        }
    }

    // Helper: interpolate colors (hex to hex)
    function interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) factor = 0.5;
        
        // Parse hex colors
        const c1 = parseColor(color1);
        const c2 = parseColor(color2);

        const r = Math.round(c1.r + factor * (c2.r - c1.r));
        const g = Math.round(c1.g + factor * (c2.g - c1.g));
        const b = Math.round(c1.b + factor * (c2.b - c1.b));

        return `rgb(${r}, ${g}, ${b})`;
    }

    function parseColor(color) {
        if (color.startsWith('rgb')) {
            const arr = color.match(/\d+/g).map(Number);
            return { r: arr[0], g: arr[1], b: arr[2] };
        }
        if (color.startsWith('#')) {
            let hex = color.slice(1);
            if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
            const num = parseInt(hex, 16);
            return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
        }
        return { r: 120, g: 120, b: 120 }; // Fallback gray
    }

    // Event listeners
    materialSelect.addEventListener('change', calculateDeflection);
    supportSelect.addEventListener('change', calculateDeflection);
    lengthSlider.addEventListener('input', calculateDeflection);
    loadSlider.addEventListener('input', calculateDeflection);

    // Initial calculation
    calculateDeflection();

    // Redraw on theme change to ensure stroke contrast
    window.addEventListener('themeChanged', calculateDeflection);
}
