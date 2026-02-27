# DEVELOPMENT.md — Cesana Assicuratori Blocks

> Development contract and scaffold specification for LLM-assisted block generation.
> Plugin: cesana-assicuratori-blocks | WordPress 6.5+ | PHP 8.0+ | API v3

---

## 1. Architecture Overview

This is a **plugin-first design system** for WordPress Gutenberg. The plugin is the product; the theme is a shell. All visual identity, components, interactivity, and content patterns live in the plugin. The active theme provides only `theme.json` token bridging and minimal templates that compose plugin blocks.

### Core Principles

- **Zero external JS dependencies.** No npm packages on the frontend. Vanilla JS only.
- **No build step.** Editor JS uses raw `wp.element.createElement`. No JSX, no transpiler, no bundler.
- **Dynamic blocks only.** Every block uses server-side rendering (`render.php`). The `save()` function always returns `null`. This means markup changes deploy instantly without block validation errors.
- **Plugin portable.** All CSS is namespaced `ca-*`, all blocks are namespaced `cesana/`, all JS is IIFE-scoped. No theme dependency. Works on any theme.
- **Accessibility baseline.** `prefers-reduced-motion` respected in all animations. ARIA attributes on all interactive elements. Focus-visible outlines. European Accessibility Act compliant.

### File System Structure

```
cesana-assicuratori-blocks/
├── cesana-assicuratori-blocks.php    # Main plugin file — enqueues global assets, registers blocks
├── includes/
│   ├── class-ca-contact-form.php     # REST API form handler
│   └── class-ca-performance.php      # Performance optimizations (speculation rules, hints)
├── assets/
│   ├── css/
│   │   ├── tokens.css                # Design tokens only (:root custom properties)
│   │   ├── base.css                  # Reset, button system, animation system
│   │   └── animations.css            # Scroll reveal, text reveal, image reveal, stagger, parallax, magnetic
│   ├── js/
│   │   └── animations.js             # ScrollReveal, TextReveal, ImageReveal, ScrollParallax, MagneticHover, StaggerReveal, CounterAnimation, SmoothScroll, PageLoader
│   └── fonts/                        # Self-hosted Inter + DM Serif Display (WOFF2)
├── blocks/
│   ├── hero-banner/
│   │   ├── block.json
│   │   ├── editor.js
│   │   ├── render.php
│   │   ├── style.css                 # Frontend styles for this block only
│   │   ├── editor.css                # Editor-specific styles (optional)
│   │   └── view.js                   # Frontend interactivity (Interactivity API for widgets)
│   ├── page-hero/
│   │   ├── block.json
│   │   ├── editor.js
│   │   ├── render.php
│   │   └── style.css
│   ├── trust-indicators/
│   ├── services-grid/
│   ├── consultation-form/
│   ├── faq-schema/
│   ├── cta-banner/
│   ├── testimonial-stats/
│   ├── why-broker/
│   ├── settori-servizi/
│   ├── convenzioni/
│   └── testimonials-slider/
├── snippets.html                     # Copy-paste reference for WP code editor
├── CLAUDE.md                         # Brand, content, and tone guidelines
└── DEVELOPMENT.md                    # This file — development contract
```

---

## 2. Block Scaffold — Canonical Pattern

Every block follows this exact pattern. When generating a new block, replicate this structure precisely.

### 2.1 block.json

```json
{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "cesana/BLOCK-SLUG",
    "version": "1.0.0",
    "title": "Block Title (Italian, user-facing)",
    "category": "cesana",
    "icon": "wordpress-dashicon-name",
    "description": "Italian description of what this block does.",
    "keywords": ["keyword1", "keyword2"],
    "textdomain": "cesana-assicuratori-blocks",
    "attributes": {
        "exampleText": {
            "type": "string",
            "default": "Testo predefinito"
        },
        "exampleImageId": {
            "type": "number",
            "default": 0
        },
        "exampleImageUrl": {
            "type": "string",
            "default": ""
        },
        "variant": {
            "type": "string",
            "default": "default",
            "enum": ["default", "dark", "light"]
        }
    },
    "supports": {
        "align": ["full", "wide"],
        "html": false
    },
    "editorScript": "file:./editor.js",
    "editorStyle": "file:./editor.css",
    "style": "file:./style.css",
    "render": "file:./render.php",
    "viewScriptModule": "file:./view.js",
    "example": {
        "attributes": {
            "exampleText": "Preview text shown in block inserter"
        }
    }
}
```

