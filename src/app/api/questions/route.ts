import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { ErrorCode, type QuestionsResponse } from '@/types';

/**
 * GET /api/questions
 *
 * Fetches all question templates ordered by the 'order' field.
 * Returns 7 predefined questions for the link generation flow.
 *
 * @returns {QuestionsResponse} Array of questions
 */
export async function GET(): Promise<NextResponse<QuestionsResponse>> {
  try {
    const questions = await prisma.question.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Failed to fetch questions:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.DATABASE_ERROR,
          message: 'Failed to fetch questions',
        },
      },
      { status: 500 }
    );
  }
}
