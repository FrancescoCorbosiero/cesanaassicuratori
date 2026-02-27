(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls }                    = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl,
            Button }                               = wp.components;

    var iconOptions = [
        { label: 'Scudo', value: 'shield' },
        { label: 'Bilancia', value: 'balance' },
        { label: 'Occhio', value: 'eye' },
        { label: 'Stretta di mano', value: 'handshake' },
        { label: 'Bersaglio', value: 'target' },
        { label: 'Grafico', value: 'chart' },
        { label: 'Bussola', value: 'compass' },
        { label: 'Utenti', value: 'users' }
    ];

    registerBlockType('cesana/why-broker', {
        edit: function({ attributes, setAttributes }) {
            var eyebrow  = attributes.eyebrow;
            var title    = attributes.title;
            var subtitle = attributes.subtitle;
            var reasons  = attributes.reasons || [];

            function updateItem(index, key, value) {
                var updated = reasons.map(function(item, i) {
                    if (i === index) {
                        var copy = {};
                        for (var k in item) copy[k] = item[k];
                        copy[key] = value;
                        return copy;
                    }
                    return item;
                });
                setAttributes({ reasons: updated });
            }

            function removeItem(index) {
                setAttributes({ reasons: reasons.filter(function(_, i) { return i !== index; }) });
            }

            function addItem() {
                setAttributes({ reasons: reasons.concat([{ title: '', description: '', icon: 'shield' }]) });
            }

            function moveItem(from, to) {
                if (to < 0 || to >= reasons.length) return;
                var arr = reasons.slice();
                var item = arr.splice(from, 1)[0];
                arr.splice(to, 0, item);
                setAttributes({ reasons: arr });
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

                    reasons.map(function(reason, idx) {
                        return el(PanelBody, {
                            key: idx,
                            title: 'Motivo ' + (idx + 1) + (reason.title ? ' \u2014 ' + reason.title : ''),
                            initialOpen: false
                        },
                            el(SelectControl, {
                                label: 'Icona',
                                value: reason.icon || 'shield',
                                options: iconOptions,
                                onChange: function(val) { updateItem(idx, 'icon', val); }
                            }),
                            el(TextControl, {
                                label: 'Titolo',
                                value: reason.title || '',
                                onChange: function(val) { updateItem(idx, 'title', val); }
                            }),
                            el(TextControl, {
                                label: 'Descrizione',
                                value: reason.description || '',
                                onChange: function(val) { updateItem(idx, 'description', val); }
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
                                    disabled: idx === reasons.length - 1,
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

                    el(PanelBody, { title: 'Aggiungi Motivo', initialOpen: false },
                        el(Button, {
                            variant: 'primary',
                            onClick: addItem,
                            style: { width: '100%' }
                        }, '+ Aggiungi Motivo')
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Perch\u00e9 Scegliere Cesana'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        reasons.length > 0
                            ? reasons.length + ' motivazioni configurate'
                            : 'Aggiungi motivazioni dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
