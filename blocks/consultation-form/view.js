/**
 * cesana/consultation-form — Frontend Interactivity
 * Uses WordPress Interactivity API (wp-interactivity)
 * AJAX form submission with client-side validation
 */
import { store, getContext } from '@wordpress/interactivity';

const ajaxUrl = '/wp-json/cesana/v1/contact';

store('cesana/consultation-form', {
    state: {},
    actions: {
        async submitForm(event) {
            event.preventDefault();
            const ctx = getContext();

            // Reset state
            ctx.feedbackMessage = '';
            ctx.feedbackType = '';
            ctx.isSubmitting = true;

            const form = event.target;
            const formData = new FormData(form);

            // Honeypot check
            if (formData.get('website')) {
                ctx.isSubmitting = false;
                return;
            }

            // Client-side validation
            const name = (formData.get('name') || '').trim();
            const email = (formData.get('email') || '').trim();
            const message = (formData.get('message') || '').trim();

            if (!name || !email || !message) {
                ctx.feedbackMessage = 'Compila tutti i campi obbligatori.';
                ctx.feedbackType = 'error';
                ctx.isSubmitting = false;
                return;
            }

            // Email format check
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                ctx.feedbackMessage = 'Inserisci un indirizzo email valido.';
                ctx.feedbackType = 'error';
                ctx.isSubmitting = false;
                return;
            }

            // Privacy consent check
            var privacy = formData.get('privacy');
            if (!privacy) {
                ctx.feedbackMessage = 'Accetta l\'informativa sulla privacy per procedere.';
                ctx.feedbackType = 'error';
                ctx.isSubmitting = false;
                return;
            }

            try {
                const response = await fetch(ajaxUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: (formData.get('phone') || '').trim(),
                        subject: (formData.get('subject') || '').trim(),
                        message: message,
                    }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    ctx.feedbackMessage = data.message || 'Grazie! Ti ricontatteremo entro 24 ore.';
                    ctx.feedbackType = 'success';
                    form.reset();
                } else {
                    ctx.feedbackMessage = data.message || 'Si è verificato un errore. Riprova.';
                    ctx.feedbackType = 'error';
                }
            } catch (err) {
                ctx.feedbackMessage = 'Errore di connessione. Contattaci direttamente al 039.484346.';
                ctx.feedbackType = 'error';
            }

            ctx.isSubmitting = false;
        },

        updateField() {
            const ctx = getContext();
            // Clear feedback on field change
            if (ctx.feedbackType === 'error') {
                ctx.feedbackMessage = '';
                ctx.feedbackType = '';
            }
        },
    },
});
