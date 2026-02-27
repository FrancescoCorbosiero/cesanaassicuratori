<?php
/**
 * Trust Indicators Block - Server-side render
 * Horizontal strip showing key trust metrics with inline SVG icons
 */

$indicators = $attributes['indicators'] ?? [];
$variant    = $attributes['variant'] ?? 'default';

if (empty($indicators)) {
    return;
}

$icons = [
    'shield' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
    'handshake' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-4-4-3 3-3-3-4 4 3 3-3 3 7 7 3-3 3 3 4-4-3-3z"/><path d="M14 14l-2-2"/></svg>',
    'chart' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
    'clock' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    'search' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    'scale' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M5 8l7-5 7 5M5 8l-2 8h6l-2-8M19 8l-2 8h6l-2-8"/></svg>',
    'star' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'users' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
];

$variant_class = $variant === 'dark' ? ' ca-trust-indicators--dark' : '';
?>
<section class="ca-block ca-trust-indicators<?php echo esc_attr($variant_class); ?>">
    <div class="ca-trust-indicators__container">
        <?php foreach ($indicators as $index => $indicator) : ?>
            <div class="ca-trust-indicator" data-ca-reveal="up" data-ca-reveal-delay="<?php echo $index * 80; ?>">
                <span class="ca-trust-indicator__icon">
                    <?php
                    $icon_key = $indicator['icon'] ?? 'shield';
                    echo isset($icons[$icon_key]) ? $icons[$icon_key] : $icons['shield'];
                    ?>
                </span>
                <div class="ca-trust-indicator__content">
                    <?php if (!empty($indicator['title'])) : ?>
                        <span class="ca-trust-indicator__title"><?php echo esc_html($indicator['title']); ?></span>
                    <?php endif; ?>
                    <?php if (!empty($indicator['description'])) : ?>
                        <span class="ca-trust-indicator__desc"><?php echo esc_html($indicator['description']); ?></span>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</section>
