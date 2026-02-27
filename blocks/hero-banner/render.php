<?php
/**
 * Hero Banner Block - Server-side render
 * Full-height homepage hero with optional crossfade slides
 */

$slides     = $attributes['slides'] ?? [];
$autoplay   = $attributes['autoplay'] ?? 8000;
$show_dots  = $attributes['showDots'] ?? true;
$show_arrows = $attributes['showArrows'] ?? true;

if (empty($slides)) {
    return;
}

$block_id = 'ca-hero-' . wp_unique_id();
?>
<section class="ca-block ca-hero-banner"
    data-ca-hero-banner
    data-ca-hero-autoplay="<?php echo esc_attr($autoplay); ?>"
    id="<?php echo esc_attr($block_id); ?>">

    <?php foreach ($slides as $index => $slide) : ?>
        <div class="ca-hero-slide<?php echo $index === 0 ? ' ca-hero-slide--active' : ''; ?>" data-ca-hero-slide>
            <div class="ca-hero-slide__bg">
                <?php if (!empty($slide['image'])) : ?>
                    <img src="<?php echo esc_url($slide['image']); ?>"
                         alt=""
                         loading="<?php echo $index === 0 ? 'eager' : 'lazy'; ?>">
                <?php endif; ?>
            </div>
            <div class="ca-hero-slide__overlay"></div>

            <div class="ca-hero-slide__content">
                <?php if (!empty($slide['eyebrow'])) : ?>
                    <span class="ca-hero-slide__eyebrow"><?php echo esc_html($slide['eyebrow']); ?></span>
                <?php endif; ?>

                <?php if (!empty($slide['title'])) : ?>
                    <h1 class="ca-hero-slide__title"><?php echo esc_html($slide['title']); ?></h1>
                <?php endif; ?>

                <?php if (!empty($slide['subtitle'])) : ?>
                    <p class="ca-hero-slide__subtitle"><?php echo esc_html($slide['subtitle']); ?></p>
                <?php endif; ?>

                <?php if (!empty($slide['buttonUrl']) && !empty($slide['buttonText'])) : ?>
                    <div class="ca-hero-slide__cta">
                        <a href="<?php echo esc_url($slide['buttonUrl']); ?>" class="ca-btn ca-btn--gold ca-btn--large">
                            <?php echo esc_html($slide['buttonText']); ?>
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    <?php endforeach; ?>

    <?php if ($show_dots && count($slides) > 1) : ?>
        <nav class="ca-hero-nav" data-ca-hero-dots aria-label="Navigazione slides"></nav>
    <?php endif; ?>

    <?php if ($show_arrows && count($slides) > 1) : ?>
        <div class="ca-hero-arrows">
            <button class="ca-hero-arrow" data-ca-hero-prev aria-label="Slide precedente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <button class="ca-hero-arrow" data-ca-hero-next aria-label="Slide successiva">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    <?php endif; ?>
</section>
