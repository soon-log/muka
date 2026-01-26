'use client';

import { useCallback, useEffect, useState } from 'react';

import { QuestionCard } from '@/components/QuestionCard';
import { ShareModal } from '@/components/ShareModal';
import { createLink, getQuestions } from '@/lib/api';

import type { Question } from '@/types';
import type { ReactNode } from 'react';

/**
 * Loading skeleton for question cards.
 */
function QuestionCardSkeleton(): ReactNode {
  return (
    <div className="w-full animate-pulse rounded-xl bg-white p-4 card-shadow">
      <div className="h-6 w-3/4 rounded bg-[var(--muka-secondary)]" />
      <div className="mt-2 h-4 w-1/2 rounded bg-[var(--muka-secondary)]" />
    </div>
  );
}

/**
 * Error display component.
 */
function ErrorDisplay({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-[var(--muka-error)]/10 p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--muka-error)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="mb-4 text-[var(--muka-text-medium)]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="
          rounded-xl bg-[var(--muka-coral)] px-6 py-3
          font-medium text-white
          transition-all
          hover:bg-[var(--muka-coral-dark)]
          focus:outline-none focus:ring-2 focus:ring-[var(--muka-coral)] focus:ring-offset-2
          active:scale-[0.98]
        "
      >
        다시 시도
      </button>
    </div>
  );
}

/**
 * Question Selection Page
 *
 * This page allows Sender A to select a question template
 * and generate a shareable link for music recommendations.
 *
 * Features:
 * - Fetches 7 question templates from API
 * - Displays questions in a card grid
 * - Handles question selection and link generation
 * - Shows ShareModal with generated link
 * - Loading and error states with retry option
 */
export default function QuestionSelectionPage(): ReactNode {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [generatingLink, setGeneratingLink] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Fetch questions on mount
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      setError('질문을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchQuestions();
  }, [fetchQuestions]);

  // Handle question selection
  const handleSelectQuestion = useCallback(async (question: Question) => {
    setSelectedQuestion(question);
    setGeneratingLink(true);

    try {
      const linkData = await createLink(question.id);
      setShareUrl(linkData.shareUrl);
      setShareModalOpen(true);
    } catch (err) {
      console.error('Failed to generate link:', err);
      setError('링크 생성에 실패했습니다. 다시 시도해 주세요.');
      setSelectedQuestion(null);
    } finally {
      setGeneratingLink(false);
    }
  }, []);

  // Close share modal
  const handleCloseModal = useCallback(() => {
    setShareModalOpen(false);
    setSelectedQuestion(null);
    setShareUrl('');
  }, []);

  return (
    <div className="min-h-screen bg-[var(--muka-bg-cream)]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--muka-bg-cream)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[640px] items-center px-4">
          <h1 className="text-2xl font-bold text-[var(--muka-coral)]">muka</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[640px] px-4 pb-8 pt-4">
        {/* Instruction Text */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--muka-text-dark)]">
            질문을 선택해 주세요
          </h2>
          <p className="mt-2 text-[var(--muka-text-medium)]">
            친구에게 음악을 추천받고 싶은 질문을 골라보세요.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div
            className="flex flex-col gap-3"
            aria-busy="true"
            aria-live="polite"
          >
            {Array.from({ length: 7 }).map((_, index) => (
              <QuestionCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {/* Error State */}
        {error !== null && !loading ? (
          <ErrorDisplay message={error} onRetry={() => void fetchQuestions()} />
        ) : null}

        {/* Questions List */}
        {!loading && error === null && (
          <div
            className="flex flex-col gap-3"
            role="list"
            aria-label="질문 목록"
          >
            {questions.map((question) => (
              <div key={question.id} role="listitem">
                <QuestionCard
                  question={question}
                  selected={selectedQuestion?.id === question.id}
                  onSelect={() => void handleSelectQuestion(question)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Link Generation Loading Overlay */}
        {generatingLink ? (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            role="alert"
            aria-live="assertive"
          >
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--muka-coral)] border-t-transparent" />
                <span className="text-[var(--muka-text-dark)]">
                  링크 생성 중...
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={handleCloseModal}
        shareUrl={shareUrl}
        questionText={selectedQuestion?.template ?? ''}
      />
    </div>
  );
}
