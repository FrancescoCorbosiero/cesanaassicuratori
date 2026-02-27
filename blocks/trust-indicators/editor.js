(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls }                    = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl,
            Button }                               = wp.components;

    var iconOptions = [
        { label: 'Scudo', value: 'shield' },
        { label: 'Stretta di mano', value: 'handshake' },
        { label: 'Grafico', value: 'chart' },
        { label: 'Orologio', value: 'clock' },
        { label: 'Ricerca', value: 'search' },
        { label: 'Bilancia', value: 'scale' },
        { label: 'Stella', value: 'star' },
        { label: 'Utenti', value: 'users' }
    ];

    registerBlockType('cesana/trust-indicators', {
        edit: function({ attributes, setAttributes }) {
            var indicators = attributes.indicators || [];
            var variant    = attributes.variant;

            function updateItem(index, key, value) {
                var updated = indicators.map(function(item, i) {
                    if (i === index) {
                        var copy = {};
                        for (var k in item) copy[k] = item[k];
                        copy[key] = value;
                        return copy;
                    }
                    return item;
                });
                setAttributes({ indicators: updated });
            }

            function removeItem(index) {
                setAttributes({ indicators: indicators.filter(function(_, i) { return i !== index; }) });
            }

            function addItem() {
                setAttributes({ indicators: indicators.concat([{ icon: 'shield', title: '', description: '' }]) });
            }

            function moveItem(from, to) {
                if (to < 0 || to >= indicators.length) return;
                var arr = indicators.slice();
                var item = arr.splice(from, 1)[0];
                arr.splice(to, 0, item);
                setAttributes({ indicators: arr });
            }

            return el(Fragment, null,

                // ── Sidebar ──────────────────────────────────────────────
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Aspetto', initialOpen: true },
                        el(SelectControl, {
                            label: 'Variante',
                            value: variant,
                            options: [
                                { label: 'Chiaro (default)', value: 'default' },
                                { label: 'Scuro', value: 'dark' }
                            ],
                            onChange: function(val) { setAttributes({ variant: val }); }
                        })
                    ),

                    indicators.map(function(ind, idx) {
                        return el(PanelBody, {
                            key: idx,
                            title: 'Indicatore ' + (idx + 1) + (ind.title ? ' \u2014 ' + ind.title : ''),
                            initialOpen: false
                        },
                            el(SelectControl, {
                                label: 'Icona',
                                value: ind.icon || 'shield',
                                options: iconOptions,
                                onChange: function(val) { updateItem(idx, 'icon', val); }
                            }),
                            el(TextControl, {
                                label: 'Titolo',
                                value: ind.title || '',
                                onChange: function(val) { updateItem(idx, 'title', val); },
                                help: 'Es: 25+ Anni'
                            }),
                            el(TextControl, {
                                label: 'Descrizione',
                                value: ind.description || '',
                                onChange: function(val) { updateItem(idx, 'description', val); },
                                help: 'Es: di esperienza'
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
                                    disabled: idx === indicators.length - 1,
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

                    el(PanelBody, { title: 'Aggiungi Indicatore', initialOpen: false },
                        el(Button, {
                            variant: 'primary',
                            onClick: addItem,
                            style: { width: '100%' }
                        }, '+ Aggiungi Indicatore')
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder' + (variant === 'dark' ? ' ca-editor-placeholder--dark' : '') },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Trust Indicators'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        indicators.length > 0
                            ? indicators.length + ' indicatori di fiducia'
                            : 'Aggiungi indicatori dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
