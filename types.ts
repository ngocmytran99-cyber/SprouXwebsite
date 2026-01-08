
import React from 'react';

export interface Creator {
  name: string;
  role: string;
  description: string;
  image: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export type ContentStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  authorId: string;
  content: string;
  status: ContentStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  categoryIds: string[];
  tags: string[];
  coverImage: string;
  seoScore?: number;
  seo: SEOData;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string; // For hierarchy
}

export type MediaType = 'image' | 'video' | 'document' | 'other';

export interface MediaAttachment {
  id: string;
  fileName: string;
  fileType: MediaType;
  mimeType: string;
  fileSize: number; // in bytes
  url: string;
  title: string;
  altText?: string;
  caption?: string;
  description?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ContentBlock {
  id: string; // The stable content key (e.g., 'hero-title')
  type: 'text' | 'image' | 'icon-text' | 'video' | 'richtext' | 'link' | 'pricing-plan' | 'faq-item';
  value: string;
  label: string;
  metadata?: {
    group?: string; // e.g., 'Hero Section', 'Benefits'
    selector?: string; // css class to target for visual highlight
    locked?: boolean;
    alt?: string;
    icon?: string; // String identifier for lucide-react icon
    editable?: boolean;
    highlighted?: boolean;
    type?: string;
  };
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'private';
  updatedAt: string;
  blocks: ContentBlock[];
}

// Strictly CMS Roles
export type UserRole = 'administrator' | 'editor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  lastLogin?: string;
}

// Help Center Specific Types (Frontend compatible)
export type AudienceType = 'creator' | 'backer';

export interface CategoryMetadata {
  id: string;
  label: string;
  description: string;
  icon: string;
  audience: AudienceType;
}

export interface SubcategoryMetadata {
  id: string;
  categoryId: string;
  label: string;
  description: string;
  icon: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  readingTime: number;
  audience: AudienceType;
  category: string;
  subcategory: string;
  icon: string;
  updatedAt: string;
  isCritical?: boolean;
  status?: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
}

// Strictly Namespaced Help Desk CMS types
export interface HelpDeskCategory extends CategoryMetadata {}
export interface HelpDeskTopic extends SubcategoryMetadata {}
export interface HelpDeskArticle extends Article {}
