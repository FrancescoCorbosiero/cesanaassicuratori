<?php
/**
 * Performance Optimizations
 * Speculation Rules API, resource hints, LCP image priority
 */

if (!defined('ABSPATH')) {
    exit;
}

class CA_Performance
{
    public static function init()
    {
        add_action('wp_head', [__CLASS__, 'speculation_rules'], 99);
        add_action('wp_head', [__CLASS__, 'resource_hints'], 1);
        add_filter('wp_get_attachment_image_attributes', [__CLASS__, 'lcp_image_priority'], 10, 3);
    }

    /**
     * Speculation Rules API — prefetch/prerender on hover intent
     * Supported: Chrome 121+, Edge 121+
     * Fallback: browsers that don't support simply ignore the script tag
     */
    public static function speculation_rules()
    {
        if (is_admin()) return;
        ?>
        <script type="speculationrules">
        {
            "prerender": [
                {
                    "where": {
                        "and": [
                            {"href_matches": "/*"},
                            {"not": {"href_matches": "/wp-admin/*"}},
                            {"not": {"href_matches": "/wp-login.php"}},
                            {"not": {"href_matches": "/*\\?*(^|&)s=*"}},
                            {"not": {"href_matches": "/*#*"}},
                            {"not": {"selector_matches": "[rel~=nofollow]"}},
                            {"not": {"selector_matches": "[target=_blank]"}}
                        ]
                    },
                    "eagerness": "moderate"
                }
            ],
            "prefetch": [
                {
                    "where": {
                        "and": [
                            {"href_matches": "/*"},
                            {"not": {"href_matches": "/wp-admin/*"}},
                            {"not": {"href_matches": "/wp-login.php"}}
                        ]
                    },
                    "eagerness": "conservative"
                }
            ]
        }
        </script>
        <?php
    }

    /**
     * Preconnect to critical origins early in <head>
     * Only used if loading fonts from Google Fonts CDN
     */
    public static function resource_hints()
    {
        if (is_admin()) return;
        echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
        echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
    }

    /**
     * Add fetchpriority="high" to images likely to be LCP
     */
    public static function lcp_image_priority($attr, $attachment, $size)
    {
        if (isset($attr['class']) && str_contains($attr['class'], 'ca-hero-lcp')) {
            $attr['fetchpriority'] = 'high';
            $attr['loading'] = 'eager';
        }
        return $attr;
    }
}
