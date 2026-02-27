(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls, MediaUpload,
            MediaUploadCheck }                     = wp.blockEditor;
    const { PanelBody, TextControl,
            RangeControl, Button }                 = wp.components;

    registerBlockType('cesana/page-loader', {
        edit: function({ attributes, setAttributes }) {
            const { logoUrl, tagline, duration } = attributes;

            return el(Fragment, null,

                // ── Sidebar panel ────────────────────────────────────────
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Impostazioni Loader', initialOpen: true },

                        // Logo — WP Media Library picker
                        el('div', { style: { marginBottom: '16px' } },
                            el('p', { style: { marginBottom: '8px', fontWeight: 600 } }, 'Logo'),
                            el(MediaUploadCheck, null,
                                el(MediaUpload, {
                                    onSelect: function(media) { setAttributes({ logoUrl: media.url }); },
                                    allowedTypes: ['image'],
                                    value: logoUrl,
                                    render: function({ open }) {
                                        return el(Fragment, null,
                                            logoUrl
                                                ? el('img', { src: logoUrl, style: { width: '100%', marginBottom: '8px', borderRadius: '4px' } })
                                                : null,
                                            el(Button,
                                                { onClick: open, variant: logoUrl ? 'secondary' : 'primary', style: { width: '100%' } },
                                                logoUrl ? 'Cambia logo' : 'Seleziona logo'
                                            ),
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

                        // Tagline
                        el(TextControl, {
                            label: 'Tagline',
                            value: tagline,
                            onChange: function(val) { setAttributes({ tagline: val }); }
                        }),

                        // Duration slider
                        el(RangeControl, {
                            label: 'Durata animazione (ms)',
                            value: duration,
                            min: 800,
                            max: 6000,
                            step: 200,
                            onChange: function(val) { setAttributes({ duration: val }); }
                        })
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder ca-editor-placeholder--dark' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Page Loader'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        tagline
                            ? '\u201c' + tagline + '\u201d \u2014 ' + (duration / 1000).toFixed(1) + 's'
                            : 'Splash screen animato. Visibile solo al primo caricamento.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