**Key rules for block.json:**

- `apiVersion` is always `3`.
- `style` loads CSS **only when the block is present on the page**. This is critical for performance — never put block-specific CSS in the global stylesheet.
- `viewScriptModule` loads frontend JS **only when the block is present**. Use for interactive widgets (carousels, accordions, forms). Do NOT use for scroll animations — those are global.
- `editorScript` loads in the block editor only.
- `example` provides visual preview data for the block inserter. Always include realistic sample data.
- Images: always store `attachment_id` (type `number`) as the primary attribute. Store a companion `imageUrl` (type `string`) for editor preview only. Resolve to responsive markup in render.php.

### 2.2 editor.js

```js
(function(wp) {
    var registerBlockType = wp.blocks.registerBlockType;
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var MediaUpload = wp.blockEditor.MediaUpload;
    var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
    var PanelBody = wp.components.PanelBody;
    var TextControl = wp.components.TextControl;
    var SelectControl = wp.components.SelectControl;
    var RangeControl = wp.components.RangeControl;
    var ToggleControl = wp.components.ToggleControl;
    var Button = wp.components.Button;

    registerBlockType('cesana/BLOCK-SLUG', {
        edit: function(props) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;

            return el(Fragment, null,
                // ── Sidebar controls ──
                el(InspectorControls, null,
                    el(PanelBody, { title: 'Impostazioni', initialOpen: true },
                        // Controls here
                    )
                ),

                // ── Canvas placeholder ──
                el('div', { className: 'ca-editor-placeholder' },
                    el('div', { className: 'ca-editor-placeholder__icon' },
                        el('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
                            el('path', { d: 'M_SVG_PATH_HERE' })
                        )
                    ),
                    el('div', { className: 'ca-editor-placeholder__title' }, 'Block Title'),
                    el('div', { className: 'ca-editor-placeholder__text' },
                        'Status summary of configured attributes'
                    )
                )
            );
        },

        save: function() { return null; }
    });
})(window.wp);
```

**Key rules for editor.js:**

- Always wrap in IIFE with `window.wp` passed in.
- Destructure WP packages at the top — `var` not `const` (broadest compat, no transpiler).
- `save()` always returns `null`. No exceptions.
- The canvas shows a dark placeholder with block name and configuration summary. Content editing happens in sidebar InspectorControls.
- For image selection, always use `MediaUpload` and store both `media.id` and `media.url`:
  ```js
  onSelect: function(media) {
      setAttributes({ imageId: media.id, imageUrl: media.url });
  }
  ```
- For array attributes (slides, items, services), provide helper functions: `updateItem(index, key, value)`, `removeItem(index)`, `addItem()`, `moveItem(from, to)`.

### 2.3 render.php

```php
<?php
/**
 * Block Name — Server-side render
 * Brief description of what this block renders
 */

// Extract attributes with defaults
$variant   = $attributes['variant'] ?? 'default';
$title     = $attributes['title'] ?? '';
$image_id  = $attributes['imageId'] ?? 0;

// Early return if no meaningful content
if (empty($title)) {
    return;
}

// Generate unique block ID for JS targeting
$block_id = 'ca-block-' . wp_unique_id();

// Determine variant class
$variant_class = $variant !== 'default' ? ' ca-block-name--' . esc_attr($variant) : '';
?>
<section class="ca-block ca-block-name<?php echo $variant_class; ?>"
    id="<?php echo esc_attr($block_id); ?>"
    data-ca-reveal="up">

    <div class="ca-block-name__container">
        <?php if (!empty($title)) : ?>
            <h2 class="ca-block-name__title"><?php echo esc_html($title); ?></h2>
        <?php endif; ?>

        <?php if ($image_id) : ?>
            <div class="ca-block-name__image" data-ca-image-reveal="left">
                <?php echo wp_get_attachment_image($image_id, 'large', false, [
                    'class'   => 'ca-block-name__img',
                    'loading' => 'lazy',
                    'sizes'   => '(max-width: 768px) 100vw, 50vw',
                ]); ?>
            </div>
        <?php endif; ?>
    </div>
</section>
```

