(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls, MediaUpload,
            MediaUploadCheck }                     = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl,
            Button }                               = wp.components;

    registerBlockType('cesana/cta-banner', {
        edit: function({ attributes, setAttributes }) {
            var eyebrow         = attributes.eyebrow;
            var title           = attributes.title;
            var text            = attributes.text;
            var buttonText      = attributes.buttonText;
            var buttonUrl       = attributes.buttonUrl;
            var backgroundImage = attributes.backgroundImage;
            var variant         = attributes.variant;

            return el(Fragment, null,

                // ── Sidebar ──────────────────────────────────────────────
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Contenuti', initialOpen: true },
                        el(TextControl, {
                            label: 'Eyebrow',
                            value: eyebrow,
                            onChange: function(val) { setAttributes({ eyebrow: val }); }
                        }),
                        el(TextControl, {
                            label: 'Titolo',
                            value: title,
                            onChange: function(val) { setAttributes({ title: val }); }
                        }),
                        el(TextControl, {
                            label: 'Testo',
                            value: text,
                            onChange: function(val) { setAttributes({ text: val }); }
                        }),
                        el(TextControl, {
                            label: 'Testo pulsante',
                            value: buttonText,
                            onChange: function(val) { setAttributes({ buttonText: val }); }
                        }),
                        el(TextControl, {
                            label: 'URL pulsante',
                            value: buttonUrl,
                            onChange: function(val) { setAttributes({ buttonUrl: val }); }
                        })
                    ),
                    el(PanelBody, { title: 'Aspetto', initialOpen: false },
                        el(SelectControl, {
                            label: 'Variante',
                            value: variant,
                            options: [
                                { label: 'Navy', value: 'navy' },
                                { label: 'Oro', value: 'gold' },
                                { label: 'Chiaro', value: 'light' }
                            ],
                            onChange: function(val) { setAttributes({ variant: val }); }
                        }),

                        // Background image
                        el('div', { style: { marginTop: '16px' } },
                            el('p', { style: { marginBottom: '8px', fontWeight: 600 } }, 'Immagine di sfondo'),
                            el(MediaUploadCheck, null,
                                el(MediaUpload, {
                                    onSelect: function(media) { setAttributes({ backgroundImage: media.url }); },
                                    allowedTypes: ['image'],
                                    value: backgroundImage,
                                    render: function(obj) {
                                        return el(Fragment, null,
                                            backgroundImage
                                                ? el('img', { src: backgroundImage, style: { width: '100%', marginBottom: '8px', borderRadius: '4px' } })
                                                : null,
                                            el(Button, {
                                                onClick: obj.open,
                                                variant: backgroundImage ? 'secondary' : 'primary',
                                                style: { width: '100%' }
                                            }, backgroundImage ? 'Cambia immagine' : 'Seleziona immagine'),
                                            backgroundImage
                                                ? el(Button, {
                                                    onClick: function() { setAttributes({ backgroundImage: '' }); },
                                                    variant: 'tertiary',
                                                    isDestructive: true,
                                                    style: { width: '100%', marginTop: '4px' }
                                                  }, 'Rimuovi immagine')
                                                : null
                                        );
                                    }
                                })
                            )
                        )
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M18 11v2h4v-2h-4zm-2 6.46l2.95 2.09.81-1.29-2.95-2.09-.81 1.29zM20.24 5.46l-.81-1.29-2.95 2.09.81 1.29 2.95-2.09zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'CTA Banner'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        title
                            ? '\u201c' + title + '\u201d \u2014 variante ' + variant
                            : 'Configura il banner dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
