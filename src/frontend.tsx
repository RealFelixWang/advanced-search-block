/**
 * Frontend Application
 * 
 * Handles the block rendering and functionality on the frontend
 */

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import apiFetch from '@wordpress/api-fetch';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import {
  Category,
  Tag,
  Post,
  SearchParams,
  SearchResponse,
  BlockAttributes,
} from './types';

/**
 * Main App Component
 */
const App: React.FC<{ attributes: BlockAttributes }> = ({ attributes }) => {
  const [keyword, setKeyword] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  /**
   * Parse URL parameters on mount
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const urlKeyword = params.get('q') || '';
    const urlCategory = parseInt(params.get('cat') || '0', 10);
    const urlTags = params.getAll('tags[]').map((id) => parseInt(id, 10));
    const urlPage = parseInt(params.get('page') || '1', 10);
    
    setKeyword(urlKeyword);
    setCategoryId(urlCategory);
    setTagIds(urlTags);
    setPage(urlPage);
    
    // Load categories and tags
    loadCategories();
    loadTags();
    
    // Perform initial search with URL params
    performSearch({
      q: urlKeyword,
      cat: urlCategory,
      tags: urlTags,
      page: urlPage,
    });
  }, []);

  /**
   * Load categories from API
   */
  const loadCategories = async () => {
    try {
      const response = await apiFetch<Category[]>({
        path: '/advanced-search/v1/categories',
      });
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  /**
   * Load tags from API
   */
  const loadTags = async () => {
    try {
      const response = await apiFetch<Tag[]>({
        path: '/advanced-search/v1/tags',
      });
      setTags(response);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  /**
   * Perform search with given parameters
   */
  const performSearch = async (params: SearchParams) => {
    setLoading(true);
    setKeyword(params.q);
    setCategoryId(params.cat);
    setTagIds(params.tags);
    setPage(params.page);
    
    // Update URL without page reload
    updateURL(params);
    
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      
      if (params.q) queryParams.append('q', params.q);
      if (params.cat > 0) queryParams.append('cat', params.cat.toString());
      params.tags.forEach((tagId) => queryParams.append('tags[]', tagId.toString()));
      queryParams.append('page', params.page.toString());
      queryParams.append('per_page', attributes.postsPerPage.toString());
      
      // Fetch search results
      const response = await apiFetch<SearchResponse>({
        path: `/advanced-search/v1/search?${queryParams.toString()}`,
      });
      
      setPosts(response.posts);
      setTotal(response.total);
      setPages(response.pages);
      
      // Scroll to top of results on page change (not on initial load)
      if (!initialLoad && params.page !== page) {
        const blockElement = document.querySelector('.advanced-search-block');
        if (blockElement) {
          blockElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      
      if (initialLoad) {
        setInitialLoad(false);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setPosts([]);
      setTotal(0);
      setPages(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update URL with search parameters
   */
  const updateURL = (params: SearchParams) => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams();
    
    if (params.q) searchParams.set('q', params.q);
    if (params.cat > 0) searchParams.set('cat', params.cat.toString());
    params.tags.forEach((tagId) => searchParams.append('tags[]', tagId.toString()));
    if (params.page > 1) searchParams.set('page', params.page.toString());
    
    url.search = searchParams.toString();
    window.history.pushState({}, '', url.toString());
  };

  /**
   * Handle search form submission
   */
  const handleSearch = (params: SearchParams) => {
    performSearch(params);
  };

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    performSearch({
      q: keyword,
      cat: categoryId,
      tags: tagIds,
      page: newPage,
    });
  };

  return (
    <div className="asb-app">
      <SearchForm
        keyword={keyword}
        categoryId={categoryId}
        tagIds={tagIds}
        page={page}
        categories={categories}
        tags={tags}
        onSearch={handleSearch}
        showTags={attributes.showTags}
        showPagination={attributes.showPagination}
      />
      
      <SearchResults
        posts={posts}
        total={total}
        pages={pages}
        currentPage={page}
        loading={loading}
        onPageChange={handlePageChange}
        showPagination={attributes.showPagination}
      />
    </div>
  );
};

/**
 * Initialize the app on all block instances
 */
document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.advanced-search-block');
  
  blocks.forEach((block) => {
    const attributesData = block.getAttribute('data-attributes');
    const attributes: BlockAttributes = attributesData
      ? JSON.parse(attributesData)
      : {
          showTags: true,
          showPagination: true,
          postsPerPage: 10,
        };
    
    const root = createRoot(block);
    root.render(<App attributes={attributes} />);
  });
});