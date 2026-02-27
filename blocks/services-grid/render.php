<?php
/**
 * Services Grid Block - Server-side render
 * Responsive card grid for insurance product categories
 */

$title    = $attributes['title'] ?? 'I Nostri Servizi';
$subtitle = $attributes['subtitle'] ?? '';
$services = $attributes['services'] ?? [];
$columns  = $attributes['columns'] ?? 3;

if (empty($services)) {
    return;
}

$icons = [
    'building' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>',
    'tool' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
    'shop' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>',
    'stethoscope' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6 6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/><path d="M8 15v1a6 6 0 006 6 6 6 0 006-6v-4"/><circle cx="20" cy="10" r="2"/></svg>',
    'lock' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
    'car' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h14v-5H5v5zM2 12l3-7h14l3 7"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>',
    'heart' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
    'briefcase' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
    'plane' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
    'shield' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'file-text' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
    'truck' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
];

$col_class = 'ca-services-grid__grid--' . $columns . 'col';
?>
<section class="ca-block ca-services-grid">
    <div class="ca-services-grid__container">
        <div class="ca-services-grid__header" data-ca-reveal="up">
            <h2 class="ca-services-grid__title"><?php echo esc_html($title); ?></h2>
            <?php if (!empty($subtitle)) : ?>
                <p class="ca-services-grid__subtitle"><?php echo esc_html($subtitle); ?></p>
            <?php endif; ?>
        </div>

        <div class="ca-services-grid__grid <?php echo esc_attr($col_class); ?>">
            <?php foreach ($services as $index => $service) : ?>
                <?php
                $tag = !empty($service['url']) ? 'a' : 'div';
                $href = !empty($service['url']) ? ' href="' . esc_url($service['url']) . '"' : '';
                ?>
                <<?php echo $tag; ?><?php echo $href; ?> class="ca-service-card" data-ca-reveal="up" data-ca-reveal-delay="<?php echo $index * 80; ?>">
                    <div class="ca-service-card__icon">
                        <?php
                        $icon_key = $service['icon'] ?? 'shield';
                        echo isset($icons[$icon_key]) ? $icons[$icon_key] : $icons['shield'];
                        ?>
                    </div>

                    <?php if (!empty($service['title'])) : ?>
                        <h3 class="ca-service-card__title"><?php echo esc_html($service['title']); ?></h3>
                    <?php endif; ?>

                    <?php if (!empty($service['description'])) : ?>
                        <p class="ca-service-card__desc"><?php echo esc_html($service['description']); ?></p>
                    <?php endif; ?>

                    <?php if (!empty($service['url'])) : ?>
                        <span class="ca-service-card__link">Scopri di pi&ugrave; &rarr;</span>
                    <?php endif; ?>
                </<?php echo $tag; ?>>
            <?php endforeach; ?>
        </div>
    </div>
</section>
