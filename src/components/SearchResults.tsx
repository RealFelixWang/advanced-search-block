/**
 * Search Results Component
 * 
 * Displays search results with pagination
 */

import React from 'react';
import { Post } from '../types';

interface SearchResultsProps {
  posts: Post[];
  total: number;
  pages: number;
  currentPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  showPagination: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  posts,
  total,
  pages,
  currentPage,
  loading,
  onPageChange,
  showPagination,
}) => {
  /**
   * Generate pagination page numbers
   */
  const getPaginationPages = (): (number | string)[] => {
    const delta = 2; // Number of pages to show on each side of current page
    const range: (number | string)[] = [];
    
    for (let i = 1; i <= pages; i++) {
      if (
        i === 1 ||
        i === pages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    
    return range;
  };

  /**
   * Format date string
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="asb-loading">
        <div className="asb-spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  /**
   * Render no results state
   */
  if (!loading && posts.length === 0) {
    return (
      <div className="asb-no-results">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3>No posts found</h3>
        <p>Try adjusting your search filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="asb-results">
      {/* Results Count */}
      <div className="asb-results-header">
        <p className="asb-results-count">
          Found <strong>{total}</strong> {total === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* Posts Grid */}
      <div className="asb-posts-grid">
        {posts.map((post) => (
          <article key={post.id} className="asb-post-card">
            {/* Featured Image */}
            {post.featured_image && (
              <div className="asb-post-image">
                <img src={post.featured_image} alt={post.title} />
              </div>
            )}
            
            {/* Post Content */}
            <div className="asb-post-content">
              {/* Categories */}
              {post.categories.length > 0 && (
                <div className="asb-post-categories">
                  {post.categories.map((cat) => (
                    <span key={cat.id} className="asb-category-badge">
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Title */}
              <h2 className="asb-post-title">
                <a href={post.link}>{post.title}</a>
              </h2>
              
              {/* Meta */}
              <div className="asb-post-meta">
                <span className="asb-post-author">By {post.author}</span>
                <span className="asb-post-date">{formatDate(post.date)}</span>
              </div>
              
              {/* Excerpt */}
              <div className="asb-post-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
              
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="asb-post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag.id} className="asb-tag-badge">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Read More */}
              <a href={post.link} className="asb-read-more">
                Read More →
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && pages > 1 && (
        <div className="asb-pagination">
          {/* Previous Button */}
          <button
            className="asb-page-button asb-page-prev"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
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
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Previous
          </button>

          {/* Page Numbers */}
          <div className="asb-page-numbers">
            {getPaginationPages().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="asb-page-ellipsis">...</span>
                ) : (
                  <button
                    className={`asb-page-number ${
                      page === currentPage ? 'active' : ''
                    }`}
                    onClick={() => onPageChange(page as number)}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            className="asb-page-button asb-page-next"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pages}
            aria-label="Next page"
          >
            Next
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
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;