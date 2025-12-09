<?php
/**
 * Advanced Search Block Main Class
 * 
 * Handles block registration and asset enqueuing
 *
 * @package Advanced_Search_Block
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Advanced_Search_Block {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'register_block'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
    }
    
    /**
     * Register the Gutenberg block
     */
    public function register_block() {
        // Register block script
        wp_register_script(
            'advanced-search-block-editor',
            ASB_PLUGIN_URL . 'build/edit.js',
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-api-fetch'),
            ASB_VERSION,
            true
        );
        
        // Register block styles
        wp_register_style(
            'advanced-search-block-editor',
            ASB_PLUGIN_URL . 'build/style-style-index.css',
            array('wp-edit-blocks'),
            ASB_VERSION
        );
        
        wp_register_style(
            'advanced-search-block-style',
            ASB_PLUGIN_URL . 'build/style-style-index.css',
            array(),
            ASB_VERSION
        );
        
        // Register the block
        register_block_type('advanced-search/block', array(
            'editor_script' => 'advanced-search-block-editor',
            'editor_style'  => 'advanced-search-block-editor',
            'style'         => 'advanced-search-block-style',
            'render_callback' => array($this, 'render_block'),
            'attributes' => array(
                'showTags' => array(
                    'type' => 'boolean',
                    'default' => true,
                ),
                'showPagination' => array(
                    'type' => 'boolean',
                    'default' => true,
                ),
                'postsPerPage' => array(
                    'type' => 'number',
                    'default' => 10,
                ),
            ),
        ));
    }
    
    /**
     * Render block on frontend
     *
     * @param array $attributes Block attributes
     * @return string Block HTML
     */
    public function render_block($attributes) {
        // Enqueue frontend script
        wp_enqueue_script(
            'advanced-search-block-frontend',
            ASB_PLUGIN_URL . 'build/frontend.js',
            array('wp-element', 'wp-api-fetch'),
            ASB_VERSION,
            true
        );
        
        // Pass attributes to JavaScript
        wp_localize_script(
            'advanced-search-block-frontend',
            'asbConfig',
            array(
                'restUrl' => rest_url('advanced-search/v1/'),
                'nonce' => wp_create_nonce('wp_rest'),
                'attributes' => $attributes,
            )
        );
        
        // Return container div - React will mount here
        return '<div class="advanced-search-block" data-attributes="' . esc_attr(json_encode($attributes)) . '"></div>';
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueue_frontend_assets() {
        if (has_block('advanced-search/block')) {
            wp_enqueue_style(
                'advanced-search-block-style',
                ASB_PLUGIN_URL . 'build/style-style-index.css',
                array(),
                ASB_VERSION
            );
        }
    }
}