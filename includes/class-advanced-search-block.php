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
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_filter('allowed_block_types_all', array($this, 'allow_block_in_widget_area'), 10, 2);
        add_filter('block_type_metadata', array($this, 'set_block_edit_component'), 10, 2);
    }
    
    /**
     * Set the edit component for the block
     *
     * @param array $metadata Block metadata
     * @return array Modified metadata
     */
    public function set_block_edit_component($metadata) {
        if (isset($metadata['name']) && $metadata['name'] === 'advanced-search/block') {
            $metadata['editorScript'] = 'advanced-search-block-editor';
        }
        return $metadata;
    }
    
    /**
     * Register the block
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
        
        // Register the block with render callback and edit component
        register_block_type(
            'advanced-search/block',
            array(
                'render_callback' => array($this, 'render_block'),
                'editor_script' => 'advanced-search-block-editor',
                'editor_style'  => 'advanced-search-block-editor',
                'style'         => 'advanced-search-block-style',
                'attributes' => array(
                    'showTags' => array(
                        'type' => 'boolean',
                        'default' => true
                    ),
                    'showPagination' => array(
                        'type' => 'boolean',
                        'default' => true
                    ),
                    'postsPerPage' => array(
                        'type' => 'number',
                        'default' => 10
                    )
                ),
                'supports' => array(
                    'align' => array('left', 'right', 'center', 'wide', 'full'),
                    'html' => false,
                    'multiple' => true,
                    'reusable' => true,
                    'inserter' => true,
                ),
                'category' => 'widgets',
                'icon' => 'search',
                'keywords' => array('search', 'filter', 'category', 'tag', 'advanced'),
                'title' => 'Advanced Search Block',
                'description' => 'A powerful search block with keyword, category, and tag filtering.'
            )
        );
        
        // Add block to allowed blocks in all contexts
        add_filter('allowed_block_types_all', function($allowed_blocks, $block_editor_context) {
            // Always allow our block in any context, but don't block other blocks
            if ($allowed_blocks === true) {
                return true;
            } elseif (is_array($allowed_blocks)) {
                if (!in_array('advanced-search/block', $allowed_blocks)) {
                    $allowed_blocks[] = 'advanced-search/block';
                }
                return $allowed_blocks;
            } else {
                return array('advanced-search/block');
            }
        }, 10, 2);
        
        // Ensure block is available in post editor
        add_filter('allowed_block_types_all', function($allowed_blocks, $block_editor_context) {
            if (isset($block_editor_context->name) && $block_editor_context->name === 'core/edit-post') {
                if ($allowed_blocks === true) {
                    return true;
                } elseif (is_array($allowed_blocks)) {
                    if (!in_array('advanced-search/block', $allowed_blocks)) {
                        $allowed_blocks[] = 'advanced-search/block';
                    }
                    return $allowed_blocks;
                }
            }
            return $allowed_blocks;
        }, 20, 2);
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
            'advancedSearchBlock',
            array(
                'restUrl' => home_url('?rest_route=/advanced-search/v1/'),
                'nonce' => wp_create_nonce('wp_rest'),
                'attributes' => $attributes,
            )
        );
        
        // Return container div - React will mount here
        return '<div class="advanced-search-block" data-attributes="' . esc_attr(json_encode($attributes)) . '"></div>';
    }
    
    /**
     * Enqueue editor assets
     */
    public function enqueue_editor_assets() {
        wp_enqueue_script(
            'advanced-search-block-editor',
            ASB_PLUGIN_URL . 'build/edit.js',
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-api-fetch', 'wp-dom-ready'),
            ASB_VERSION,
            true
        );
        
        wp_enqueue_style(
            'advanced-search-block-editor',
            ASB_PLUGIN_URL . 'build/style-style-index.css',
            array('wp-edit-blocks'),
            ASB_VERSION
        );
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
    
    /**
     * Allow block in widget areas
     *
     * @param bool|array $allowed_block_types Array of allowed block types, or true to allow all
     * @param WP_Post $post The post to check
     * @return bool|array Modified allowed block types
     */
    public function allow_block_in_widget_area($allowed_block_types, $post) {
        // If it's a widget area or the inserter context is widget, allow our block
        if (is_null($post) || (isset($_REQUEST['context']) && $_REQUEST['context'] === 'widget')) {
            if (is_array($allowed_block_types)) {
                $allowed_block_types[] = 'advanced-search/block';
                return $allowed_block_types;
            } elseif ($allowed_block_types === true) {
                return true;
            } else {
                return array('advanced-search/block');
            }
        }
        
        return $allowed_block_types;
    }
}