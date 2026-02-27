<?php
/**
 * Convenzioni Block - Server-side render
 * Image card gallery with frosted glass overlays and hover zoom
 */

$eyebrow     = $attributes['eyebrow'] ?? 'Convenzioni';
$title       = $attributes['title'] ?? 'Le Nostre Convenzioni';
$subtitle    = $attributes['subtitle'] ?? '';
$convenzioni = $attributes['convenzioni'] ?? [];

if (empty($convenzioni)) {
    return;
}

$arrow_svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
?>
<section class="ca-block ca-convenzioni">
    <div class="ca-convenzioni__container">
        <div class="ca-convenzioni__header" data-ca-reveal="up">
            <?php if (!empty($eyebrow)) : ?>
                <span class="ca-convenzioni__eyebrow"><?php echo esc_html($eyebrow); ?></span>
            <?php endif; ?>
            <h2 class="ca-convenzioni__title" data-ca-text-reveal="words"><?php echo esc_html($title); ?></h2>
            <?php if (!empty($subtitle)) : ?>
                <p class="ca-convenzioni__subtitle"><?php echo esc_html($subtitle); ?></p>
            <?php endif; ?>
        </div>

        <div class="ca-convenzioni__grid" data-ca-stagger data-ca-stagger-delay="80">
            <?php foreach ($convenzioni as $index => $conv) :
                $tag = !empty($conv['url']) ? 'a' : 'div';
                $href = !empty($conv['url']) ? ' href="' . esc_url($conv['url']) . '"' : '';
            ?>
                <<?php echo $tag; ?><?php echo $href; ?> class="ca-convenzione">
                    <div class="ca-convenzione__image-wrap">
                        <?php if (!empty($conv['image'])) : ?>
                            <img src="<?php echo esc_url($conv['image']); ?>"
                                 alt="<?php echo esc_attr($conv['title'] ?? ''); ?>"
                                 loading="lazy"
                                 width="400" height="400">
                        <?php else : ?>
                            <div style="width:100%;height:100%;background:linear-gradient(135deg,#16161F 0%,#0C0C14 100%);display:flex;align-items:center;justify-content:center;color:rgba(184,151,63,0.2);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="width:64px;height:64px;">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="ca-convenzione__overlay">
                        <?php if (!empty($conv['category'])) : ?>
                            <span class="ca-convenzione__category"><?php echo esc_html($conv['category']); ?></span>
                        <?php endif; ?>

                        <?php if (!empty($conv['title'])) : ?>
                            <h3 class="ca-convenzione__title"><?php echo esc_html($conv['title']); ?></h3>
                        <?php endif; ?>

                        <?php if (!empty($conv['description'])) : ?>
                            <p class="ca-convenzione__desc"><?php echo esc_html($conv['description']); ?></p>
                        <?php endif; ?>

                        <?php if (!empty($conv['url'])) : ?>
                            <span class="ca-convenzione__arrow">Scopri <?php echo $arrow_svg; ?></span>
                        <?php endif; ?>
                    </div>
                </<?php echo $tag; ?>>
            <?php endforeach; ?>
        </div>
    </div>
</section>
