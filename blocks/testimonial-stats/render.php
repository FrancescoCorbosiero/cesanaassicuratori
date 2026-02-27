<?php
/**
 * Testimonial Stats Block - Server-side render
 * Animated counter statistics section
 */

$title   = $attributes['title'] ?? '';
$stats   = $attributes['stats'] ?? [];
$variant = $attributes['variant'] ?? 'navy';

if (empty($stats)) {
    return;
}

$variant_class = 'ca-stats--' . $variant;
?>
<section class="ca-block ca-stats <?php echo esc_attr($variant_class); ?>">
    <div class="ca-stats__container">
        <?php if (!empty($title)) : ?>
            <h2 class="ca-stats__title" data-ca-reveal="up"><?php echo esc_html($title); ?></h2>
        <?php endif; ?>

        <div class="ca-stats__grid">
            <?php foreach ($stats as $index => $stat) : ?>
                <div class="ca-stats__item" data-ca-reveal="up" data-ca-reveal-delay="<?php echo $index * 80; ?>">
                    <div>
                        <span class="ca-stats__value" data-ca-counter="<?php echo esc_attr($stat['value'] ?? '0'); ?>">0</span>
                        <?php if (!empty($stat['suffix'])) : ?>
                            <span class="ca-stats__suffix"><?php echo esc_html($stat['suffix']); ?></span>
                        <?php endif; ?>
                    </div>
                    <?php if (!empty($stat['label'])) : ?>
                        <span class="ca-stats__label"><?php echo esc_html($stat['label']); ?></span>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
