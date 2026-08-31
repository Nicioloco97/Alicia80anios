const countdownElement = document.getElementById('countdown');

if (countdownElement) {
    const targetDate = new Date(countdownElement.dataset.date).getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* Envelope open animation on index page */
const envelope = document.getElementById('envelope');
if (envelope) {
    const openEnvelope = () => {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            // focus the internal button so user can click or press Enter
            const link = envelope.querySelector('.btn-primary');
            if (link) link.focus();
        }
    };

    envelope.addEventListener('click', (e) => {
        // only open on clicks outside the internal button to avoid immediate navigation
        if (!e.target.classList.contains('btn-primary')) openEnvelope();
    });

    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openEnvelope();
        }
    });
}
