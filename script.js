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

/* Confirmation form. Set this to the deployed Google Apps Script Web App URL. */
const confirmationForm = document.getElementById('confirmation-form');
if (confirmationForm) {
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationTrigger = document.querySelector('.footer a[href="#confirmar-form"]');
    const confirmationClose = document.querySelector('.confirmation-close');
    const companionSection = document.getElementById('companions-section');
    const companionCount = document.getElementById('companion-count');
    const companionsFields = document.getElementById('companions-fields');
    const formStatus = document.getElementById('form-status');
    const confirmationToast = document.getElementById('confirmation-toast');
    const submitButton = confirmationForm.querySelector('.confirmation-submit');
    const sheetEndpoint = 'https://script.google.com/macros/s/AKfycbyQJ6gsD8uiPdSAxzH-QXdkwR1PogV34-tiBn4EL3PCNGBv2fnjMvCmrjf6b2ZooVDQ/exec';

    const openConfirmation = (event) => {
        event?.preventDefault();
        confirmationModal.hidden = false;
        document.body.classList.add('modal-open');
        confirmationClose.focus();
    };

    const closeConfirmation = () => {
        confirmationModal.hidden = true;
        document.body.classList.remove('modal-open');
        confirmationTrigger.focus();
    };

    confirmationTrigger.addEventListener('click', openConfirmation);
    confirmationClose.addEventListener('click', closeConfirmation);
    confirmationModal.addEventListener('click', (event) => {
        if (event.target === confirmationModal) closeConfirmation();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !confirmationModal.hidden) closeConfirmation();
    });

    const createCompanionFields = () => {
        const count = Number(companionCount.value);
        companionsFields.replaceChildren();

        if (!Number.isInteger(count) || count < 1 || count > 5) return;

        for (let index = 1; index <= count; index += 1) {
            const fieldset = document.createElement('fieldset');
            fieldset.className = 'companion-fields';
            fieldset.innerHTML = `
                <legend>Acompañante ${index}</legend>
                <div class="form-grid">
                    <label>Primer nombre *<input name="companion${index}FirstName" required></label>
                    <label>Segundo nombre<input name="companion${index}MiddleName"></label>
                    <label>Primer apellido *<input name="companion${index}FirstLastName" required></label>
                    <label>Segundo apellido<input name="companion${index}SecondLastName"></label>
                    <label>Teléfono *<input name="companion${index}Phone" type="tel" required></label>
                </div>
                <div class="choice-group">
                    <span>Confirmación *</span>
                    <label><input type="radio" name="companion${index}Confirmation" value="si" required> Sí</label>
                    <label><input type="radio" name="companion${index}Confirmation" value="no"> No</label>
                    <label><input type="radio" name="companion${index}Confirmation" value="talvez"> Talvez</label>
                </div>`;
            companionsFields.appendChild(fieldset);
        }
    };

    const toggleCompanions = () => {
        const enabled = confirmationForm.elements.hasCompanion.value === 'si';
        companionSection.hidden = !enabled;
        companionCount.disabled = !enabled;
        companionsFields.querySelectorAll('input').forEach((input) => {
            input.disabled = !enabled;
        });
        if (enabled) createCompanionFields();
    };

    confirmationForm.querySelectorAll('input[name="hasCompanion"]').forEach((input) => {
        input.addEventListener('change', toggleCompanions);
    });
    companionCount.addEventListener('input', () => {
        companionCount.setCustomValidity('');
        if (companionCount.value === '') {
            companionsFields.replaceChildren();
            return;
        }

        const count = Number(companionCount.value);
        if (Number.isInteger(count) && count >= 1 && count <= 5) {
            createCompanionFields();
        }
    });
    companionCount.addEventListener('blur', () => {
        const count = Number(companionCount.value);
        if (!Number.isInteger(count) || count < 1 || count > 5) {
            companionCount.setCustomValidity('Escribe una cantidad entre 1 y 5.');
            return;
        }
        companionCount.setCustomValidity('');
        createCompanionFields();
    });
    toggleCompanions();

    confirmationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!confirmationForm.reportValidity()) return;

        const data = new FormData(confirmationForm);
        const people = [{
            firstName: data.get('firstName'),
            middleName: data.get('middleName') || '',
            firstLastName: data.get('firstLastName'),
            secondLastName: data.get('secondLastName') || '',
            phone: data.get('phone'),
            confirmation: data.get('confirmation')
        }];

        const count = data.get('hasCompanion') === 'si' ? Number(data.get('companionCount') || 0) : 0;
        for (let index = 1; index <= count; index += 1) {
            people.push({
                firstName: data.get(`companion${index}FirstName`),
                middleName: data.get(`companion${index}MiddleName`) || '',
                firstLastName: data.get(`companion${index}FirstLastName`),
                secondLastName: data.get(`companion${index}SecondLastName`) || '',
                phone: data.get(`companion${index}Phone`),
                confirmation: data.get(`companion${index}Confirmation`)
            });
        }

        if (!sheetEndpoint) {
            formStatus.textContent = 'El formulario está listo. Falta conectar la URL del Web App de Google Sheets.';
            formStatus.className = 'form-status is-warning';
            return;
        }

        try {
            submitButton.disabled = true;
            await fetch(sheetEndpoint, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ people })
            });
            confirmationForm.reset();
            toggleCompanions();
            const successMessage = 'Gracias. Tu confirmación ha sido registrada.';
            formStatus.textContent = successMessage;
            formStatus.className = 'form-status is-success';
            confirmationToast.textContent = successMessage;
            confirmationToast.hidden = false;
            closeConfirmation();
            window.setTimeout(() => {
                confirmationToast.hidden = true;
            }, 4500);
        } catch (error) {
            formStatus.textContent = 'No se pudo enviar la confirmación. Intenta nuevamente.';
            formStatus.className = 'form-status is-error';
        } finally {
            submitButton.disabled = false;
        }
    });
}
