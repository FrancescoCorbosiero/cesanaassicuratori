<?php
/**
 * Page Hero Block - Server-side render
 * Inner page header with breadcrumbs and title
 */

$title       = $attributes['title'] ?? '';
$subtitle    = $attributes['subtitle'] ?? '';
$bg_image    = $attributes['backgroundImage'] ?? '';
$breadcrumbs = $attributes['breadcrumbs'] ?? [];

if (empty($title)) {
    return;
}
?>
<section class="ca-block ca-page-hero">
    <?php if (!empty($bg_image)) : ?>
        <div class="ca-page-hero__bg">
            <img src="<?php echo esc_url($bg_image); ?>" alt="" loading="eager">
        </div>
    <?php endif; ?>
    <div class="ca-page-hero__overlay"></div>

    <div class="ca-page-hero__content">
        <?php if (!empty($breadcrumbs)) : ?>
            <nav class="ca-page-hero__breadcrumbs" aria-label="Breadcrumb">
                <?php foreach ($breadcrumbs as $i => $crumb) : ?>
                    <?php if ($i > 0) : ?>
                        <span class="ca-page-hero__breadcrumb-sep" aria-hidden="true">/</span>
                    <?php endif; ?>

                    <?php if (!empty($crumb['url']) && $i < count($breadcrumbs) - 1) : ?>
                        <a href="<?php echo esc_url($crumb['url']); ?>"><?php echo esc_html($crumb['label']); ?></a>
                    <?php else : ?>
                        <span aria-current="page"><?php echo esc_html($crumb['label']); ?></span>
                    <?php endif; ?>
                <?php endforeach; ?>
            </nav>
        <?php endif; ?>

        <h1 class="ca-page-hero__title"><?php echo esc_html($title); ?></h1>

        <?php if (!empty($subtitle)) : ?>
            <p class="ca-page-hero__subtitle"><?php echo esc_html($subtitle); ?></p>
        <?php endif; ?>
    </div>
</section>