**Key rules for render.php:**

- All user content escaped: `esc_html()` for text, `esc_url()` for URLs, `esc_attr()` for attributes, `wp_kses_post()` for rich HTML (FAQ answers).
- Always use `wp_get_attachment_image()` for images — never raw `<img src>`. This generates responsive `srcset`, `sizes`, `width`/`height`, and serves WebP/AVIF automatically.
- The hero banner first slide image gets `'loading' => 'eager'` and `'fetchpriority' => 'high'`. All other images get `'loading' => 'lazy'`.
- Every block's root element gets `class="ca-block ca-BLOCK-NAME"`.
- Use `wp_unique_id()` for block instance IDs, not `uniqid()`.
- Scroll animation attributes (`data-ca-reveal`, `data-ca-text-reveal`, etc.) go directly in the markup. The global `animations.js` picks them up automatically.
- For Interactivity API blocks, add `data-wp-interactive="cesana/BLOCK-SLUG"` on the root element.

### 2.4 style.css (per-block)

```css
/**
 * cesana/BLOCK-SLUG — Frontend Styles
 * Brief description
 */

.ca-block-name {
    padding: var(--ca-space-section) 0;
    background: var(--ca-white);
}

/* Variant: dark */
.ca-block-name--dark {
    background: var(--ca-navy);
    color: var(--ca-white);
}

/* Variant: light */
.ca-block-name--light {
    background: var(--ca-gray-50);
}

.ca-block-name__container {
    max-width: var(--ca-max-width);
    margin: 0 auto;
    padding: 0 var(--ca-space-xl);
}

/* ... component styles ... */

/* ── Responsive ── */
@media (max-width: 768px) {
    /* Mobile overrides */
}

@media (max-width: 480px) {
    /* Small mobile overrides */
}
```

**Key rules for per-block CSS:**

- Only styles for THIS block. No design tokens, no base reset, no button system, no animation system — those are in global files.
- Use design tokens exclusively — never hardcode colors, fonts, spacing, or easing curves. Reference `var(--ca-*)`.
- Class naming: `.ca-BLOCK-NAME__element` (BEM-like, flat — avoid nesting beyond one level).
- Sections use `padding: var(--ca-space-section) 0` for consistent vertical rhythm.
- Containers use `max-width: var(--ca-max-width); margin: 0 auto; padding: 0 var(--ca-space-xl);`.
- `content-visibility: auto` on below-the-fold sections for rendering performance.
- No `border-radius` beyond `var(--ca-radius-sm)` (2px). The design language is sharp, editorial, not rounded/bubbly.

### 2.5 view.js (Interactivity API — only for interactive widgets)

```js
/**
 * cesana/BLOCK-SLUG — Frontend Interactivity
 * Uses WordPress Interactivity API (wp-interactivity)
 */
import { store, getContext } from '@wordpress/interactivity';

store('cesana/BLOCK-SLUG', {
    state: {
        // Global state shared across all instances of this block
    },
    actions: {
        actionName() {
            const ctx = getContext();
            // Mutate ctx for per-instance state changes
        }
    },
    callbacks: {
        // Reactive side effects — run when referenced state changes
    }
});
```

**When to use view.js (Interactivity API):**

- Carousels / sliders (hero-banner, testimonials-slider)
- Accordions (faq-schema)
- Forms with submit handling (consultation-form)
- Any block with user-triggered state changes (tabs, modals, toggles)

**When NOT to use view.js:**

- Scroll-driven animations (reveal, parallax, text split) — these stay in the global `animations.js`
- Counters — these stay in global `animations.js` (IntersectionObserver pattern)
- Magnetic hover, smooth scroll — global `animations.js`

