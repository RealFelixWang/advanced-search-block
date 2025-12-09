<?php
/**
 * Advanced Search REST API Class
 * 
 * Handles REST API endpoints for search functionality
 *
 * @package Advanced_Search_Block
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Advanced_Search_REST_API {
    
    /**
     * API namespace
     */
    const NAMESPACE = 'advanced-search/v1';
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Search posts endpoint
        register_rest_route(self::NAMESPACE, '/search', array(
            'methods' => 'GET',
            'callback' => array($this, 'search_posts'),
            'permission_callback' => '__return_true',
            'args' => array(
                'q' => array(
                    'type' => 'string',
                    'default' => '',
                    'sanitize_callback' => 'sanitize_text_field',
                ),
                'cat' => array(
                    'type' => 'integer',
                    'default' => 0,
                    'sanitize_callback' => 'absint',
                ),
                'tags' => array(
                    'type' => 'array',
                    'default' => array(),
                    'items' => array(
                        'type' => 'integer',
                    ),
                ),
                'page' => array(
                    'type' => 'integer',
                    'default' => 1,
                    'sanitize_callback' => 'absint',
                ),
                'per_page' => array(
                    'type' => 'integer',
                    'default' => 10,
                    'sanitize_callback' => 'absint',
                ),
            ),
        ));
        
        // Get categories endpoint
        register_rest_route(self::NAMESPACE, '/categories', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_categories'),
            'permission_callback' => '__return_true',
        ));
        
        // Get tags endpoint
        register_rest_route(self::NAMESPACE, '/tags', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_tags'),
            'permission_callback' => '__return_true',
        ));
    }
    
    /**
     * Search posts based on parameters
     *
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response|WP_Error Response object or error
     */
    public function search_posts($request) {
        $keyword = $request->get_param('q');
        $category = $request->get_param('cat');
        $tags = $request->get_param('tags');
        $page = max(1, $request->get_param('page'));
        $per_page = max(1, min(50, $request->get_param('per_page')));
        
        // Build query arguments
        $args = array(
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => $per_page,
            'paged' => $page,
            'orderby' => 'date',
            'order' => 'DESC',
        );
        
        // Add keyword search
        if (!empty($keyword)) {
            $args['s'] = $keyword;
        }
        
        // Add category filter
        if ($category > 0) {
            $args['cat'] = $category;
        }
        
        // Add tags filter
        if (!empty($tags) && is_array($tags)) {
            $args['tag__in'] = array_map('absint', $tags);
        }
        
        // Execute query
        $query = new WP_Query($args);
        
        // Format posts
        $posts = array();
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                
                $post_id = get_the_ID();
                $categories = wp_get_post_categories($post_id, array('fields' => 'all'));
                $tags_list = wp_get_post_tags($post_id, array('fields' => 'all'));
                
                $posts[] = array(
                    'id' => $post_id,
                    'title' => get_the_title(),
                    'excerpt' => get_the_excerpt(),
                    'date' => get_the_date('c'),
                    'link' => get_permalink(),
                    'author' => get_the_author(),
                    'categories' => array_map(function($cat) {
                        return array(
                            'id' => $cat->term_id,
                            'name' => $cat->name,
                            'slug' => $cat->slug,
                        );
                    }, $categories),
                    'tags' => array_map(function($tag) {
                        return array(
                            'id' => $tag->term_id,
                            'name' => $tag->name,
                            'slug' => $tag->slug,
                        );
                    }, $tags_list),
                    'featured_image' => get_the_post_thumbnail_url($post_id, 'medium'),
                );
            }
            wp_reset_postdata();
        }
        
        // Return response
        return new WP_REST_Response(array(
            'posts' => $posts,
            'total' => $query->found_posts,
            'pages' => $query->max_num_pages,
            'current_page' => $page,
        ), 200);
    }
    
    /**
     * Get all categories
     *
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response Response object
     */
    public function get_categories($request) {
        $categories = get_categories(array(
            'hide_empty' => false,
            'orderby' => 'name',
            'order' => 'ASC',
        ));
        
        $formatted_categories = array_map(function($cat) {
            return array(
                'id' => $cat->term_id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'count' => $cat->count,
            );
        }, $categories);
        
        return new WP_REST_Response($formatted_categories, 200);
    }
    
    /**
     * Get all tags
     *
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response Response object
     */
    public function get_tags($request) {
        $tags = get_tags(array(
            'hide_empty' => false,
            'orderby' => 'name',
            'order' => 'ASC',
        ));
        
        $formatted_tags = array_map(function($tag) {
            return array(
                'id' => $tag->term_id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'count' => $tag->count,
            );
        }, $tags);
        
        return new WP_REST_Response($formatted_tags, 200);
    }
}