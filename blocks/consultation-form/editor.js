(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls }                    = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl } = wp.components;

    registerBlockType('cesana/consultation-form', {
        edit: function({ attributes, setAttributes }) {
            var title          = attributes.title;
            var subtitle       = attributes.subtitle;
            var recipientEmail = attributes.recipientEmail;
            var subjectPrefix  = attributes.subjectPrefix;
            var privacyUrl     = attributes.privacyUrl;
            var variant        = attributes.variant;

            return el(Fragment, null,

                // ── Sidebar ──────────────────────────────────────────────
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Contenuti', initialOpen: true },
                        el(TextControl, {
                            label: 'Titolo',
                            value: title,
                            onChange: function(val) { setAttributes({ title: val }); }
                        }),
                        el(TextControl, {
                            label: 'Sottotitolo',
                            value: subtitle,
                            onChange: function(val) { setAttributes({ subtitle: val }); }
                        })
                    ),
                    el(PanelBody, { title: 'Impostazioni Email', initialOpen: false },
                        el(TextControl, {
                            label: 'Email destinatario',
                            value: recipientEmail,
                            onChange: function(val) { setAttributes({ recipientEmail: val }); }
                        }),
                        el(TextControl, {
                            label: 'Prefisso oggetto',
                            value: subjectPrefix,
                            onChange: function(val) { setAttributes({ subjectPrefix: val }); }
                        })
                    ),
                    el(PanelBody, { title: 'Impostazioni Avanzate', initialOpen: false },
                        el(TextControl, {
                            label: 'URL Privacy Policy',
                            value: privacyUrl,
                            onChange: function(val) { setAttributes({ privacyUrl: val }); }
                        }),
                        el(SelectControl, {
                            label: 'Variante',
                            value: variant,
                            options: [
                                { label: 'Chiaro (default)', value: 'default' },
                                { label: 'Scuro', value: 'dark' }
                            ],
                            onChange: function(val) { setAttributes({ variant: val }); }
                        })
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder' + (variant === 'dark' ? ' ca-editor-placeholder--dark' : '') },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Consultation Form'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        title
                            ? '\u201c' + title + '\u201d \u2014 ' + recipientEmail
                            : 'Configura il form dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
