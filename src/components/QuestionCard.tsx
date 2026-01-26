'use client';

import type { Question } from '@/types';
import type { ReactNode } from 'react';

/**
 * Props for the QuestionCard component.
 */
export interface QuestionCardProps {
  /** The question data to display */
  question: Question;
  /** Whether the card is currently selected */
  selected: boolean;
  /** Callback when the card is selected */
  onSelect: () => void;
}

/**
 * QuestionCard component displays a single question template.
 * Used in the question selection page for Sender A to choose a question.
 *
 * Features:
 * - Displays question text and optional description
 * - Hover/tap effects for interactivity
 * - Selected state indicator with coral border
 * - Accessible button element with ARIA labels
 *
 * @example
 * ```tsx
 * <QuestionCard
 *   question={question}
 *   selected={selectedId === question.id}
 *   onSelect={() => handleSelect(question.id)}
 * />
 * ```
 */
export function QuestionCard({
  question,
  selected,
  onSelect,
}: QuestionCardProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`질문 선택: ${question.template}`}
      className={`
        w-full rounded-xl bg-white p-4 text-left
        transition-all duration-200 ease-in-out
        card-shadow hover:card-shadow-hover
        focus:outline-none focus:ring-2 focus:ring-[var(--muka-coral)] focus:ring-offset-2
        active:scale-[0.98]
        ${
          selected
            ? 'border-2 border-[var(--muka-coral)] bg-[var(--muka-coral)]/5'
            : 'border-2 border-transparent hover:border-[var(--muka-coral)]/30'
        }
      `}
    >
      <p
        className={`
          text-lg font-normal leading-relaxed
          ${selected ? 'text-[var(--muka-coral-dark)]' : 'text-[var(--muka-text-dark)]'}
        `}
      >
        {question.template}
      </p>
      {question.description !== null && question.description !== '' && (
        <p className="mt-1.5 text-sm text-[var(--muka-text-light)]">
          {question.description}
        </p>
      )}
    </button>
  );
}
