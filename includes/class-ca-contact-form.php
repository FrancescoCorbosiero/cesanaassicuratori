<?php
/**
 * Contact Form Handler
 * Processes AJAX form submissions from the consultation-form block
 */

if (!defined('ABSPATH')) {
    exit;
}

class CA_Contact_Form
{
    public static function init()
    {
        add_action('wp_ajax_ca_contact_form', [__CLASS__, 'handle_submission']);
        add_action('wp_ajax_nopriv_ca_contact_form', [__CLASS__, 'handle_submission']);
    }

    public static function handle_submission()
    {
        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'ca_contact_form')) {
            wp_send_json_error('Errore di sicurezza. Ricarica la pagina e riprova.');
            return;
        }

        // Honeypot check
        if (!empty($_POST['website'])) {
            wp_send_json_error('Invio non valido.');
            return;
        }

        // Validate required fields
        $name = isset($_POST['name']) ? sanitize_text_field($_POST['name']) : '';
        $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
        $message = isset($_POST['message']) ? sanitize_textarea_field($_POST['message']) : '';

        if (empty($name) || empty($email) || empty($message)) {
            wp_send_json_error('Compila tutti i campi obbligatori.');
            return;
        }

        if (!is_email($email)) {
            wp_send_json_error('Inserisci un indirizzo email valido.');
            return;
        }

        // Optional fields
        $phone = isset($_POST['phone']) ? sanitize_text_field($_POST['phone']) : '';
        $subject = isset($_POST['subject']) ? sanitize_text_field($_POST['subject']) : '';

        // Build email
        $to = apply_filters('ca_contact_form_recipient', 'info@cesanaassicuratori.it');
        $subject_prefix = apply_filters('ca_contact_form_subject_prefix', '[Sito Web]');
        $email_subject = $subject_prefix . ' Richiesta consulenza da ' . $name;

        if (!empty($subject)) {
            $email_subject .= ' — ' . $subject;
        }

        $body = sprintf(
            "Nuova richiesta di consulenza dal sito web\n\n" .
            "Nome: %s\n" .
            "Email: %s\n" .
            "Telefono: %s\n" .
            "Oggetto: %s\n\n" .
            "Messaggio:\n%s\n\n" .
            "---\n" .
            "Inviato il: %s\n" .
            "IP: %s\n" .
            "Pagina: %s",
            $name,
            $email,
            $phone ?: '—',
            $subject ?: '—',
            $message,
            current_time('d/m/Y H:i'),
            isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '—',
            isset($_SERVER['HTTP_REFERER']) ? esc_url_raw($_SERVER['HTTP_REFERER']) : '—'
        );

        $headers = [
            'From: Cesana Assicuratori <noreply@cesanaassicuratori.it>',
            'Reply-To: ' . $name . ' <' . $email . '>',
            'Content-Type: text/plain; charset=UTF-8',
        ];

        $sent = wp_mail($to, $email_subject, $body, $headers);

        if ($sent) {
            wp_send_json_success('Grazie! La tua richiesta è stata inviata. Ti ricontatteremo entro 24 ore.');
        } else {
            wp_send_json_error('Si è verificato un errore nell\'invio. Contattaci direttamente al 039.484346.');
        }
    }
}
