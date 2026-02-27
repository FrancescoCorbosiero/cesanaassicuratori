/**
 * Cesana Assicuratori Blocks - Contact Form Handler
 * AJAX form submission with validation
 */

(function() {
    'use strict';

    const init = () => {
        document.querySelectorAll('[data-ca-contact-form]').forEach(form => {
            form.addEventListener('submit', handleSubmit);
        });
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('[data-ca-form-submit]');
        const feedback = form.querySelector('[data-ca-form-feedback]');

        if (!submitBtn || !feedback) return;

        // Check if already submitting
        if (submitBtn.classList.contains('ca-btn--loading')) return;

        // Client-side validation
        const name = form.querySelector('[name="name"]');
        const email = form.querySelector('[name="email"]');
        const message = form.querySelector('[name="message"]');
        const privacy = form.querySelector('[name="privacy"]');

        if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
            showFeedback(feedback, 'error', 'Compila tutti i campi obbligatori.');
            return;
        }

        if (!isValidEmail(email.value.trim())) {
            showFeedback(feedback, 'error', 'Inserisci un indirizzo email valido.');
            return;
        }

        if (privacy && !privacy.checked) {
            showFeedback(feedback, 'error', 'Devi accettare la Privacy Policy per procedere.');
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Invio in corso...';
        submitBtn.classList.add('ca-btn--loading');
        hideFeedback(feedback);

        try {
            const formData = new FormData(form);
            formData.append('action', 'ca_contact_form');
            formData.append('nonce', typeof cesanaForm !== 'undefined' ? cesanaForm.nonce : '');

            const ajaxUrl = typeof cesanaForm !== 'undefined' ? cesanaForm.ajaxUrl : '/wp-admin/admin-ajax.php';

            const response = await fetch(ajaxUrl, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                showFeedback(feedback, 'success', result.data || 'Richiesta inviata con successo! Ti ricontatteremo al più presto.');
                form.reset();
            } else {
                showFeedback(feedback, 'error', result.data || 'Si è verificato un errore. Riprova più tardi.');
            }
        } catch (err) {
            showFeedback(feedback, 'error', 'Errore di connessione. Verifica la tua connessione e riprova.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('ca-btn--loading');
        }
    }

    function showFeedback(el, type, message) {
        el.textContent = message;
        el.className = 'ca-consultation-form__feedback ca-consultation-form__feedback--' + type;
    }

    function hideFeedback(el) {
        el.textContent = '';
        el.className = 'ca-consultation-form__feedback';
        el.style.display = '';
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
