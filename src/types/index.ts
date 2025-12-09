/**
 * Type definitions for Advanced Search Block
 */

export interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  author: string;
  categories: Category[];
  tags: Tag[];
  featured_image: string | null;
}

export interface SearchParams {
  q: string;
  cat: number;
  tags: number[];
  page: number;
}

export interface SearchResponse {
  posts: Post[];
  total: number;
  pages: number;
  current_page: number;
}

export interface BlockAttributes {
  showTags: boolean;
  showPagination: boolean;
  postsPerPage: number;
}

export interface SearchFormProps {
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

export interface SearchResultsProps {
  posts: Post[];
  total: number;
  pages: number;
  currentPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  showPagination: boolean;
}