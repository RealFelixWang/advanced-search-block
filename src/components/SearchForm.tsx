/**
 * Search Form Component
 * 
 * Displays the advanced search form with keyword, category, tags, and pagination
 */

import React, { useState, useEffect } from 'react';
import { Category, Tag, SearchParams } from '../types';

interface SearchFormProps {
  keyword: string;
  categoryId: number;
  tagIds: number[];
  page: number;
  categories: Category[];
  tags: Tag[];
  onSearch: (params: SearchParams) => void;
  showTags: boolean;
  showPagination: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  keyword,
  categoryId,
  tagIds,
  page,
  categories,
  tags,
  onSearch,
  showTags,
  showPagination,
}) => {
  const [localKeyword, setLocalKeyword] = useState(keyword);
  const [localCategory, setLocalCategory] = useState(categoryId);
  const [localTags, setLocalTags] = useState<number[]>(tagIds);

  // Update local state when props change (from URL)
  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  useEffect(() => {
    setLocalCategory(categoryId);
  }, [categoryId]);

  useEffect(() => {
    setLocalTags(tagIds);
  }, [tagIds]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  /**
   * Perform search with current form values
   */
  const performSearch = () => {
    onSearch({
      q: localKeyword,
      cat: localCategory,
      tags: localTags,
      page: 1, // Reset to first page on new search
    });
  };

  /**
   * Handle keyword input change
   */
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalKeyword(value);
  };

  /**
   * Handle category selection change
   */
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setLocalCategory(value);
    
    // Trigger immediate search on category change
    onSearch({
      q: localKeyword,
      cat: value,
      tags: localTags,
      page: 1,
    });
  };

  /**
   * Handle tag checkbox change
   */
  const handleTagChange = (tagId: number, checked: boolean) => {
    let newTags: number[];
    
    if (checked) {
      newTags = [...localTags, tagId];
    } else {
      newTags = localTags.filter((id) => id !== tagId);
    }
    
    setLocalTags(newTags);
    
    // Trigger immediate search on tag change
    onSearch({
      q: localKeyword,
      cat: localCategory,
      tags: newTags,
      page: 1,
    });
  };

  /**
   * Handle clear filters
   */
  const handleClear = () => {
    setLocalKeyword('');
    setLocalCategory(0);
    setLocalTags([]);
    
    onSearch({
      q: '',
      cat: 0,
      tags: [],
      page: 1,
    });
  };

  return (
    <div className="asb-search-form">
      <form onSubmit={handleSubmit} className="asb-form">
        {/* Keyword Search */}
        <div className="asb-form-group">
          <label htmlFor="asb-keyword" className="asb-label">
            Keyword
          </label>
          <div className="asb-input-wrapper">
            <input
              type="text"
              id="asb-keyword"
              className="asb-input"
              placeholder="Search posts..."
              value={localKeyword}
              onChange={handleKeywordChange}
            />
            <button type="submit" className="asb-search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="asb-form-group">
          <label htmlFor="asb-category" className="asb-label">
            Category
          </label>
          <select
            id="asb-category"
            className="asb-select"
            value={localCategory}
            onChange={handleCategoryChange}
          >
            <option value="0">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.count || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Tags Filter (Optional) */}
        {showTags && tags.length > 0 && (
          <div className="asb-form-group">
            <label className="asb-label">Tags</label>
            <div className="asb-tags-grid">
              {tags.map((tag) => (
                <label key={tag.id} className="asb-tag-checkbox">
                  <input
                    type="checkbox"
                    checked={localTags.includes(tag.id)}
                    onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                  />
                  <span>{tag.name}</span>
                  <span className="asb-tag-count">({tag.count || 0})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        {(localKeyword || localCategory > 0 || localTags.length > 0) && (
          <div className="asb-form-actions">
            <button type="button" className="asb-clear-button" onClick={handleClear}>
              Clear All Filters
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;