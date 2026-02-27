(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls, MediaUpload,
            MediaUploadCheck }                     = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl,
            RangeControl, Button }                 = wp.components;

    registerBlockType('cesana/testimonials', {
        edit: function({ attributes, setAttributes }) {
            var eyebrow      = attributes.eyebrow;
            var title        = attributes.title;
            var testimonials = attributes.testimonials || [];
            var autoplay     = attributes.autoplay;

            function updateItem(index, key, value) {
                var updated = testimonials.map(function(item, i) {
                    if (i === index) {
                        var copy = {};
                        for (var k in item) copy[k] = item[k];
                        copy[key] = value;
                        return copy;
                    }
                    return item;
                });
                setAttributes({ testimonials: updated });
            }

            function removeItem(index) {
                setAttributes({ testimonials: testimonials.filter(function(_, i) { return i !== index; }) });
            }

            function addItem() {
                setAttributes({ testimonials: testimonials.concat([{ quote: '', author: '', role: '', photo: '' }]) });
            }

            function moveItem(from, to) {
                if (to < 0 || to >= testimonials.length) return;
                var arr = testimonials.slice();
                var item = arr.splice(from, 1)[0];
                arr.splice(to, 0, item);
                setAttributes({ testimonials: arr });
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
                        el(RangeControl, {
                            label: 'Autoplay (ms)',
                            value: autoplay,
                            min: 2000,
                            max: 12000,
                            step: 500,
                            onChange: function(val) { setAttributes({ autoplay: val }); }
                        })
                    ),

                    testimonials.map(function(t, idx) {
                        return el(PanelBody, {
                            key: idx,
                            title: 'Testimonianza ' + (idx + 1) + (t.author ? ' \u2014 ' + t.author : ''),
                            initialOpen: false
                        },
                            el(TextareaControl, {
                                label: 'Citazione',
                                value: t.quote || '',
                                rows: 3,
                                onChange: function(val) { updateItem(idx, 'quote', val); }
                            }),
                            el(TextControl, {
                                label: 'Autore',
                                value: t.author || '',
                                onChange: function(val) { updateItem(idx, 'author', val); }
                            }),
                            el(TextControl, {
                                label: 'Ruolo / Azienda',
                                value: t.role || '',
                                onChange: function(val) { updateItem(idx, 'role', val); }
                            }),

                            // Photo
                            el('div', { style: { marginTop: '12px' } },
                                el('p', { style: { marginBottom: '8px', fontWeight: 600 } }, 'Foto'),
                                el(MediaUploadCheck, null,
                                    el(MediaUpload, {
                                        onSelect: function(media) { updateItem(idx, 'photo', media.url); },
                                        allowedTypes: ['image'],
                                        value: t.photo,
                                        render: function(obj) {
                                            return el(Fragment, null,
                                                t.photo
                                                    ? el('img', { src: t.photo, style: { width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px' } })
                                                    : null,
                                                el(Button, {
                                                    onClick: obj.open,
                                                    variant: t.photo ? 'secondary' : 'primary',
                                                    isSmall: true
                                                }, t.photo ? 'Cambia foto' : 'Seleziona foto'),
                                                t.photo
                                                    ? el(Button, {
                                                        onClick: function() { updateItem(idx, 'photo', ''); },
                                                        variant: 'tertiary',
                                                        isSmall: true,
                                                        isDestructive: true,
                                                        style: { marginLeft: '8px' }
                                                      }, 'Rimuovi')
                                                    : null
                                            );
                                        }
                                    })
                                )
                            ),

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
                                    disabled: idx === testimonials.length - 1,
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

                    el(PanelBody, { title: 'Aggiungi Testimonianza', initialOpen: false },
                        el(Button, {
                            variant: 'primary',
                            onClick: addItem,
                            style: { width: '100%' }
                        }, '+ Aggiungi Testimonianza')
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder ca-editor-placeholder--dark' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Testimonials Slider'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        testimonials.length > 0
                            ? testimonials.length + ' testimonianze \u2014 autoplay ' + (autoplay / 1000).toFixed(1) + 's'
                            : 'Aggiungi testimonianze dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
