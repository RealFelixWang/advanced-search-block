/**
 * Advanced Search Block - Editor Component
 * 
 * Displays block settings in the WordPress editor
 */

import React from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';

interface EditProps {
  attributes: {
    showTags: boolean;
    showPagination: boolean;
    postsPerPage: number;
  };
  setAttributes: (attrs: Partial<EditProps['attributes']>) => void;
}

const Edit: React.FC<EditProps> = ({ attributes, setAttributes }) => {
  const blockProps = useBlockProps();
  const { showTags, showPagination, postsPerPage } = attributes;

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Search Settings', 'advanced-search-block')}>
          <ToggleControl
            label={__('Show Tags Filter', 'advanced-search-block')}
            help={__('Allow users to filter by tags', 'advanced-search-block')}
            checked={showTags}
            onChange={(value) => setAttributes({ showTags: value })}
          />
          <ToggleControl
            label={__('Show Pagination', 'advanced-search-block')}
            help={__('Display pagination controls', 'advanced-search-block')}
            checked={showPagination}
            onChange={(value) => setAttributes({ showPagination: value })}
          />
          <RangeControl
            label={__('Posts Per Page', 'advanced-search-block')}
            value={postsPerPage}
            onChange={(value) => setAttributes({ postsPerPage: value || 10 })}
            min={5}
            max={50}
            step={5}
          />
        </PanelBody>
      </InspectorControls>
      
      <div {...blockProps}>
        <div className="advanced-search-block-placeholder">
          <div className="icon">
            <span className="dashicons dashicons-search"></span>
          </div>
          <h3>{__('Advanced Search Block', 'advanced-search-block')}</h3>
          <p>
            {__('This block will display a search form with the following settings:', 'advanced-search-block')}
          </p>
          <ul>
            <li>
              {__('Tags Filter:', 'advanced-search-block')}{' '}
              <strong>{showTags ? __('Enabled', 'advanced-search-block') : __('Disabled', 'advanced-search-block')}</strong>
            </li>
            <li>
              {__('Pagination:', 'advanced-search-block')}{' '}
              <strong>{showPagination ? __('Enabled', 'advanced-search-block') : __('Disabled', 'advanced-search-block')}</strong>
            </li>
            <li>
              {__('Posts Per Page:', 'advanced-search-block')} <strong>{postsPerPage}</strong>
            </li>
          </ul>
          <p className="note">
            {__('Configure settings in the sidebar panel →', 'advanced-search-block')}
          </p>
        </div>
      </div>
    </>
  );
};

export default Edit;