**Render.php Interactivity API directives:**

```php
<!-- Root element declares the interactive namespace and per-instance context -->
<div data-wp-interactive="cesana/faq-schema"
     <?php echo wp_interactivity_data_wp_context(['allowMultiple' => $allow_multiple]); ?>>

    <!-- Directives bind behavior declaratively -->
    <button data-wp-on--click="actions.toggle"
            data-wp-bind--aria-expanded="context.isOpen">
        Trigger
    </button>

    <div data-wp-class--ca-faq__item--open="context.isOpen"
         data-wp-style--max-height="state.contentHeight">
        Content
    </div>
</div>
```

---

## 3. Design System Tokens

These are defined globally in `assets/css/tokens.css` and must be used everywhere. Never hardcode values.

### Colors

| Token | Value | Usage |
|---|---|---|
| `--ca-navy` | `#0C0C14` | Primary dark / text on light |
| `--ca-navy-light` | `#16161F` | Dark variant backgrounds |
| `--ca-navy-dark` | `#08080E` | Deepest dark |
| `--ca-gold` | `#B8973F` | Primary accent / CTAs / icons |
| `--ca-gold-light` | `#C9A84C` | Hover states |
| `--ca-gold-dark` | `#9A7E32` | Active states / links |
| `--ca-white` | `#FFFFFF` | Light backgrounds |
| `--ca-gray-50` through `--ca-gray-900` | Cool-tinted grays | UI shades |

### Typography

| Token | Value | Usage |
|---|---|---|
| `--ca-font-display` | DM Serif Display, Georgia, serif | Headings, titles, stats |
| `--ca-font-sans` | Inter, system-ui, sans-serif | Body, labels, buttons |
| `--ca-text-xs` through `--ca-text-5xl` | Fluid `clamp()` scale | All text sizing |

### Spacing

| Token | Usage |
|---|---|
| `--ca-space-section` | `clamp(5rem, 3.5rem + 5vw, 9rem)` — vertical padding between sections |
| `--ca-space-xs` through `--ca-space-5xl` | Component internal spacing |

### Easing

| Token | Usage |
|---|---|
| `--ca-ease-premium` | `cubic-bezier(0.16, 1, 0.3, 1)` — primary motion curve |
| `--ca-ease-out` | Standard ease-out |
| `--ca-ease-subtle` | Background/ambient animations |

### Design Rules

- **Borders:** Sharp. `border-radius: 2px` max. Never rounded.
- **Shadows:** Minimal. Used for elevation, not decoration.
- **Typography:** Display font for headings and stats only. Sans for everything else.
- **Eyebrow pattern:** All section blocks that have an eyebrow use this markup:
  ```html
  <span class="ca-BLOCK__eyebrow">TEXT</span>
  ```
  With CSS that prepends a 2rem gold line via `::before`.

---

## 4. Animation Data Attributes Reference

These are placed directly in `render.php` markup. The global `animations.js` handles initialization automatically via IntersectionObserver.

| Attribute | Values | Description |
|---|---|---|
| `data-ca-reveal` | `up`, `left`, `right`, `fade` | Scroll-triggered reveal with transform |
| `data-ca-reveal-delay` | ms integer (e.g., `200`) | Stagger delay for sequential reveals |
| `data-ca-text-reveal` | `chars`, `words`, `lines` | Split text animation on scroll |
| `data-ca-text-reveal-delay` | ms integer | Delay before text reveal triggers |
| `data-ca-image-reveal` | `left`, `right`, `up`, `down` | Clip-path wipe reveal with gold accent bar |
| `data-ca-image-reveal-delay` | ms integer | Delay before image reveal triggers |
| `data-ca-parallax` | float (e.g., `0.3`, `-0.2`) | Scroll-linked vertical parallax. Negative = reverse |
| `data-ca-magnetic` | (presence) | Cursor-following magnetic effect. Desktop only |
| `data-ca-magnetic-strength` | float (default `8`) | Magnetic pull distance in px |
| `data-ca-stagger` | (presence, on parent) | Auto-stagger children reveal on scroll |
| `data-ca-stagger-delay` | ms integer (default `80`) | Delay between each child |
| `data-ca-counter` | integer target value | Animated count-up on scroll |

