/**
 * API Client Utility for MUKA Link Generation System
 * Provides typed fetch functions for client-side use.
 *
 * SPEC-LINK-001
 */

import type {
  ApiResponse,
  CreateLinkData,
  CreateLinkRequest,
  GetLinkData,
  Question,
} from '@/types';

/**
 * API error class for handling fetch errors.
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base fetch wrapper with error handling.
 */
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Merge additional headers if provided
  if (options?.headers !== undefined) {
    const additionalHeaders = options.headers;
    if (additionalHeaders instanceof Headers) {
      additionalHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(additionalHeaders)) {
      additionalHeaders.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, additionalHeaders);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!data.success || data.data === undefined) {
    throw new ApiError(
      data.error?.code ?? 'UNKNOWN_ERROR',
      data.error?.message ?? 'An unknown error occurred',
      response.status
    );
  }

  return data.data;
}

/**
 * Fetch all questions.
 *
 * @returns Promise<Question[]> Array of question templates
 * @throws {ApiError} If the request fails
 *
 * @example
 * ```ts
 * const questions = await getQuestions();
 * console.log(questions[0].template);
 * ```
 */
export async function getQuestions(): Promise<Question[]> {
  return fetchApi<Question[]>('/api/questions');
}

/**
 * Create a new shareable link for a question.
 *
 * @param questionId - The ID of the selected question
 * @returns Promise<CreateLinkData> Generated link data
 * @throws {ApiError} If the question ID is invalid or request fails
 *
 * @example
 * ```ts
 * const link = await createLink(4);
 * console.log(link.shareUrl); // https://muka.app/r/a1b2c3d4e5
 * ```
 */
export async function createLink(questionId: number): Promise<CreateLinkData> {
  const body: CreateLinkRequest = { questionId };

  return fetchApi<CreateLinkData>('/api/links', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Fetch a link by its hash.
 *
 * @param hash - The unique 10-character hash
 * @returns Promise<GetLinkData> Link data with question details
 * @throws {ApiError} If link not found, expired, or already used
 *
 * @example
 * ```ts
 * try {
 *   const link = await getLink('a1b2c3d4e5');
 *   console.log(link.question.template);
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     if (error.code === 'LINK_EXPIRED') {
 *       // Handle expired link
 *     }
 *   }
 * }
 * ```
 */
export async function getLink(hash: string): Promise<GetLinkData> {
  return fetchApi<GetLinkData>(`/api/links/${encodeURIComponent(hash)}`);
}
