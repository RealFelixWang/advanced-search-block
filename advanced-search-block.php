<?php
/**
 * Plugin Name: Advanced Search Block
 * Plugin URI: https://github.com/RealFelixWang/advanced-search-block
 * Description: A Gutenberg block for advanced search functionality with keyword, category, and tag filtering
 * Version: 1.0.0
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author: Felix Wang
 * Author URI: https://github.com/RealFelixWang/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: advanced-search-block
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ASB_VERSION', '1.0.0');
define('ASB_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ASB_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Initialize the plugin
 */
function asb_init() {
    // Load plugin classes
    require_once ASB_PLUGIN_DIR . 'includes/class-advanced-search-block.php';
    require_once ASB_PLUGIN_DIR . 'includes/class-rest-api.php';
    
    // Initialize main plugin class
    $plugin = new Advanced_Search_Block();
    
    // Initialize REST API
    $rest_api = new Advanced_Search_REST_API();
    add_action('rest_api_init', array($rest_api, 'register_routes'));
}
add_action('plugins_loaded', 'asb_init');

/**
 * Activation hook
 */
function asb_activate() {
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'asb_activate');

/**
 * Deactivation hook
 */
function asb_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'asb_deactivate');