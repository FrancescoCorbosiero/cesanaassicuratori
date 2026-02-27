<?php
/**
 * CTA Banner Block - Server-side render
 * Full-width call-to-action with navy, gold, and light variants
 */

$eyebrow    = $attributes['eyebrow'] ?? '';
$title      = $attributes['title'] ?? '';
$text       = $attributes['text'] ?? '';
$button_text = $attributes['buttonText'] ?? 'Contattaci';
$button_url  = $attributes['buttonUrl'] ?? '';
$bg_image   = $attributes['backgroundImage'] ?? '';
$variant    = $attributes['variant'] ?? 'navy';

if (empty($title)) {
    return;
}

$variant_class = 'ca-cta-banner--' . $variant;

// Determine button variant based on banner variant
$btn_class = 'ca-btn ca-btn--large';
switch ($variant) {
    case 'navy':
        $btn_class .= ' ca-btn--gold';
        break;
    case 'gold':
        $btn_class .= ' ca-btn--primary';
        break;
    case 'light':
        $btn_class .= ' ca-btn--gold';
        break;
}
?>
<section class="ca-block ca-cta-banner <?php echo esc_attr($variant_class); ?>">
    <?php if (!empty($bg_image)) : ?>
        <div class="ca-cta-banner__bg">
            <img src="<?php echo esc_url($bg_image); ?>" alt="" loading="lazy">
        </div>
        <div class="ca-cta-banner__overlay"></div>
    <?php endif; ?>

    <div class="ca-cta-banner__content" data-ca-reveal="up">
        <?php if (!empty($eyebrow)) : ?>
            <span class="ca-cta-banner__eyebrow"><?php echo esc_html($eyebrow); ?></span>
        <?php endif; ?>

        <h2 class="ca-cta-banner__title"><?php echo esc_html($title); ?></h2>

        <?php if (!empty($text)) : ?>
            <p class="ca-cta-banner__text"><?php echo esc_html($text); ?></p>
        <?php endif; ?>

        <?php if (!empty($button_url) && !empty($button_text)) : ?>
            <a href="<?php echo esc_url($button_url); ?>" class="<?php echo esc_attr($btn_class); ?>">
                <?php echo esc_html($button_text); ?>
            </a>
        <?php endif; ?>
    </div>
</section>
