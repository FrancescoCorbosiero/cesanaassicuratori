(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls }                    = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl,
            Button }                               = wp.components;

    registerBlockType('cesana/testimonial-stats', {
        edit: function({ attributes, setAttributes }) {
            var title   = attributes.title;
            var stats   = attributes.stats || [];
            var variant = attributes.variant;

            function updateItem(index, key, value) {
                var updated = stats.map(function(item, i) {
                    if (i === index) {
                        var copy = {};
                        for (var k in item) copy[k] = item[k];
                        copy[key] = value;
                        return copy;
                    }
                    return item;
                });
                setAttributes({ stats: updated });
            }

            function removeItem(index) {
                setAttributes({ stats: stats.filter(function(_, i) { return i !== index; }) });
            }

            function addItem() {
                setAttributes({ stats: stats.concat([{ value: '', suffix: '', label: '' }]) });
            }

            function moveItem(from, to) {
                if (to < 0 || to >= stats.length) return;
                var arr = stats.slice();
                var item = arr.splice(from, 1)[0];
                arr.splice(to, 0, item);
                setAttributes({ stats: arr });
            }

            return el(Fragment, null,

                // ── Sidebar ──────────────────────────────────────────────
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Impostazioni', initialOpen: true },
                        el(TextControl, {
                            label: 'Titolo sezione',
                            value: title,
                            onChange: function(val) { setAttributes({ title: val }); }
                        }),
                        el(SelectControl, {
                            label: 'Variante',
                            value: variant,
                            options: [
                                { label: 'Navy (scuro)', value: 'navy' },
                                { label: 'Chiaro', value: 'light' }
                            ],
                            onChange: function(val) { setAttributes({ variant: val }); }
                        })
                    ),

                    stats.map(function(stat, idx) {
                        return el(PanelBody, {
                            key: idx,
                            title: 'Statistica ' + (idx + 1) + (stat.label ? ' \u2014 ' + stat.label : ''),
                            initialOpen: false
                        },
                            el(TextControl, {
                                label: 'Valore numerico',
                                value: stat.value || '',
                                onChange: function(val) { updateItem(idx, 'value', val); },
                                help: 'Es: 25, 98, 1500'
                            }),
                            el(TextControl, {
                                label: 'Suffisso',
                                value: stat.suffix || '',
                                onChange: function(val) { updateItem(idx, 'suffix', val); },
                                help: 'Es: +, %, anni'
                            }),
                            el(TextControl, {
                                label: 'Etichetta',
                                value: stat.label || '',
                                onChange: function(val) { updateItem(idx, 'label', val); },
                                help: 'Es: Anni di esperienza'
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
                                    disabled: idx === stats.length - 1,
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

                    el(PanelBody, { title: 'Aggiungi Statistica', initialOpen: false },
                        el(Button, {
                            variant: 'primary',
                            onClick: addItem,
                            style: { width: '100%' }
                        }, '+ Aggiungi Statistica')
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder' + (variant === 'navy' ? ' ca-editor-placeholder--dark' : '') },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Testimonial Stats'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        stats.length > 0
                            ? stats.length + ' statistiche \u2014 variante ' + variant
                            : 'Aggiungi statistiche dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
