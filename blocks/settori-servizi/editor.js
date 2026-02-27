(function(wp) {
    const { registerBlockType }                    = wp.blocks;
    const { createElement: el, Fragment }          = wp.element;
    const { InspectorControls }                    = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl,
            ToggleControl, Button }                = wp.components;

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
        { label: 'Camion', value: 'truck' },
        { label: 'Cyber', value: 'cyber' }
    ];

    registerBlockType('cesana/settori-servizi', {
        edit: function({ attributes, setAttributes }) {
            var eyebrow  = attributes.eyebrow;
            var title    = attributes.title;
            var subtitle = attributes.subtitle;
            var sectors  = attributes.sectors || [];

            function updateItem(index, key, value) {
                var updated = sectors.map(function(item, i) {
                    if (i === index) {
                        var copy = {};
                        for (var k in item) copy[k] = item[k];
                        copy[key] = value;
                        return copy;
                    }
                    return item;
                });
                setAttributes({ sectors: updated });
            }

            function removeItem(index) {
                setAttributes({ sectors: sectors.filter(function(_, i) { return i !== index; }) });
            }

            function addItem() {
                setAttributes({ sectors: sectors.concat([{ title: '', description: '', icon: 'shield', url: '', featured: false }]) });
            }

            function moveItem(from, to) {
                if (to < 0 || to >= sectors.length) return;
                var arr = sectors.slice();
                var item = arr.splice(from, 1)[0];
                arr.splice(to, 0, item);
                setAttributes({ sectors: arr });
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

                    sectors.map(function(sector, idx) {
                        return el(PanelBody, {
                            key: idx,
                            title: 'Settore ' + (idx + 1) + (sector.title ? ' \u2014 ' + sector.title : ''),
                            initialOpen: false
                        },
                            el(SelectControl, {
                                label: 'Icona',
                                value: sector.icon || 'shield',
                                options: iconOptions,
                                onChange: function(val) { updateItem(idx, 'icon', val); }
                            }),
                            el(TextControl, {
                                label: 'Titolo',
                                value: sector.title || '',
                                onChange: function(val) { updateItem(idx, 'title', val); }
                            }),
                            el(TextControl, {
                                label: 'Descrizione',
                                value: sector.description || '',
                                onChange: function(val) { updateItem(idx, 'description', val); }
                            }),
                            el(TextControl, {
                                label: 'URL',
                                value: sector.url || '',
                                onChange: function(val) { updateItem(idx, 'url', val); }
                            }),
                            el(ToggleControl, {
                                label: 'In evidenza (card grande)',
                                checked: !!sector.featured,
                                onChange: function(val) { updateItem(idx, 'featured', val); }
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
                                    disabled: idx === sectors.length - 1,
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

                    el(PanelBody, { title: 'Aggiungi Settore', initialOpen: false },
                        el(Button, {
                            variant: 'primary',
                            onClick: addItem,
                            style: { width: '100%' }
                        }, '+ Aggiungi Settore')
                    )
                ),

                // ── Canvas placeholder ────────────────────────────────────
                el('div', { className: 'ca-editor-placeholder ca-editor-placeholder--dark' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Settori & Servizi'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        sectors.length > 0
                            ? sectors.length + ' settori configurati (griglia bento)'
                            : 'Aggiungi settori dal pannello laterale.'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
