(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls, MediaUpload,
            MediaUploadCheck }                     = wp.blockEditor;
    const { PanelBody, TextControl, RangeControl,
            ToggleControl, Button }                = wp.components;

    registerBlockType('cesana/hero-banner', {
        edit: function({ attributes, setAttributes }) {
            var slides     = attributes.slides || [];
            var autoplay   = attributes.autoplay;
            var showDots   = attributes.showDots;
            var showArrows = attributes.showArrows;

            function updateSlide(index, key, value) {
                var updated = slides.map(function(s, i) {
                    if (i === index) {
                        var copy = {};
                        for (var k in s) copy[k] = s[k];
                        copy[key] = value;
                        return copy;
                    }
                    return s;
                });
                setAttributes({ slides: updated });
            }

            function removeSlide(index) {
                setAttributes({ slides: slides.filter(function(_, i) { return i !== index; }) });
            }

            function addSlide() {
                setAttributes({ slides: slides.concat([{ image: '', eyebrow: '', title: '', subtitle: '', buttonText: '', buttonUrl: '' }]) });
            }

            function moveSlide(from, to) {
                if (to < 0 || to >= slides.length) return;
                var arr = slides.slice();
                var item = arr.splice(from, 1)[0];
                arr.splice(to, 0, item);
                setAttributes({ slides: arr });
            }

            return el(Fragment, null,

                // ── Sidebar ──────────────────────────────────────────────
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Impostazioni Slider', initialOpen: true },
                        el(RangeControl, {
                            label: 'Autoplay (ms)',
                            value: autoplay,
                            min: 2000,
                            max: 15000,
                            step: 500,
                            onChange: function(val) { setAttributes({ autoplay: val }); }
                        }),
                        el(ToggleControl, {
                            label: 'Mostra indicatori',
                            checked: showDots,
                            onChange: function(val) { setAttributes({ showDots: val }); }
                        }),
                        el(ToggleControl, {
                            label: 'Mostra frecce',
                            checked: showArrows,
                            onChange: function(val) { setAttributes({ showArrows: val }); }
                        })
                    ),

                    slides.map(function(slide, idx) {
                        return el(PanelBody, {
                            key: idx,
                            title: 'Slide ' + (idx + 1) + (slide.title ? ' \u2014 ' + slide.title : ''),
                            initialOpen: false
                        },
                            // Image
                            el('div', { style: { marginBottom: '16px' } },
                                el('p', { style: { marginBottom: '8px', fontWeight: 600 } }, 'Immagine di sfondo'),
                                el(MediaUploadCheck, null,
                                    el(MediaUpload, {
                                        onSelect: function(media) { updateSlide(idx, 'image', media.url); },
                                        allowedTypes: ['image'],
                                        value: slide.image,
                                        render: function(obj) {
                                            return el(Fragment, null,
                                                slide.image
                                                    ? el('img', { src: slide.image, style: { width: '100%', marginBottom: '8px', borderRadius: '4px' } })
                                                    : null,
                                                el(Button, {
                                                    onClick: obj.open,
                                                    variant: slide.image ? 'secondary' : 'primary',
                                                    style: { width: '100%' }
                                                }, slide.image ? 'Cambia immagine' : 'Seleziona immagine'),
                                                slide.image
                                                    ? el(Button, {
                                                        onClick: function() { updateSlide(idx, 'image', ''); },
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
                                label: 'Eyebrow',
                                value: slide.eyebrow || '',
                                onChange: function(val) { updateSlide(idx, 'eyebrow', val); }
                            }),
                            el(TextControl, {
                                label: 'Titolo',
                                value: slide.title || '',
                                onChange: function(val) { updateSlide(idx, 'title', val); }
                            }),
                            el(TextControl, {
                                label: 'Sottotitolo',
                                value: slide.subtitle || '',
                                onChange: function(val) { updateSlide(idx, 'subtitle', val); }
                            }),
                            el(TextControl, {
                                label: 'Testo pulsante',
                                value: slide.buttonText || '',
                                onChange: function(val) { updateSlide(idx, 'buttonText', val); }
                            }),
                            el(TextControl, {
                                label: 'URL pulsante',
                                value: slide.buttonUrl || '',
                                onChange: function(val) { updateSlide(idx, 'buttonUrl', val); }
                            }),

                            el('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } },
                                el(Button, {
                                    variant: 'secondary',
                                    isSmall: true,
                                    disabled: idx === 0,
                                    onClick: function() { moveSlide(idx, idx - 1); }
                                }, '\u2191'),
                                el(Button, {
                                    variant: 'secondary',
                                    isSmall: true,
                                    disabled: idx === slides.length - 1,
                                    onClick: function() { moveSlide(idx, idx + 1); }
                                }, '\u2193'),
                                el(Button, {
                                    variant: 'tertiary',
                                    isSmall: true,
                                    isDestructive: true,
                                    onClick: function() { removeSlide(idx); }
                                }, 'Elimina')
                            )
                        );
                    }),

                    el(PanelBody, { title: 'Aggiungi Slide', initialOpen: false },
                        el(Button, {
                            variant: 'primary',
                            onClick: addSlide,
                            style: { width: '100%' }
                        }, '+ Aggiungi Slide')
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M4 4h16v12H4V4zm0 14h16v2H4v-2z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Hero Banner'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        slides.length > 0
                            ? slides.length + ' slide configurate \u2014 autoplay ' + (autoplay / 1000).toFixed(1) + 's'
                            : 'Aggiungi slide dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
