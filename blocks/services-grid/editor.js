(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls }                    = wp.blockEditor;
    const { PanelBody, TextControl, RangeControl,
            SelectControl, Button }                = wp.components;

    var iconOptions = [
        { label: 'Scudo', value: 'shield' },
        { label: 'Edificio', value: 'building' },
        { label: 'Attrezzi', value: 'tool' },
        { label: 'Negozio', value: 'shop' },
        { label: 'Stetoscopio', value: 'stethoscope' },
        { label: 'Lucchetto', value: 'lock' },
        { label: 'Auto', value: 'car' },
        { label: 'Cuore', value: 'heart' },
        { label: 'Valigetta', value: 'briefcase' },
        { label: 'Aereo', value: 'plane' },
        { label: 'Documento', value: 'file-text' },
        { label: 'Camion', value: 'truck' }
    ];

    registerBlockType('cesana/services-grid', {
        edit: function({ attributes, setAttributes }) {
            var title    = attributes.title;
            var subtitle = attributes.subtitle;
            var services = attributes.services || [];
            var columns  = attributes.columns;

            function updateItem(index, key, value) {
                var updated = services.map(function(item, i) {
                    if (i === index) {
                        var copy = {};
                        for (var k in item) copy[k] = item[k];
                        copy[key] = value;
                        return copy;
                    }
                    return item;
                });
                setAttributes({ services: updated });
            }

            function removeItem(index) {
                setAttributes({ services: services.filter(function(_, i) { return i !== index; }) });
            }

            function addItem() {
                setAttributes({ services: services.concat([{ title: '', description: '', icon: 'shield', url: '' }]) });
            }

            function moveItem(from, to) {
                if (to < 0 || to >= services.length) return;
                var arr = services.slice();
                var item = arr.splice(from, 1)[0];
                arr.splice(to, 0, item);
                setAttributes({ services: arr });
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
                        el(RangeControl, {
                            label: 'Colonne',
                            value: columns,
                            min: 2,
                            max: 4,
                            onChange: function(val) { setAttributes({ columns: val }); }
                        })
                    ),

                    services.map(function(svc, idx) {
                        return el(PanelBody, {
                            key: idx,
                            title: 'Servizio ' + (idx + 1) + (svc.title ? ' \u2014 ' + svc.title : ''),
                            initialOpen: false
                        },
                            el(SelectControl, {
                                label: 'Icona',
                                value: svc.icon || 'shield',
                                options: iconOptions,
                                onChange: function(val) { updateItem(idx, 'icon', val); }
                            }),
                            el(TextControl, {
                                label: 'Titolo',
                                value: svc.title || '',
                                onChange: function(val) { updateItem(idx, 'title', val); }
                            }),
                            el(TextControl, {
                                label: 'Descrizione',
                                value: svc.description || '',
                                onChange: function(val) { updateItem(idx, 'description', val); }
                            }),
                            el(TextControl, {
                                label: 'URL pagina',
                                value: svc.url || '',
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
                                    disabled: idx === services.length - 1,
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

                    el(PanelBody, { title: 'Aggiungi Servizio', initialOpen: false },
                        el(Button, {
                            variant: 'primary',
                            onClick: addItem,
                            style: { width: '100%' }
                        }, '+ Aggiungi Servizio')
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Services Grid'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        services.length > 0
                            ? services.length + ' servizi \u2014 ' + columns + ' colonne'
                            : 'Aggiungi servizi dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
