<?php
/**
 * Logo Hero Block - Server-side render
 * Brand-focused hero with large logo, editorial tagline, and CTA
 */

$logo_url          = $attributes['logoUrl'] ?? '';
$title             = $attributes['title'] ?? 'Cesana Assicuratori';
$subtitle          = $attributes['subtitle'] ?? '';
$tagline           = $attributes['tagline'] ?? '';
$cta_text          = $attributes['ctaText'] ?? '';
$cta_url           = $attributes['ctaUrl'] ?? '#';
$secondary_text    = $attributes['secondaryCtaText'] ?? '';
$secondary_url     = $attributes['secondaryCtaUrl'] ?? '#';

$shield_svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
?>
<section class="ca-block ca-logo-hero" data-ca-logo-hero>
    <!-- Decorative background elements -->
    <div class="ca-logo-hero__bg-pattern" aria-hidden="true"></div>
    <div class="ca-logo-hero__corner ca-logo-hero__corner--tl" aria-hidden="true"></div>
    <div class="ca-logo-hero__corner ca-logo-hero__corner--tr" aria-hidden="true"></div>
    <div class="ca-logo-hero__corner ca-logo-hero__corner--bl" aria-hidden="true"></div>
    <div class="ca-logo-hero__corner ca-logo-hero__corner--br" aria-hidden="true"></div>

    <div class="ca-logo-hero__container">
        <!-- Subtitle / eyebrow -->
        <?php if (!empty($subtitle)) : ?>
            <span class="ca-logo-hero__eyebrow" data-ca-reveal="fade"><?php echo esc_html($subtitle); ?></span>
        <?php endif; ?>

        <!-- Logo or text brand -->
        <div class="ca-logo-hero__brand" data-ca-reveal="up">
            <?php if (!empty($logo_url)) : ?>
                <img class="ca-logo-hero__logo" src="<?php echo esc_url($logo_url); ?>" alt="<?php echo esc_attr($title); ?>">
            <?php else : ?>
                <div class="ca-logo-hero__shield" aria-hidden="true"><?php echo $shield_svg; ?></div>
                <h1 class="ca-logo-hero__title">
                    <span class="ca-logo-hero__title-line"><?php echo esc_html(explode(' ', $title)[0] ?? $title); ?></span>
                    <span class="ca-logo-hero__title-line ca-logo-hero__title-line--gold"><?php echo esc_html(implode(' ', array_slice(explode(' ', $title), 1)) ?: ''); ?></span>
                </h1>
            <?php endif; ?>
        </div>

        <!-- Gold divider -->
        <div class="ca-logo-hero__divider" data-ca-reveal="fade"></div>

        <!-- Tagline -->
        <?php if (!empty($tagline)) : ?>
            <p class="ca-logo-hero__tagline" data-ca-text-reveal="words"><?php echo esc_html($tagline); ?></p>
        <?php endif; ?>

        <!-- CTA -->
        <?php if (!empty($cta_text)) : ?>
            <div class="ca-logo-hero__cta" data-ca-reveal="up">
                <a href="<?php echo esc_url($cta_url); ?>" class="ca-btn ca-btn--gold ca-btn--large" data-ca-magnetic><?php echo esc_html($cta_text); ?></a>
                <?php if (!empty($secondary_text)) : ?>
                    <a href="<?php echo esc_url($secondary_url); ?>" class="ca-btn ca-btn--ghost-white ca-btn--large"><?php echo esc_html($secondary_text); ?></a>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>
</section>
