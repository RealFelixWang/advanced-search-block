<?php
/**
 * Advanced Search Block Render Template
 *
 * @package Advanced_Search_Block
 */

// Get block attributes
$show_tags = isset($attributes['showTags']) ? $attributes['showTags'] : true;
$show_pagination = isset($attributes['showPagination']) ? $attributes['showPagination'] : true;
$posts_per_page = isset($attributes['postsPerPage']) ? $attributes['postsPerPage'] : 10;

// Enqueue frontend assets
wp_enqueue_style('advanced-search-block-style');
?>

<div class="wp-block-advanced-search-block" 
     data-show-tags="<?php echo esc_attr($show_tags ? 'true' : 'false'); ?>"
     data-show-pagination="<?php echo esc_attr($show_pagination ? 'true' : 'false'); ?>"
     data-posts-per-page="<?php echo esc_attr($posts_per_page); ?>">
    
    <div class="advanced-search-form">
        <div class="search-input-group">
            <input type="text" 
                   class="advanced-search-input" 
                   placeholder="<?php esc_attr_e('Search...', 'advanced-search-block'); ?>"
                   value="<?php echo esc_attr(get_search_query()); ?>">
            <button type="button" class="advanced-search-button">
                <?php esc_html_e('Search', 'advanced-search-block'); ?>
            </button>
        </div>
        
        <div class="search-filters">
            <select class="category-filter">
                <option value=""><?php esc_html_e('All Categories', 'advanced-search-block'); ?></option>
                <?php
                $categories = get_categories(array('orderby' => 'name', 'order' => 'ASC'));
                foreach ($categories as $category) {
                    echo '<option value="' . esc_attr($category->term_id) . '">' . esc_html($category->name) . '</option>';
                }
                ?>
            </select>
            
            <?php if ($show_tags) : ?>
            <select class="tag-filter">
                <option value=""><?php esc_html_e('All Tags', 'advanced-search-block'); ?></option>
                <?php
                $tags = get_tags(array('orderby' => 'name', 'order' => 'ASC'));
                foreach ($tags as $tag) {
                    echo '<option value="' . esc_attr($tag->term_id) . '">' . esc_html($tag->name) . '</option>';
                }
                ?>
            </select>
            <?php endif; ?>
        </div>
    </div>
    
    <div class="search-results">
        <div class="results-container"></div>
        <?php if ($show_pagination) : ?>
        <div class="pagination-container"></div>
        <?php endif; ?>
    </div>
</div>

<?php
// Enqueue frontend script
wp_enqueue_script('advanced-search-block-frontend');