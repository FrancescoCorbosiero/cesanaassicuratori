<?php
/**
 * Page Loader Block - Server-side render
 * Full-screen splash with logo + tagline, shown once per session
 */

$logo_url = $attributes['logoUrl'] ?? '';
$tagline  = $attributes['tagline'] ?? 'Broker Assicurativo Indipendente';
$duration = $attributes['duration'] ?? 2800;
?>
<div class="ca-page-loader" data-ca-page-loader data-ca-loader-duration="<?php echo esc_attr($duration); ?>" aria-hidden="true">
    <div class="ca-page-loader__inner">
        <?php if (!empty($logo_url)) : ?>
            <img class="ca-page-loader__logo" src="<?php echo esc_url($logo_url); ?>" alt="Cesana Assicuratori">
        <?php else : ?>
            <div class="ca-page-loader__brand">
                <span class="ca-page-loader__name">CESANA</span>
                <span class="ca-page-loader__name ca-page-loader__name--gold">ASSICURATORI</span>
            </div>
        <?php endif; ?>

        <div class="ca-page-loader__divider"></div>

        <?php if (!empty($tagline)) : ?>
            <p class="ca-page-loader__tagline"><?php echo esc_html($tagline); ?></p>
        <?php endif; ?>
    </div>
</div>
