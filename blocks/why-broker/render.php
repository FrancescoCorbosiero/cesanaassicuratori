<?php
/**
 * Why Broker Block - Server-side render
 * Editorial asymmetric layout with oversized ghost numbers
 */

$eyebrow  = $attributes['eyebrow'] ?? 'Perché un Broker';
$title    = $attributes['title'] ?? 'Perché Scegliere Cesana Assicuratori';
$subtitle = $attributes['subtitle'] ?? '';
$reasons  = $attributes['reasons'] ?? [];

if (empty($reasons)) {
    return;
}

$icons = [
    'balance'    => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v18M3 12l9-9 9 9"/><path d="M3 18h6M15 18h6"/><path d="M6 15l-3 3M6 21l-3-3M18 15l3 3M18 21l3-3"/></svg>',
    'eye'        => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    'handshake'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>',
    'target'     => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    'shield'     => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'chart'      => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
    'compass'    => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    'users'      => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
];
?>
<section class="ca-block ca-why-broker">
    <div class="ca-why-broker__container">
        <div class="ca-why-broker__header" data-ca-reveal="up">
            <?php if (!empty($eyebrow)) : ?>
                <span class="ca-why-broker__eyebrow"><?php echo esc_html($eyebrow); ?></span>
            <?php endif; ?>
            <h2 class="ca-why-broker__title" data-ca-text-reveal="words"><?php echo esc_html($title); ?></h2>
            <?php if (!empty($subtitle)) : ?>
                <p class="ca-why-broker__subtitle"><?php echo esc_html($subtitle); ?></p>
            <?php endif; ?>
        </div>

        <div class="ca-why-broker__grid" data-ca-stagger data-ca-stagger-delay="100">
            <?php foreach ($reasons as $index => $reason) : ?>
                <?php $number = str_pad($index + 1, 2, '0', STR_PAD_LEFT); ?>
                <div class="ca-why-broker__item">
                    <span class="ca-why-broker__number" aria-hidden="true"><?php echo esc_html($number); ?></span>

                    <?php
                    $icon_key = $reason['icon'] ?? 'shield';
                    if (isset($icons[$icon_key])) : ?>
                        <div class="ca-why-broker__item-icon" data-ca-magnetic>
                            <?php echo $icons[$icon_key]; ?>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($reason['title'])) : ?>
                        <h3 class="ca-why-broker__item-title"><?php echo esc_html($reason['title']); ?></h3>
                    <?php endif; ?>

                    <?php if (!empty($reason['description'])) : ?>
                        <p class="ca-why-broker__item-desc"><?php echo esc_html($reason['description']); ?></p>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
