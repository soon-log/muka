/**
 * Type definitions for MUKA Link Generation System
 * SPEC-LINK-001
 */

// =============================================================================
// Database Models
// =============================================================================

/**
 * Question model representing a question template.
 */
export interface Question {
  id: number;
  template: string;
  description: string | null;
  category: string;
  order: number;
  createdAt: Date;
}

/**
 * Link model representing a generated shareable link.
 */
export interface Link {
  id: number;
  hash: string;
  questionId: number;
  used: boolean;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Link with related question data.
 */
export interface LinkWithQuestion extends Link {
  question: Question;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Base API response structure.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * API error structure.
 */
export interface ApiError {
  code: string;
  message: string;
}

// =============================================================================
// GET /api/questions Response
// =============================================================================

/**
 * Response for GET /api/questions endpoint.
 */
export type QuestionsResponse = ApiResponse<Question[]>;

// =============================================================================
// POST /api/links Request/Response
// =============================================================================

/**
 * Request body for POST /api/links endpoint.
 */
export interface CreateLinkRequest {
  questionId: number;
}

/**
 * Data returned when a link is created.
 */
export interface CreateLinkData {
  hash: string;
  shareUrl: string;
  expiresAt: string;
}

/**
 * Response for POST /api/links endpoint.
 */
export type CreateLinkResponse = ApiResponse<CreateLinkData>;

// =============================================================================
// GET /api/links/[hash] Response
// =============================================================================

/**
 * Data returned when fetching a link by hash.
 */
export interface GetLinkData {
  id: number;
  hash: string;
  used: boolean;
  expired: boolean;
  question: Question;
}

/**
 * Response for GET /api/links/[hash] endpoint.
 */
export type GetLinkResponse = ApiResponse<GetLinkData>;

// =============================================================================
// Error Codes
// =============================================================================

/**
 * API error codes for consistent error handling.
 */
export const ErrorCode = {
  // Validation errors
  INVALID_REQUEST: 'INVALID_REQUEST',
  INVALID_QUESTION_ID: 'INVALID_QUESTION_ID',

  // Link errors
  LINK_NOT_FOUND: 'LINK_NOT_FOUND',
  LINK_EXPIRED: 'LINK_EXPIRED',
  LINK_ALREADY_USED: 'LINK_ALREADY_USED',

  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];
