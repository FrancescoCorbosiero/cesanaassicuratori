<?php
/**
 * Theme JSON Integration — Design Token Bridge
 * Registers plugin design tokens into WordPress editor settings
 * so gold/navy palette, typography, and spacing appear in every block's controls.
 */

if (!defined('ABSPATH')) {
    exit;
}

class CA_Theme_JSON
{
    public static function init()
    {
        add_filter('wp_theme_json_data_default', [__CLASS__, 'inject_tokens']);
    }

    public static function inject_tokens($theme_json)
    {
        $new_data = [
            'version' => 3,
            'settings' => [
                'color' => [
                    'palette' => [
                        ['slug' => 'ca-navy',       'color' => '#0C0C14', 'name' => 'Navy'],
                        ['slug' => 'ca-navy-light', 'color' => '#16161F', 'name' => 'Navy Chiaro'],
                        ['slug' => 'ca-navy-dark',  'color' => '#08080E', 'name' => 'Navy Scuro'],
                        ['slug' => 'ca-gold',       'color' => '#B8973F', 'name' => 'Oro'],
                        ['slug' => 'ca-gold-light', 'color' => '#C9A84C', 'name' => 'Oro Chiaro'],
                        ['slug' => 'ca-gold-dark',  'color' => '#9A7E32', 'name' => 'Oro Scuro'],
                        ['slug' => 'ca-white',      'color' => '#FFFFFF', 'name' => 'Bianco'],
                        ['slug' => 'ca-gray-50',    'color' => '#F7F8FA', 'name' => 'Grigio 50'],
                        ['slug' => 'ca-gray-100',   'color' => '#ECEEF2', 'name' => 'Grigio 100'],
                        ['slug' => 'ca-gray-200',   'color' => '#D8DBE2', 'name' => 'Grigio 200'],
                        ['slug' => 'ca-gray-400',   'color' => '#8B91A0', 'name' => 'Grigio 400'],
                        ['slug' => 'ca-gray-500',   'color' => '#6B7080', 'name' => 'Grigio 500'],
                        ['slug' => 'ca-gray-600',   'color' => '#4A4F5E', 'name' => 'Grigio 600'],
                        ['slug' => 'ca-gray-800',   'color' => '#1E2028', 'name' => 'Grigio 800'],
                    ],
                    'defaultPalette' => false,
                    'defaultGradients' => false,
                ],
                'typography' => [
                    'fontFamilies' => [
                        [
                            'fontFamily' => "'DM Serif Display', Georgia, 'Times New Roman', serif",
                            'slug' => 'ca-display',
                            'name' => 'Display (DM Serif)',
                        ],
                        [
                            'fontFamily' => "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                            'slug' => 'ca-sans',
                            'name' => 'Sans (Inter)',
                        ],
                    ],
                    'fontSizes' => [
                        ['slug' => 'ca-xs',   'size' => 'clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem)',  'name' => 'XS'],
                        ['slug' => 'ca-sm',   'size' => 'clamp(0.8125rem, 0.78rem + 0.2vw, 0.9375rem)', 'name' => 'Small'],
                        ['slug' => 'ca-base', 'size' => 'clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)',       'name' => 'Base'],
                        ['slug' => 'ca-lg',   'size' => 'clamp(1.0625rem, 1rem + 0.35vw, 1.1875rem)',   'name' => 'Large'],
                        ['slug' => 'ca-xl',   'size' => 'clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)',       'name' => 'XL'],
                        ['slug' => 'ca-2xl',  'size' => 'clamp(1.5rem, 1.3rem + 0.8vw, 2rem)',          'name' => '2XL'],
                        ['slug' => 'ca-3xl',  'size' => 'clamp(2rem, 1.5rem + 1.8vw, 3rem)',            'name' => '3XL'],
                        ['slug' => 'ca-4xl',  'size' => 'clamp(2.5rem, 1.8rem + 2.5vw, 3.75rem)',       'name' => '4XL'],
                    ],
                    'defaultFontSizes' => false,
                ],
                'spacing' => [
                    'spacingSizes' => [
                        ['slug' => 'ca-xs',  'size' => '0.25rem', 'name' => 'XS'],
                        ['slug' => 'ca-sm',  'size' => '0.5rem',  'name' => 'Small'],
                        ['slug' => 'ca-md',  'size' => '1rem',    'name' => 'Medium'],
                        ['slug' => 'ca-lg',  'size' => '1.5rem',  'name' => 'Large'],
                        ['slug' => 'ca-xl',  'size' => '2rem',    'name' => 'XL'],
                        ['slug' => 'ca-2xl', 'size' => '3rem',    'name' => '2XL'],
                        ['slug' => 'ca-3xl', 'size' => '4rem',    'name' => '3XL'],
                    ],
                    'units' => ['px', 'rem', 'em', '%', 'vw'],
                ],
                'layout' => [
                    'contentSize' => '720px',
                    'wideSize' => '1200px',
                ],
            ],
        ];

        return $theme_json->update_with($new_data);
    }
}
