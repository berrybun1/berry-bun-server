// Login credentials
const VALID_USERNAME = "Rio";
const VALID_PASSWORD = "stefanshi";

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const mainContent = document.getElementById('mainContent');
    const isLoggedIn = sessionStorage.getItem('berryBunLoggedIn');

    if (isLoggedIn) {
        loginModal.style.display = 'none';
        mainContent.style.display = 'block';
        initializeApp();
    }

    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginError');

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        sessionStorage.setItem('berryBunLoggedIn', 'true');
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        initializeApp();
    } else {
        errorMsg.textContent = '❌ Incorrect username or password! Try again.';
        errorMsg.classList.add('show');
        setTimeout(() => {
            errorMsg.classList.remove('show');
        }, 3000);
    }
}

// Handle logout
function handleLogout(event) {
    if (event) event.preventDefault();
    sessionStorage.removeItem('berryBunLoggedIn');
    location.reload();
}

// Initialize main app
function initializeApp() {
    loadServerStatus();
    loadAnnouncement();
    updateServerStatus();
    setupSmoothScroll();
    setupEntranceAnimations();
    
    // Update status every 30 seconds
    setInterval(updateServerStatus, 30000);
}

// Server Status Management
let serverStatusData = {
    status: 'open', // open, closed, opening
    message: '🎀 Server is OPEN! Join now! ✨',
    players: 8,
    maxPlayers: 15,
    timeValue: '',
    timeUnit: 'hours'
};

// Load server status from localStorage
function loadServerStatus() {
    const saved = localStorage.getItem('serverStatusData');
    if (saved) {
        serverStatusData = JSON.parse(saved);
    }
    displayServerStatus();
}

// Save server status to localStorage
function saveServerStatus() {
    localStorage.setItem('serverStatusData', JSON.stringify(serverStatusData));
}

// Display server status
function displayServerStatus() {
    const statusLight = document.getElementById('statusLight');
    const statusText = document.getElementById('statusText');
    const playerCount = document.getElementById('playerCount');
    const seatsAvailable = document.getElementById('seatsAvailable');
    const statusCard = document.querySelector('.status-card');

    // Update status light and text
    statusLight.classList.remove('closed', 'opening');
    
    if (serverStatusData.status === 'open') {
        statusLight.classList.remove('closed', 'opening');
        statusText.innerHTML = '🟢 Server is OPEN ✨ 🌸';
    } else if (serverStatusData.status === 'closed') {
        statusLight.classList.add('closed');
        statusText.innerHTML = '🔴 Server is CLOSED 💔';
    } else if (serverStatusData.status === 'opening') {
        statusLight.classList.add('opening');
        const timeStr = serverStatusData.timeValue ? `${serverStatusData.timeValue} ${serverStatusData.timeUnit}` : 'soon';
        statusText.innerHTML = `🟡 Opening in ${timeStr}... ⏰`;
    }

    // Update player count with cute display
    const seatsOpen = serverStatusData.maxPlayers - serverStatusData.players;
    playerCount.textContent = `${serverStatusData.players}/${serverStatusData.maxPlayers} 👥`;
    seatsAvailable.textContent = `${seatsOpen} 💺`;

    // Add edit button if not already there
    if (!statusCard.querySelector('.edit-toggle-btn')) {
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-toggle-btn';
        editBtn.innerHTML = '✏️ Edit Status';
        editBtn.onclick = toggleEditStatus;
        statusCard.appendChild(editBtn);
    }
}

// Toggle edit status mode
function toggleEditStatus() {
    const statusCard = document.querySelector('.status-card');
    
    if (statusCard.classList.contains('edit-mode')) {
        statusCard.classList.remove('edit-mode');
        displayServerStatus();
    } else {
        statusCard.classList.add('edit-mode');
        const statusIcon = statusCard.querySelector('.status-icon');
        const statusText = statusCard.querySelector('.status-text');
        
        statusIcon.style.display = 'none';
        statusText.style.display = 'none';
        
        const editHTML = `
            <div class="edit-status-container">
                <h3 style="color: #d4478a; margin-bottom: 1rem;">⚙️ Edit Server Status 🎀</h3>
                <div class="edit-status-group">
                    <label style="color: #d4478a; font-weight: 600;">Status:</label>
                    <select id="statusSelect" onchange="updateStatusDisplay()">
                        <option value="open" ${serverStatusData.status === 'open' ? 'selected' : ''}>🟢 OPEN</option>
                        <option value="closed" ${serverStatusData.status === 'closed' ? 'selected' : ''}>🔴 CLOSED</option>
                        <option value="opening" ${serverStatusData.status === 'opening' ? 'selected' : ''}>🟡 OPENING IN...</option>
                    </select>
                </div>
                <div id="timeInputs" style="display: ${serverStatusData.status === 'opening' ? 'flex' : 'none'};" class="edit-status-group">
                    <label style="color: #d4478a; font-weight: 600;">Time:</label>
                    <input type="number" id="timeValue" min="1" value="${serverStatusData.timeValue}" placeholder="Enter number">
                    <select id="timeUnit">
                        <option value="hours" ${serverStatusData.timeUnit === 'hours' ? 'selected' : ''}>Hours ⏰</option>
                        <option value="days" ${serverStatusData.timeUnit === 'days' ? 'selected' : ''}>Days 📅</option>
                        <option value="minutes" ${serverStatusData.timeUnit === 'minutes' ? 'selected' : ''}>Minutes ⏱️</option>
                    </select>
                </div>
                <div class="edit-status-group">
                    <label style="color: #d4478a; font-weight: 600;">Players Online:</label>
                    <input type="number" id="playerInput" min="0" max="100" value="${serverStatusData.players}">
                    <label style="color: #d4478a; font-weight: 600;">Max Players:</label>
                    <input type="number" id="maxPlayerInput" min="1" max="200" value="${serverStatusData.maxPlayers}">
                </div>
                <button class="save-status-btn" onclick="saveEditStatus()">💾 Save Status</button>
            </div>
        `;
        
        statusCard.innerHTML = editHTML;
        
        // Add event listener for status select change
        document.getElementById('statusSelect').addEventListener('change', () => {
            const timeInputs = document.getElementById('timeInputs');
            if (document.getElementById('statusSelect').value === 'opening') {
                timeInputs.style.display = 'flex';
            } else {
                timeInputs.style.display = 'none';
            }
        });
    }
}

