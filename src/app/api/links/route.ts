import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import {
  ErrorCode,
  type CreateLinkRequest,
  type CreateLinkResponse,
} from '@/types';

/**
 * Link expiration duration in days.
 */
const LINK_EXPIRATION_DAYS = 7;

/**
 * Length of the generated hash.
 */
const HASH_LENGTH = 10;

/**
 * Get the base URL for share links.
 */
function getBaseUrl(): string {
  const appUrl = process.env['NEXT_PUBLIC_APP_URL'];
  const vercelUrl = process.env['VERCEL_URL'];

  // Use NEXT_PUBLIC_APP_URL if available
  if (appUrl !== undefined && appUrl !== '') {
    return appUrl;
  }

  // Fallback for Vercel deployment
  if (vercelUrl !== undefined && vercelUrl !== '') {
    return `https://${vercelUrl}`;
  }

  // Fallback for local development
  return 'http://localhost:3000';
}

/**
 * POST /api/links
 *
 * Creates a new shareable link for a selected question.
 * Generates a unique 10-character hash using nanoid.
 * Sets expiration to 7 days from creation.
 *
 * @param request - Request with questionId in body
 * @returns {CreateLinkResponse} Generated link data with hash and share URL
 */
export async function POST(
  request: Request
): Promise<NextResponse<CreateLinkResponse>> {
  try {
    // Parse request body - use unknown for runtime validation
    const body: unknown = await request.json();

    // Validate request body structure
    if (
      typeof body !== 'object' ||
      body === null ||
      !('questionId' in body) ||
      typeof (body as Record<string, unknown>)['questionId'] !== 'number'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.INVALID_REQUEST,
            message: 'questionId is required and must be a number',
          },
        },
        { status: 400 }
      );
    }

    const { questionId } = body as CreateLinkRequest;

    // Validate questionId is positive
    if (questionId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.INVALID_REQUEST,
            message: 'questionId must be a positive number',
          },
        },
        { status: 400 }
      );
    }

    // Verify question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (question === null) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.INVALID_QUESTION_ID,
            message: `Question with ID ${String(questionId)} not found`,
          },
        },
        { status: 400 }
      );
    }

    // Generate unique hash
    const hash = nanoid(HASH_LENGTH);

    // Calculate expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + LINK_EXPIRATION_DAYS);

    // Create link record
    const link = await prisma.link.create({
      data: {
        hash,
        questionId,
        expiresAt,
      },
    });

    // Construct share URL
    const baseUrl = getBaseUrl();
    const shareUrl = `${baseUrl}/r/${hash}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          hash: link.hash,
          shareUrl,
          expiresAt: link.expiresAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create link:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to create link',
        },
      },
      { status: 500 }
    );
  }
}
