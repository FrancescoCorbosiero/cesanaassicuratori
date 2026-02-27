(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls }                    = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl,
            ToggleControl, Button }                = wp.components;

    registerBlockType('cesana/faq-schema', {
        edit: function({ attributes, setAttributes }) {
            var title         = attributes.title;
            var subtitle      = attributes.subtitle;
            var items         = attributes.items || [];
            var allowMultiple = attributes.allowMultiple;

            function updateItem(index, key, value) {
                var updated = items.map(function(item, i) {
                    if (i === index) {
                        var copy = {};
                        for (var k in item) copy[k] = item[k];
                        copy[key] = value;
                        return copy;
                    }
                    return item;
                });
                setAttributes({ items: updated });
            }

            function removeItem(index) {
                setAttributes({ items: items.filter(function(_, i) { return i !== index; }) });
            }

            function addItem() {
                setAttributes({ items: items.concat([{ question: '', answer: '' }]) });
            }

            function moveItem(from, to) {
                if (to < 0 || to >= items.length) return;
                var arr = items.slice();
                var item = arr.splice(from, 1)[0];
                arr.splice(to, 0, item);
                setAttributes({ items: arr });
            }

            return el(Fragment, null,

                // ── Sidebar ──────────────────────────────────────────────
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Intestazione', initialOpen: true },
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
                        el(ToggleControl, {
                            label: 'Apri pi\u00f9 risposte contemporaneamente',
                            checked: allowMultiple,
                            onChange: function(val) { setAttributes({ allowMultiple: val }); }
                        })
                    ),

                    items.map(function(faq, idx) {
                        return el(PanelBody, {
                            key: idx,
                            title: 'FAQ ' + (idx + 1) + (faq.question ? ' \u2014 ' + faq.question.substring(0, 30) : ''),
                            initialOpen: false
                        },
                            el(TextControl, {
                                label: 'Domanda',
                                value: faq.question || '',
                                onChange: function(val) { updateItem(idx, 'question', val); }
                            }),
                            el(TextareaControl, {
                                label: 'Risposta',
                                value: faq.answer || '',
                                rows: 4,
                                onChange: function(val) { updateItem(idx, 'answer', val); }
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
                                    disabled: idx === items.length - 1,
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

                    el(PanelBody, { title: 'Aggiungi FAQ', initialOpen: false },
                        el(Button, {
                            variant: 'primary',
                            onClick: addItem,
                            style: { width: '100%' }
                        }, '+ Aggiungi Domanda')
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'FAQ Schema'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        items.length > 0
                            ? items.length + ' domande configurate (con Schema.org)'
                            : 'Aggiungi domande frequenti dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
