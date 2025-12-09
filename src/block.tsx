/**
 * Advanced Search Block - Block Edit Component
 * 
 * Edit component for the Advanced Search Block
 */

import Edit from './edit';

// Export the Edit component for WordPress to use
wp.blocks.registerBlockType('advanced-search/block', {
    edit: Edit,
    save: () => null, // This block is rendered on the server
});