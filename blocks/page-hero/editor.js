(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls, MediaUpload,
            MediaUploadCheck }                     = wp.blockEditor;
    const { PanelBody, TextControl, Button }       = wp.components;

    registerBlockType('cesana/page-hero', {
        edit: function({ attributes, setAttributes }) {
            var title           = attributes.title;
            var subtitle        = attributes.subtitle;
            var backgroundImage = attributes.backgroundImage;
            var breadcrumbs     = attributes.breadcrumbs || [];

            function updateCrumb(index, key, value) {
                var updated = breadcrumbs.map(function(item, i) {
                    if (i === index) {
                        var copy = {};
                        for (var k in item) copy[k] = item[k];
                        copy[key] = value;
                        return copy;
                    }
                    return item;
                });
                setAttributes({ breadcrumbs: updated });
            }

            function removeCrumb(index) {
                setAttributes({ breadcrumbs: breadcrumbs.filter(function(_, i) { return i !== index; }) });
            }

            function addCrumb() {
                setAttributes({ breadcrumbs: breadcrumbs.concat([{ label: '', url: '' }]) });
            }

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
                    ),

                    el(PanelBody, { title: 'Breadcrumbs', initialOpen: false },
                        breadcrumbs.map(function(crumb, idx) {
                            return el('div', {
                                key: idx,
                                style: { marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #ddd' }
                            },
                                el('p', { style: { fontWeight: 600, marginBottom: '8px' } }, 'Elemento ' + (idx + 1)),
                                el(TextControl, {
                                    label: 'Etichetta',
                                    value: crumb.label || '',
                                    onChange: function(val) { updateCrumb(idx, 'label', val); }
                                }),
                                el(TextControl, {
                                    label: 'URL (vuoto per elemento corrente)',
                                    value: crumb.url || '',
                                    onChange: function(val) { updateCrumb(idx, 'url', val); }
                                }),
                                el(Button, {
                                    variant: 'tertiary',
                                    isSmall: true,
                                    isDestructive: true,
                                    onClick: function() { removeCrumb(idx); }
                                }, 'Elimina')
                            );
                        }),
                        el(Button, {
                            variant: 'primary',
                            onClick: addCrumb,
                            style: { width: '100%' }
                        }, '+ Aggiungi Breadcrumb')
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Page Hero'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        title
                            ? '\u201c' + title + '\u201d' + (breadcrumbs.length > 0 ? ' \u2014 ' + breadcrumbs.length + ' breadcrumbs' : '')
                            : 'Configura titolo e breadcrumbs dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