**Usage in render.php:**

```php
<!-- Section fades up on scroll -->
<section class="ca-block ca-stats" data-ca-reveal="up">

    <!-- Title words animate in sequentially -->
    <h2 class="ca-stats__title" data-ca-text-reveal="words">Perché Cesana</h2>

    <!-- Children of this grid stagger in one by one -->
    <div class="ca-stats__grid" data-ca-stagger data-ca-stagger-delay="100">
        <div class="ca-stats__item">
            <span data-ca-counter="30">0</span>
        </div>
        <!-- more items... -->
    </div>

    <!-- Image wipes in from left with gold accent bar -->
    <div data-ca-image-reveal="left">
        <?php echo wp_get_attachment_image(...); ?>
    </div>
</section>
```

---

## 5. Performance Patterns

### 5.1 Speculation Rules

Add to `includes/class-ca-performance.php` and initialize from main plugin file.

```php
class CA_Performance {
    public static function init() {
        add_action('wp_head', [__CLASS__, 'speculation_rules'], 99);
        add_action('wp_head', [__CLASS__, 'resource_hints'], 1);
        add_filter('wp_get_attachment_image_attributes', [__CLASS__, 'lcp_image_priority'], 10, 3);
    }

    /**
     * Speculation Rules API — prefetch/prerender on hover intent
     * Supported: Chrome 121+, Edge 121+
     * Fallback: browsers that don't support simply ignore the script tag
     */
    public static function speculation_rules() {
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
     * If fonts are self-hosted, remove Google Fonts preconnects
     */
    public static function resource_hints() {
        if (is_admin()) return;
        // Only if using Google Fonts (remove if self-hosting):
        echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
        echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
    }

    /**
     * Add fetchpriority="high" to images likely to be LCP
     */
    public static function lcp_image_priority($attr, $attachment, $size) {
        // Hero images will have this class set in render.php
        if (isset($attr['class']) && str_contains($attr['class'], 'ca-hero-lcp')) {
            $attr['fetchpriority'] = 'high';
            $attr['loading'] = 'eager';
        }
        return $attr;
    }
}
```

### 5.2 Script Loading Strategy

All frontend scripts use the `defer` strategy:

```php
wp_enqueue_script('cesana-animations', CESANA_BLOCKS_URL . 'assets/js/animations.js', [], CESANA_BLOCKS_VERSION, [
    'in_footer' => true,
    'strategy'  => 'defer',
]);
```

### 5.3 CSS content-visibility

Add to below-the-fold section blocks' CSS:

```css
.ca-services-grid,
.ca-faq,
.ca-testimonials,
.ca-stats,
.ca-consultation-form,
.ca-why-broker,
.ca-settori,
.ca-convenzioni {
    content-visibility: auto;
    contain-intrinsic-size: auto 600px;
}
```

### 5.4 Image Handling Checklist

For every block that displays images:

1. Store `attachment_id` (number) in block attributes, not URL strings
2. Use `wp_get_attachment_image()` in render.php — generates `srcset`, `sizes`, `width`, `height` automatically
3. Set appropriate `sizes` attribute: `100vw` for full-width heroes, `(max-width: 768px) 100vw, 50vw` for half-width, etc.
4. First visible image (LCP candidate): `loading="eager"`, `fetchpriority="high"`, class includes `ca-hero-lcp`
5. All other images: `loading="lazy"` (default)
6. Keep `imageUrl` attribute as companion for editor preview thumbnail

### 5.5 Font Loading

**Preferred: self-hosted fonts.** Download Inter and DM Serif Display WOFF2 files to `assets/fonts/`.

```php
// In main plugin file, replace Google Fonts enqueue with:
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('cesana-fonts', CESANA_BLOCKS_URL . 'assets/css/fonts.css', [], CESANA_BLOCKS_VERSION);
}, 5); // Priority 5 = before block styles

// fonts.css:
// @font-face rules with font-display: swap
```

