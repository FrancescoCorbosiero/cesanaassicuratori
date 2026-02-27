<?php
/**
 * Plugin Name: Cesana Assicuratori Blocks
 * Plugin URI: https://www.cesanaassicuratori.it
 * Description: Blocchi Gutenberg per broker assicurativo indipendente. Design editoriale con palette nero/oro.
 * Version: 1.0.0
 * Author: Cesana Assicuratori
 * Author URI: https://www.cesanaassicuratori.it
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: cesana-assicuratori-blocks
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
    exit;
}

define('CESANA_BLOCKS_VERSION', '1.0.0');
define('CESANA_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('CESANA_BLOCKS_URL', plugin_dir_url(__FILE__));

/**
 * Enqueue frontend assets
 */
function cesana_blocks_enqueue_assets()
{
    wp_enqueue_style(
        'cesana-blocks-fonts',
        'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );

    wp_enqueue_style(
        'cesana-blocks-style',
        CESANA_BLOCKS_URL . 'style.css',
        array('cesana-blocks-fonts'),
        CESANA_BLOCKS_VERSION
    );

    wp_enqueue_script(
        'cesana-animations',
        CESANA_BLOCKS_URL . 'js/animations.js',
        array(),
        CESANA_BLOCKS_VERSION,
        true
    );

    wp_enqueue_script(
        'cesana-contact-form',
        CESANA_BLOCKS_URL . 'js/contact-form.js',
        array(),
        CESANA_BLOCKS_VERSION,
        true
    );

    wp_localize_script('cesana-contact-form', 'cesanaForm', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('ca_contact_form'),
    ));
}
add_action('wp_enqueue_scripts', 'cesana_blocks_enqueue_assets');

/**
 * Enqueue editor assets
 */
function cesana_blocks_editor_assets()
{
    wp_enqueue_style(
        'cesana-blocks-fonts',
        'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );

    wp_enqueue_style(
        'cesana-blocks-editor',
        CESANA_BLOCKS_URL . 'editor.css',
        array('cesana-blocks-fonts'),
        CESANA_BLOCKS_VERSION
    );
}
add_action('enqueue_block_editor_assets', 'cesana_blocks_editor_assets');

/**
 * Auto-register all blocks from blocks/ directory
 */
function cesana_blocks_register()
{
    $blocks_dir = CESANA_BLOCKS_PATH . 'blocks/';

    if (!is_dir($blocks_dir)) {
        return;
    }

    $block_folders = array_filter(glob($blocks_dir . '*'), 'is_dir');

    foreach ($block_folders as $block) {
        $block_json = $block . '/block.json';
        if (file_exists($block_json)) {
            register_block_type($block);
        }
    }
}
add_action('init', 'cesana_blocks_register');

/**
 * Register custom block category
 */
function cesana_blocks_category($categories)
{
    return array_merge(
        array(
            array(
                'slug'  => 'cesana',
                'title' => __('Cesana Assicuratori', 'cesana-assicuratori-blocks'),
                'icon'  => 'shield',
            ),
        ),
        $categories
    );
}
add_filter('block_categories_all', 'cesana_blocks_category', 10, 1);

/**
 * Load translations
 */
function cesana_blocks_load_textdomain()
{
    load_plugin_textdomain(
        'cesana-assicuratori-blocks',
        false,
        dirname(plugin_basename(__FILE__)) . '/languages'
    );
}
add_action('plugins_loaded', 'cesana_blocks_load_textdomain');

/**
 * Load contact form handler
 */
require_once CESANA_BLOCKS_PATH . 'includes/class-ca-contact-form.php';
CA_Contact_Form::init();
