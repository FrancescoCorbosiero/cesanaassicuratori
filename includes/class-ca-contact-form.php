<?php
/**
 * Contact Form Handler — REST API
 * Processes form submissions from the consultation-form block via WP REST API.
 */

if (!defined('ABSPATH')) {
    exit;
}

class CA_Contact_Form
{
    const NAMESPACE = 'cesana/v1';

    public static function init()
    {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
    }

    public static function register_routes()
    {
        register_rest_route(self::NAMESPACE, '/contact', [
            'methods'             => 'POST',
            'callback'            => [__CLASS__, 'handle_submission'],
            'permission_callback' => '__return_true',
            'args'                => [
                'name'    => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
                'email'   => ['required' => true, 'sanitize_callback' => 'sanitize_email', 'validate_callback' => 'is_email'],
                'message' => ['required' => true, 'sanitize_callback' => 'sanitize_textarea_field'],
                'phone'   => ['sanitize_callback' => 'sanitize_text_field'],
                'subject' => ['sanitize_callback' => 'sanitize_text_field'],
            ],
        ]);
    }

    public static function handle_submission($request)
    {
        // Rate limiting via transient (5 submissions per IP per hour)
        $ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '');
        $rate_key = 'ca_form_rate_' . md5($ip);
        $attempts = (int) get_transient($rate_key);

        if ($attempts >= 5) {
            return new WP_Error('rate_limited', 'Troppe richieste. Riprova tra qualche minuto.', ['status' => 429]);
        }

        set_transient($rate_key, $attempts + 1, HOUR_IN_SECONDS);

        // Honeypot
        if (!empty($request->get_param('website'))) {
            return new WP_Error('invalid', 'Invio non valido.', ['status' => 400]);
        }

        // Extract validated params
        $name    = $request->get_param('name');
        $email   = $request->get_param('email');
        $message = $request->get_param('message');
        $phone   = $request->get_param('phone') ?: '';
        $subject = $request->get_param('subject') ?: '';

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
            $ip ?: '—',
            isset($_SERVER['HTTP_REFERER']) ? esc_url_raw($_SERVER['HTTP_REFERER']) : '—'
        );

        $headers = [
            'From: Cesana Assicuratori <noreply@cesanaassicuratori.it>',
            'Reply-To: ' . $name . ' <' . $email . '>',
            'Content-Type: text/plain; charset=UTF-8',
        ];

        $sent = wp_mail($to, $email_subject, $body, $headers);

        if ($sent) {
            return rest_ensure_response([
                'success' => true,
                'message' => 'Grazie! Ti ricontatteremo entro 24 ore.',
            ]);
        }

        return new WP_Error('send_failed', 'Si è verificato un errore nell\'invio. Contattaci direttamente al 039.484346.', ['status' => 500]);
    }
}
