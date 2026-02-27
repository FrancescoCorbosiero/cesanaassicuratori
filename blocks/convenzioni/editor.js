(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls, MediaUpload,
            MediaUploadCheck }                     = wp.blockEditor;
    const { PanelBody, TextControl, Button }       = wp.components;

    registerBlockType('cesana/convenzioni', {
        edit: function({ attributes, setAttributes }) {
            var eyebrow     = attributes.eyebrow;
            var title       = attributes.title;
            var subtitle    = attributes.subtitle;
            var convenzioni = attributes.convenzioni || [];

            function updateItem(index, key, value) {
                var updated = convenzioni.map(function(item, i) {
                    if (i === index) {
                        var copy = {};
                        for (var k in item) copy[k] = item[k];
                        copy[key] = value;
                        return copy;
                    }
                    return item;
                });
                setAttributes({ convenzioni: updated });
            }

            function removeItem(index) {
                setAttributes({ convenzioni: convenzioni.filter(function(_, i) { return i !== index; }) });
            }

            function addItem() {
                setAttributes({ convenzioni: convenzioni.concat([{ image: '', title: '', description: '', category: '', url: '' }]) });
            }

            function moveItem(from, to) {
                if (to < 0 || to >= convenzioni.length) return;
                var arr = convenzioni.slice();
                var item = arr.splice(from, 1)[0];
                arr.splice(to, 0, item);
                setAttributes({ convenzioni: arr });
            }

            return el(Fragment, null,

                // ── Sidebar ──────────────────────────────────────────────
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Intestazione', initialOpen: true },
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
                            label: 'Sottotitolo',
                            value: subtitle,
                            onChange: function(val) { setAttributes({ subtitle: val }); }
                        })
                    ),

                    convenzioni.map(function(conv, idx) {
                        return el(PanelBody, {
                            key: idx,
                            title: 'Convenzione ' + (idx + 1) + (conv.title ? ' \u2014 ' + conv.title : ''),
                            initialOpen: false
                        },
                            // Image
                            el('div', { style: { marginBottom: '16px' } },
                                el('p', { style: { marginBottom: '8px', fontWeight: 600 } }, 'Immagine'),
                                el(MediaUploadCheck, null,
                                    el(MediaUpload, {
                                        onSelect: function(media) { updateItem(idx, 'image', media.url); },
                                        allowedTypes: ['image'],
                                        value: conv.image,
                                        render: function(obj) {
                                            return el(Fragment, null,
                                                conv.image
                                                    ? el('img', { src: conv.image, style: { width: '100%', marginBottom: '8px', borderRadius: '4px' } })
                                                    : null,
                                                el(Button, {
                                                    onClick: obj.open,
                                                    variant: conv.image ? 'secondary' : 'primary',
                                                    style: { width: '100%' }
                                                }, conv.image ? 'Cambia immagine' : 'Seleziona immagine'),
                                                conv.image
                                                    ? el(Button, {
                                                        onClick: function() { updateItem(idx, 'image', ''); },
                                                        variant: 'tertiary',
                                                        isDestructive: true,
                                                        style: { width: '100%', marginTop: '4px' }
                                                      }, 'Rimuovi immagine')
                                                    : null
                                            );
                                        }
                                    })
                                )
                            ),

                            el(TextControl, {
                                label: 'Categoria',
                                value: conv.category || '',
                                onChange: function(val) { updateItem(idx, 'category', val); }
                            }),
                            el(TextControl, {
                                label: 'Titolo',
                                value: conv.title || '',
                                onChange: function(val) { updateItem(idx, 'title', val); }
                            }),
                            el(TextControl, {
                                label: 'Descrizione',
                                value: conv.description || '',
                                onChange: function(val) { updateItem(idx, 'description', val); }
                            }),
                            el(TextControl, {
                                label: 'URL',
                                value: conv.url || '',
                                onChange: function(val) { updateItem(idx, 'url', val); }
                            }),

                            el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } },
                                el(Button, {
                                    variant: 'secondary',
                                    isSmall: true,
                                    disabled: idx === 0,
                                    onClick: function() { moveItem(idx, idx - 1); }
                                }, '\u2191'),
                                el(Button, {
                                    variant: 'secondary',
                                    isSmall: true,
                                    disabled: idx === convenzioni.length - 1,
                                    onClick: function() { moveItem(idx, idx + 1); }
                                }, '\u2193'),
                                el(Button, {
                                    variant: 'tertiary',
                                    isSmall: true,
                                    isDestructive: true,
                                    onClick: function() { removeItem(idx); }
                                }, 'Elimina')
                            )
                        );
                    }),

                    el(PanelBody, { title: 'Aggiungi Convenzione', initialOpen: false },
                        el(Button, {
                            variant: 'primary',
                            onClick: addItem,
                            style: { width: '100%' }
                        }, '+ Aggiungi Convenzione')
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Convenzioni'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        convenzioni.length > 0
                            ? convenzioni.length + ' convenzioni configurate'
                            : 'Aggiungi convenzioni dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
