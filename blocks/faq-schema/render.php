<?php
/**
 * FAQ Schema Block - Server-side render
 * Accordion FAQ with JSON-LD structured data for SEO rich snippets
 */

$title          = $attributes['title'] ?? 'Domande Frequenti';
$subtitle       = $attributes['subtitle'] ?? '';
$items          = $attributes['items'] ?? [];
$allow_multiple = $attributes['allowMultiple'] ?? false;

if (empty($items)) {
    return;
}

// Generate JSON-LD Schema
$schema = [
    '@context'   => 'https://schema.org',
    '@type'      => 'FAQPage',
    'mainEntity' => [],
];

foreach ($items as $item) {
    if (!empty($item['question']) && !empty($item['answer'])) {
        $schema['mainEntity'][] = [
            '@type'          => 'Question',
            'name'           => $item['question'],
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text'  => wp_strip_all_tags($item['answer']),
            ],
        ];
    }
}

$faq_id = 'ca-faq-' . wp_unique_id();
?>
<section class="ca-block ca-faq" data-ca-faq<?php echo $allow_multiple ? ' data-ca-faq-multiple="true"' : ''; ?>>
    <div class="ca-faq__header" data-ca-reveal="up">
        <h2 class="ca-faq__title"><?php echo esc_html($title); ?></h2>
        <?php if (!empty($subtitle)) : ?>
            <p class="ca-faq__subtitle"><?php echo esc_html($subtitle); ?></p>
        <?php endif; ?>
    </div>

    <div class="ca-faq__list">
        <?php foreach ($items as $index => $item) : ?>
            <?php if (!empty($item['question']) && !empty($item['answer'])) : ?>
                <div class="ca-faq__item" data-ca-faq-item data-ca-reveal="up" data-ca-reveal-delay="<?php echo $index * 80; ?>">
                    <button class="ca-faq__trigger"
                            data-ca-faq-trigger
                            aria-expanded="false"
                            aria-controls="<?php echo esc_attr($faq_id); ?>-answer-<?php echo $index; ?>">
                        <span class="ca-faq__question"><?php echo esc_html($item['question']); ?></span>
                        <span class="ca-faq__icon" aria-hidden="true"></span>
                    </button>
                    <div class="ca-faq__content"
                         data-ca-faq-content
                         id="<?php echo esc_attr($faq_id); ?>-answer-<?php echo $index; ?>"
                         role="region"
                         aria-labelledby="<?php echo esc_attr($faq_id); ?>-q-<?php echo $index; ?>">
                        <div class="ca-faq__answer"><?php echo wp_kses_post($item['answer']); ?></div>
                    </div>
                </div>
            <?php endif; ?>
        <?php endforeach; ?>
    </div>
</section>

<script type="application/ld+json"><?php echo wp_json_encode($schema); ?></script>