**Acceptable: Google Fonts** — but always preconnect (see resource hints above).

---

## 6. Contact Form — REST API Pattern

### Endpoint Registration

```php
class CA_Contact_Form {
    const NAMESPACE = 'cesana/v1';

    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
    }

    public static function register_routes() {
        register_rest_route(self::NAMESPACE, '/contact', [
            'methods'             => 'POST',
            'callback'            => [__CLASS__, 'handle_submission'],
            'permission_callback' => '__return_true',
            'args'                => [
                'name'    => ['required' => true, 'sanitize_callback' => 'sanitize_text_field'],
                'email'   => ['required' => true, 'sanitize_callback' => 'sanitize_email', 'validate_callback' => 'is_email'],
                'message' => ['required' => true, 'sanitize_callback' => 'sanitize_textarea_field'],
                'phone'   => ['sanitize_callback' => 'sanitize_text_field'],
                'subject' => ['sanitize_callback' => 'sanitize_text_field'],
            ],
        ]);
    }

    public static function handle_submission($request) {
        // Rate limiting via transient (5 submissions per IP per hour)
        $ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '');
        $rate_key = 'ca_form_rate_' . md5($ip);
        $attempts = (int) get_transient($rate_key);

        if ($attempts >= 5) {
            return new WP_Error('rate_limited', 'Troppe richieste. Riprova tra qualche minuto.', ['status' => 429]);
        }

        set_transient($rate_key, $attempts + 1, HOUR_IN_SECONDS);

        // Honeypot
        if (!empty($request->get_param('website'))) {
            return new WP_Error('invalid', 'Invio non valido.', ['status' => 400]);
        }

        // Build and send email (same pattern as current wp_mail logic)
        $name = $request->get_param('name');
        $email = $request->get_param('email');
        // ... build email, call wp_mail() ...

        return rest_ensure_response([
            'success' => true,
            'message' => 'Grazie! Ti ricontatteremo entro 24 ore.',
        ]);
    }
}
```

### Frontend JS

```js
const ajaxUrl = '/wp-json/cesana/v1/contact';

const response = await fetch(ajaxUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, subject, message }),
});
```

Benefits over admin-ajax.php: doesn't load WP admin stack, proper HTTP status codes, RESTful, auto-validation via registered args.

---

## 7. Existing Blocks Reference

These blocks are fully designed (CSS exists) and have snippet references. Some have full implementations, others need editor.js + render.php + view.js.

| Block | Slug | Interactive? | Interactivity API? | Status |
|---|---|---|---|---|
| Hero Banner | `cesana/hero-banner` | Yes (carousel) | Migrate to view.js | ✅ Implemented |
| Page Hero | `cesana/page-hero` | No | N/A | CSS ready |
| Trust Indicators | `cesana/trust-indicators` | No | N/A | CSS ready |
| Services Grid | `cesana/services-grid` | No | N/A | CSS ready |
| Consultation Form | `cesana/consultation-form` | Yes (form submit) | Migrate to view.js | CSS + JS ready |
| FAQ Schema | `cesana/faq-schema` | Yes (accordion) | Migrate to view.js | CSS ready |
| CTA Banner | `cesana/cta-banner` | No | N/A | CSS ready |
| Testimonial Stats | `cesana/testimonial-stats` | No (counter is global) | N/A | CSS ready |
| Why Broker | `cesana/why-broker` | No | N/A | CSS ready |
| Settori & Servizi | `cesana/settori-servizi` | No | N/A | CSS ready |
| Convenzioni | `cesana/convenzioni` | No | N/A | CSS ready |
| Testimonials Slider | `cesana/testimonials-slider` | Yes (drag carousel) | Migrate to view.js | CSS + JS ready |

---

## 8. Generating a New Block — Step by Step

When asked to create a new block:

