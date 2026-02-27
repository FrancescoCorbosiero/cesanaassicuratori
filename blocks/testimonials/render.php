<?php
/**
 * Testimonials Slider Block - Server-side render
 * Drag/swipe carousel with giant gold quote mark, peek effect, frosted dots
 */

$eyebrow      = $attributes['eyebrow'] ?? 'Testimonianze';
$title        = $attributes['title'] ?? 'Cosa Dicono i Nostri Clienti';
$testimonials = $attributes['testimonials'] ?? [];
$autoplay     = $attributes['autoplay'] ?? 6000;

if (empty($testimonials)) {
    return;
}

$block_id = 'ca-testimonials-' . wp_unique_id();

$quote_svg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z"/></svg>';

$prev_svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
$next_svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
?>
<section class="ca-block ca-testimonials"
    id="<?php echo esc_attr($block_id); ?>"
    data-ca-testimonial-slider
    data-ca-slider-autoplay="<?php echo esc_attr($autoplay); ?>">

    <div class="ca-testimonials__container">
        <!-- Giant decorative quote -->
        <span class="ca-testimonials__quote-deco" aria-hidden="true">&ldquo;</span>

        <div class="ca-testimonials__header" data-ca-reveal="fade">
            <span class="ca-testimonials__eyebrow"><?php echo esc_html($eyebrow); ?></span>
            <h2 class="ca-testimonials__title"><?php echo esc_html($title); ?></h2>
        </div>

        <!-- Slider viewport -->
        <div class="ca-testimonials__viewport">
            <div class="ca-testimonials__track" data-ca-slider-track>
                <?php foreach ($testimonials as $index => $t) : ?>
                    <div class="ca-testimonial-slide<?php echo $index === 0 ? ' ca-testimonial-slide--active' : ''; ?>"
                         data-ca-slider-slide>
                        <div class="ca-testimonial-slide__quote-icon">
                            <?php echo $quote_svg; ?>
                        </div>

                        <?php if (!empty($t['quote'])) : ?>
                            <blockquote class="ca-testimonial-slide__text">
                                <?php echo esc_html($t['quote']); ?>
                            </blockquote>
                        <?php endif; ?>

                        <div class="ca-testimonial-slide__author">
                            <div class="ca-testimonial-slide__photo<?php echo empty($t['photo']) ? ' ca-testimonial-slide__photo--placeholder' : ''; ?>">
                                <?php if (!empty($t['photo'])) : ?>
                                    <img src="<?php echo esc_url($t['photo']); ?>"
                                         alt="<?php echo esc_attr($t['author'] ?? ''); ?>"
                                         loading="lazy" width="56" height="56">
                                <?php else : ?>
                                    <?php echo mb_strtoupper(mb_substr($t['author'] ?? '?', 0, 1)); ?>
                                <?php endif; ?>
                            </div>
                            <div class="ca-testimonial-slide__info">
                                <?php if (!empty($t['author'])) : ?>
                                    <div class="ca-testimonial-slide__name"><?php echo esc_html($t['author']); ?></div>
                                <?php endif; ?>
                                <?php if (!empty($t['role'])) : ?>
                                    <div class="ca-testimonial-slide__role"><?php echo esc_html($t['role']); ?></div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Navigation -->
        <div class="ca-testimonials__nav">
            <button class="ca-testimonials__arrow" data-ca-slider-prev aria-label="Precedente">
                <?php echo $prev_svg; ?>
            </button>
            <div class="ca-testimonials__dots" data-ca-slider-dots></div>
            <button class="ca-testimonials__arrow" data-ca-slider-next aria-label="Successiva">
                <?php echo $next_svg; ?>
            </button>
        </div>
    </div>
</section>