// Update status display in edit mode
function updateStatusDisplay() {
    // This is called on select change
}

// Save edited status
function saveEditStatus() {
    const statusSelect = document.getElementById('statusSelect');
    const timeValue = document.getElementById('timeValue');
    const timeUnit = document.getElementById('timeUnit');
    const playerInput = document.getElementById('playerInput');
    const maxPlayerInput = document.getElementById('maxPlayerInput');

    serverStatusData.status = statusSelect.value;
    serverStatusData.timeValue = timeValue.value;
    serverStatusData.timeUnit = timeUnit.value;
    serverStatusData.players = parseInt(playerInput.value) || 0;
    serverStatusData.maxPlayers = parseInt(maxPlayerInput.value) || 15;

    saveServerStatus();
    displayServerStatus();
}

// Update server status dynamically
function updateServerStatus() {
    if (serverStatusData.status === 'open') {
        // Simulate slight player count changes
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        serverStatusData.players = Math.max(0, Math.min(serverStatusData.maxPlayers, serverStatusData.players + variation));
        saveServerStatus();
        displayServerStatus();
    }
}

// Announcement Management
let announcementData = {
    message: '🎀 Server is OPEN! Join now! ✨'
};

// Load announcement from localStorage
function loadAnnouncement() {
    const saved = localStorage.getItem('announcementData');
    if (saved) {
        announcementData = JSON.parse(saved);
    }
    displayAnnouncement();
}

// Save announcement to localStorage
function saveAnnouncement() {
    localStorage.setItem('announcementData', JSON.stringify(announcementData));
}

// Display announcement
function displayAnnouncement() {
    const joinSection = document.getElementById('join');
    let announcementBox = joinSection.querySelector('.announcement-box');

    if (!announcementBox) {
        announcementBox = document.createElement('div');
        announcementBox.className = 'announcement-box';
        joinSection.insertBefore(announcementBox, joinSection.querySelector('.join-button-container'));
    }

    announcementBox.innerHTML = `
        <div class="announcement-text">📢 ${announcementData.message}</div>
        <button class="edit-announcement-btn" onclick="toggleEditAnnouncement()">✏️ Edit Announcement</button>
    `;
}

// Toggle edit announcement mode
function toggleEditAnnouncement() {
    const announcementBox = document.querySelector('.announcement-box');
    
    if (announcementBox.classList.contains('edit-mode')) {
        announcementBox.classList.remove('edit-mode');
        displayAnnouncement();
    } else {
        announcementBox.classList.add('edit-mode');
        announcementBox.innerHTML = `
            <div class="edit-announcement-form">
                <label style="color: #d4478a; font-weight: 600;">Edit Announcement Message:</label>
                <textarea id="announcementInput" placeholder="Enter your announcement message...">${announcementData.message}</textarea>
                <div class="edit-announcement-buttons">
                    <button class="save-announcement-btn" onclick="saveEditAnnouncement()">💾 Save</button>
                    <button class="cancel-announcement-btn" onclick="cancelEditAnnouncement()">❌ Cancel</button>
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(212, 71, 138, 0.1); border-radius: 10px; color: #6b4e71; font-size: 0.9rem;">
                    <strong>💡 Cute Tips:</strong><br>
                    Use emojis like: 🎀 🌸 ✨ 💖 🐰 🍓 🫐 ♡ ෆ ✩ ✿ ★
                </div>
            </div>
        `;
        document.getElementById('announcementInput').focus();
    }
}

// Save edited announcement
function saveEditAnnouncement() {
    const announcementInput = document.getElementById('announcementInput');
    announcementData.message = announcementInput.value || '🎀 Server is OPEN! Join now! ✨';
    saveAnnouncement();
    displayAnnouncement();
}

// Cancel editing announcement
function cancelEditAnnouncement() {
    const announcementBox = document.querySelector('.announcement-box');
    announcementBox.classList.remove('edit-mode');
    displayAnnouncement();
}

// Copy server code to clipboard
function copyCode() {
    const code = document.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied to clipboard! 🎀';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Smooth scroll navigation
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup entrance animations
function setupEntranceAnimations() {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Particle effect on mouse move (optional decorative effect)
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    document.body.style.backgroundPosition = `${mouseX * 50}% ${mouseY * 50}%`;
});
