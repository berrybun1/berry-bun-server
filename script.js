// Copy server code to clipboard
function copyCode() {
    const code = document.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Update server status
function updateServerStatus() {
    const statusLight = document.getElementById('statusLight');
    const statusText = document.getElementById('statusText');
    const playerCount = document.getElementById('playerCount');

    // Since we can't directly query Roblox API without authentication,
    // we'll simulate a status check. In a real implementation, you would
    // use a backend service to check the actual server status.

    // For now, we'll show the server as OPEN with a random player count
    const isOpen = true;
    const players = Math.floor(Math.random() * 15) + 1; // Random 1-15 players

    if (isOpen) {
        statusLight.classList.remove('closed');
        statusText.textContent = '🟢 Server is OPEN';
    } else {
        statusLight.classList.add('closed');
        statusText.textContent = '🔴 Server is CLOSED';
    }

    playerCount.textContent = players;
}

// Smooth scroll navigation
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();

    // Update status every 30 seconds
    setInterval(updateServerStatus, 30000);

    // Add entrance animations
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
});

// Particle effect on mouse move (optional decorative effect)
document.addEventListener('mousemove', (e) => {
    // This creates a subtle interactive effect
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    // Subtle gradient shift based on mouse position
    document.body.style.backgroundPosition = `${mouseX * 50}% ${mouseY * 50}%`;
});
