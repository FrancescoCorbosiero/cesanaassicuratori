<?php
/**
 * Consultation Form Block - Server-side render
 * "Ottieni una consulenza gratuita" AJAX form — present on every product page
 */

$title      = $attributes['title'] ?? 'Ottieni una consulenza gratuita';
$subtitle   = $attributes['subtitle'] ?? 'Compila il modulo e ti ricontatteremo entro 24 ore.';
$privacy_url = $attributes['privacyUrl'] ?? '/privacy-policy';
$variant    = $attributes['variant'] ?? 'default';

$variant_class = $variant === 'dark' ? ' ca-consultation-form--dark' : '';
$form_id       = 'ca-form-' . wp_unique_id();
?>
<section class="ca-block ca-consultation-form<?php echo esc_attr($variant_class); ?>" id="consulenza">
    <div class="ca-consultation-form__container">
        <div class="ca-consultation-form__header" data-ca-reveal="up">
            <h2 class="ca-consultation-form__title"><?php echo esc_html($title); ?></h2>
            <?php if (!empty($subtitle)) : ?>
                <p class="ca-consultation-form__subtitle"><?php echo esc_html($subtitle); ?></p>
            <?php endif; ?>
        </div>

        <form class="ca-consultation-form__form" data-ca-contact-form id="<?php echo esc_attr($form_id); ?>" novalidate>
            <div class="ca-consultation-form__row">
                <div class="ca-consultation-form__field">
                    <label for="<?php echo esc_attr($form_id); ?>-name" class="ca-consultation-form__label">Nome e Cognome *</label>
                    <input type="text"
                           id="<?php echo esc_attr($form_id); ?>-name"
                           name="name"
                           required
                           autocomplete="name"
                           class="ca-consultation-form__input">
                </div>
                <div class="ca-consultation-form__field">
                    <label for="<?php echo esc_attr($form_id); ?>-email" class="ca-consultation-form__label">Email *</label>
                    <input type="email"
                           id="<?php echo esc_attr($form_id); ?>-email"
                           name="email"
                           required
                           autocomplete="email"
                           class="ca-consultation-form__input">
                </div>
            </div>

            <div class="ca-consultation-form__row">
                <div class="ca-consultation-form__field">
                    <label for="<?php echo esc_attr($form_id); ?>-phone" class="ca-consultation-form__label">Telefono</label>
                    <input type="tel"
                           id="<?php echo esc_attr($form_id); ?>-phone"
                           name="phone"
                           autocomplete="tel"
                           class="ca-consultation-form__input">
                </div>
                <div class="ca-consultation-form__field">
                    <label for="<?php echo esc_attr($form_id); ?>-subject" class="ca-consultation-form__label">Oggetto</label>
                    <input type="text"
                           id="<?php echo esc_attr($form_id); ?>-subject"
                           name="subject"
                           class="ca-consultation-form__input">
                </div>
            </div>

            <div class="ca-consultation-form__field ca-consultation-form__field--full">
                <label for="<?php echo esc_attr($form_id); ?>-message" class="ca-consultation-form__label">Messaggio *</label>
                <textarea id="<?php echo esc_attr($form_id); ?>-message"
                          name="message"
                          rows="5"
                          required
                          class="ca-consultation-form__textarea"></textarea>
            </div>

            <div class="ca-consultation-form__field ca-consultation-form__field--full">
                <label class="ca-consultation-form__checkbox">
                    <input type="checkbox" name="privacy" required>
                    <span>Ho letto e accetto la <a href="<?php echo esc_url($privacy_url); ?>" target="_blank" rel="noopener">Privacy Policy</a> *</span>
                </label>
            </div>

            <!-- Honeypot anti-spam -->
            <div class="ca-consultation-form__hp" aria-hidden="true">
                <input type="text" name="website" tabindex="-1" autocomplete="off">
            </div>

            <div class="ca-consultation-form__submit">
                <button type="submit" class="ca-btn ca-btn--gold ca-btn--large" data-ca-form-submit>
                    Invia Richiesta
                </button>
            </div>

            <div class="ca-consultation-form__feedback" data-ca-form-feedback aria-live="polite"></div>
        </form>
    </div>
</section>