1. **Create the block folder** at `blocks/BLOCK-SLUG/`.
2. **Create `block.json`** following §2.1. Include `example` data.
3. **Create `editor.js`** following §2.2. Sidebar controls only, dark canvas placeholder.
4. **Create `render.php`** following §2.3. Use `wp_get_attachment_image()` for images. Escape all output. Add animation data attributes.
5. **Extract or create `style.css`** following §2.4. Use tokens only. Include responsive breakpoints.
6. **If the block has user interaction** (carousel, accordion, form), create `view.js` using the Interactivity API (§2.5).
7. **If the block has no interaction**, omit `view.js` — scroll animations are handled globally.
8. **Update `snippets.html`** with a code editor copy-paste snippet showing the block with realistic sample data.
9. **Verify** the block is auto-registered by the `cesana_blocks_register()` function in the main plugin file (it scans `blocks/*/block.json` automatically — no manual registration needed).

---

## 9. SVG Icon Library

Blocks use inline SVG icons. Standard set available (referenced in services-grid and trust-indicators):

`shield`, `handshake`, `chart`, `clock`, `search`, `scale`, `star`, `users`, `building`, `tool`, `shop`, `stethoscope`, `lock`, `car`, `heart`, `briefcase`, `plane`, `file-text`, `truck`, `phone`, `mail`, `map-pin`, `check`, `arrow-right`, `arrow-up-right`, `chevron-down`, `quote`, `x`

All icons render at the size set by their parent container. Standard viewBox: `0 0 24 24`. Stroke-based, `stroke="currentColor" stroke-width="2" fill="none"`.

---

## 10. Accessibility Checklist

For every block, verify:

- [ ] Interactive elements have visible `:focus-visible` outlines (gold, 2px)
- [ ] All images have meaningful `alt` text or `alt=""` if decorative
- [ ] Carousels: `aria-roledescription="carousel"`, `aria-label` on container, `aria-live="polite"` region for slide announcements
- [ ] Accordion triggers: `aria-expanded`, `aria-controls` pointing to content ID
- [ ] Navigation dots: `role="tablist"` on container, `role="tab"` on each dot, `aria-current="true"` on active
- [ ] Buttons: `aria-label` when text is not self-describing (arrows, icons)
- [ ] `prefers-reduced-motion: reduce` disables all animations, transitions, and parallax
- [ ] Color contrast: gold on navy passes WCAG AA for large text. Body text on white passes AA.
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages are associated via `aria-describedby`

---

## 11. theme.json Integration — Design Token Bridge

The plugin registers its design tokens into WordPress's editor settings so that the gold/navy palette, typography scale, and spacing appear in **every color picker, font selector, and spacing control** in the editor — including core blocks (Paragraph, Heading, Button, Cover, etc.). This creates visual cohesion between plugin blocks and any core blocks the user places on the page.

### Option A: From the plugin via PHP filter (preferred — no theme dependency)

Add to `includes/class-ca-theme-json.php`:

```php
class CA_Theme_JSON {
    public static function init() {
        add_filter('wp_theme_json_data_default', [__CLASS__, 'inject_tokens']);
    }

    public static function inject_tokens($theme_json) {
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
                        ['slug' => 'ca-xs',  'size' => 'clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem)',  'name' => 'XS'],
                        ['slug' => 'ca-sm',  'size' => 'clamp(0.8125rem, 0.78rem + 0.2vw, 0.9375rem)', 'name' => 'Small'],
                        ['slug' => 'ca-base','size' => 'clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)',       'name' => 'Base'],
                        ['slug' => 'ca-lg',  'size' => 'clamp(1.0625rem, 1rem + 0.35vw, 1.1875rem)',   'name' => 'Large'],
                        ['slug' => 'ca-xl',  'size' => 'clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)',       'name' => 'XL'],
                        ['slug' => 'ca-2xl', 'size' => 'clamp(1.5rem, 1.3rem + 0.8vw, 2rem)',          'name' => '2XL'],
                        ['slug' => 'ca-3xl', 'size' => 'clamp(2rem, 1.5rem + 1.8vw, 3rem)',            'name' => '3XL'],
                        ['slug' => 'ca-4xl', 'size' => 'clamp(2.5rem, 1.8rem + 2.5vw, 3.75rem)',       'name' => '4XL'],
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
```

