import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { ErrorCode, type GetLinkResponse } from '@/types';

/**
 * Route parameters for GET /api/links/[hash]
 */
interface RouteParams {
  params: Promise<{
    hash: string;
  }>;
}

/**
 * Check if a link has expired.
 */
function isExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * GET /api/links/[hash]
 *
 * Fetches a link by its hash and validates its status.
 * Returns link details with the associated question.
 *
 * Error cases:
 * - 404: Link not found
 * - 410: Link expired
 * - 409: Link already used
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing the hash
 * @returns {GetLinkResponse} Link data with question details
 */
export async function GET(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse<GetLinkResponse>> {
  try {
    const { hash } = await params;

    // Validate hash parameter (empty string check for runtime safety)
    if (hash === '') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.INVALID_REQUEST,
            message: 'Invalid link hash',
          },
        },
        { status: 400 }
      );
    }

    // Fetch link with question data
    const link = await prisma.link.findUnique({
      where: { hash },
      include: {
        question: true,
      },
    });

    // Check if link exists
    if (link === null) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.LINK_NOT_FOUND,
            message: 'Link not found',
          },
        },
        { status: 404 }
      );
    }

    // Check if link is expired
    const expired = isExpired(link.expiresAt);
    if (expired) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.LINK_EXPIRED,
            message: 'Link has expired',
          },
        },
        { status: 410 }
      );
    }

    // Check if link is already used
    if (link.used) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.LINK_ALREADY_USED,
            message: 'Link has already been used',
          },
        },
        { status: 409 }
      );
    }

    // Return link data with question
    return NextResponse.json({
      success: true,
      data: {
        id: link.id,
        hash: link.hash,
        used: link.used,
        expired,
        question: link.question,
      },
    });
  } catch (error) {
    console.error('Failed to fetch link:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: 'Failed to fetch link',
        },
      },
      { status: 500 }
    );
  }
}
