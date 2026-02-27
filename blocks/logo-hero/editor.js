(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls, MediaUpload,
            MediaUploadCheck }                     = wp.blockEditor;
    const { PanelBody, TextControl, Button }       = wp.components;

    registerBlockType('cesana/logo-hero', {
        edit: function({ attributes, setAttributes }) {
            var logoUrl          = attributes.logoUrl;
            var title            = attributes.title;
            var subtitle         = attributes.subtitle;
            var tagline          = attributes.tagline;
            var ctaText          = attributes.ctaText;
            var ctaUrl           = attributes.ctaUrl;
            var secondaryCtaText = attributes.secondaryCtaText;
            var secondaryCtaUrl  = attributes.secondaryCtaUrl;

            return el(Fragment, null,

                // ── Sidebar ──────────────────────────────────────────────
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Brand', initialOpen: true },
                        // Logo
                        el('div', { style: { marginBottom: '16px' } },
                            el('p', { style: { marginBottom: '8px', fontWeight: 600 } }, 'Logo'),
                            el(MediaUploadCheck, null,
                                el(MediaUpload, {
                                    onSelect: function(media) { setAttributes({ logoUrl: media.url }); },
                                    allowedTypes: ['image'],
                                    value: logoUrl,
                                    render: function(obj) {
                                        return el(Fragment, null,
                                            logoUrl
                                                ? el('img', { src: logoUrl, style: { width: '100%', marginBottom: '8px', borderRadius: '4px' } })
                                                : null,
                                            el(Button, {
                                                onClick: obj.open,
                                                variant: logoUrl ? 'secondary' : 'primary',
                                                style: { width: '100%' }
                                            }, logoUrl ? 'Cambia logo' : 'Seleziona logo'),
                                            logoUrl
                                                ? el(Button, {
                                                    onClick: function() { setAttributes({ logoUrl: '' }); },
                                                    variant: 'tertiary',
                                                    isDestructive: true,
                                                    style: { width: '100%', marginTop: '4px' }
                                                  }, 'Rimuovi logo')
                                                : null
                                        );
                                    }
                                })
                            )
                        ),

                        el(TextControl, {
                            label: 'Titolo',
                            value: title,
                            onChange: function(val) { setAttributes({ title: val }); }
                        }),
                        el(TextControl, {
                            label: 'Sottotitolo',
                            value: subtitle,
                            onChange: function(val) { setAttributes({ subtitle: val }); }
                        }),
                        el(TextControl, {
                            label: 'Tagline',
                            value: tagline,
                            onChange: function(val) { setAttributes({ tagline: val }); }
                        })
                    ),

                    el(PanelBody, { title: 'Call to Action', initialOpen: false },
                        el(TextControl, {
                            label: 'Testo CTA primaria',
                            value: ctaText,
                            onChange: function(val) { setAttributes({ ctaText: val }); }
                        }),
                        el(TextControl, {
                            label: 'URL CTA primaria',
                            value: ctaUrl,
                            onChange: function(val) { setAttributes({ ctaUrl: val }); }
                        }),
                        el(TextControl, {
                            label: 'Testo CTA secondaria',
                            value: secondaryCtaText,
                            onChange: function(val) { setAttributes({ secondaryCtaText: val }); }
                        }),
                        el(TextControl, {
                            label: 'URL CTA secondaria',
                            value: secondaryCtaUrl,
                            onChange: function(val) { setAttributes({ secondaryCtaUrl: val }); }
                        })
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder ca-editor-placeholder--dark' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Logo Hero'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        title
                            ? title + (tagline ? ' \u2014 \u201c' + tagline + '\u201d' : '')
                            : 'Configura il logo hero dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