Initialize from main plugin file:

```php
require_once CESANA_BLOCKS_PATH . 'includes/class-ca-theme-json.php';
CA_Theme_JSON::init();
```

**What this achieves:**

- The WordPress color picker in every block shows ONLY the Cesana palette (navy, gold, grays) — not the default WordPress rainbow. A user editing a Paragraph block picks from the same colors the plugin blocks use.
- Font selector shows DM Serif Display and Inter with the correct fallback stacks.
- Font size presets match the fluid `clamp()` scale from the CSS tokens exactly.
- Spacing controls (padding, margin, gap) offer the same scale used in plugin blocks.
- `contentSize` and `wideSize` match `--ca-max-width` and `--ca-max-width-text`.

**Why `wp_theme_json_data_default` and not `wp_theme_json_data_theme`:**

The `_default` filter injects at the lowest priority — a companion theme's `theme.json` can still override if needed. This means the plugin provides sensible defaults that work out of the box, but a theme retains full control. If you want the plugin to override the theme (stronger opinion), use `wp_theme_json_data_theme` instead.

### Option B: Companion starter theme (if shipping a theme)

If you also ship a minimal block theme, place these same settings directly in the theme's `theme.json`:

```
cesana-theme/
├── theme.json          # Contains all settings from Option A as native JSON
├── style.css           # Required: Theme Name header only, no actual CSS
├── templates/
│   ├── index.html      # Required: minimal template
│   ├── front-page.html # Homepage composing plugin blocks
│   ├── page.html       # Generic page template
│   └── single.html     # Single post template
└── parts/
    ├── header.html     # Site header
    └── footer.html     # Site footer
```

The templates would simply compose plugin blocks:

```html
<!-- templates/front-page.html -->
<!-- wp:template-part {"slug":"header"} /-->
<!-- wp:cesana/hero-banner /-->
<!-- wp:cesana/trust-indicators /-->
<!-- wp:cesana/services-grid /-->
<!-- wp:cesana/cta-banner /-->
<!-- wp:cesana/testimonial-stats /-->
<!-- wp:cesana/faq-schema /-->
<!-- wp:cesana/consultation-form /-->
<!-- wp:template-part {"slug":"footer"} /-->
```

**Recommendation:** Use Option A (plugin filter) as the baseline. It works regardless of which theme is active. If the client wants a turnkey solution with pre-composed templates, also ship the companion theme.

### WordPress CSS Custom Properties Sync

When WordPress processes the `theme.json` palette, it auto-generates CSS custom properties in the format `--wp--preset--color--SLUG`. To bridge these with the existing `--ca-*` tokens in your CSS, add this to `assets/css/tokens.css`:

```css
:root {
    /* Bridge WP preset vars to CA design tokens */
    --ca-navy:       var(--wp--preset--color--ca-navy, #0C0C14);
    --ca-gold:       var(--wp--preset--color--ca-gold, #B8973F);
    /* ... etc for all tokens ... */

    /* Font families */
    --ca-font-display: var(--wp--preset--font-family--ca-display, 'DM Serif Display', Georgia, serif);
    --ca-font-sans:    var(--wp--preset--font-family--ca-sans, 'Inter', -apple-system, sans-serif);
}
```

This way, if a theme overrides a color in its own `theme.json`, the override flows through to all plugin block styles automatically via the CSS cascade. The fallback values ensure everything works even if the theme.json bridge isn't active.

---

## 12. Content & Brand Rules

See `CLAUDE.md` for complete brand guidelines. Key rules for block generation:

- **Language:** Italian. Professional-reassuring tone. Never bureaucratic, never colloquial.
- **Positioning:** Cesana is a BROKER (independent intermediary), never "agente" or "assicuratore."
- **CTA:** "Ottieni una consulenza gratuita" or "Contattaci."
- **Don't invent** products, conventions, or partners not documented in CLAUDE.md.
- **Compliance:** Insurance sector is IVASS-regulated. No promises on prices, returns, or specific guarantees.
- **Every product page** must include a consultation form block.