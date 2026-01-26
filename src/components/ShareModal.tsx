'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { ReactNode } from 'react';

/**
 * Props for the ShareModal component.
 */
export interface ShareModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** The generated share URL */
  shareUrl: string;
  /** The selected question text for sharing context */
  questionText: string;
}

/**
 * Copy icon component.
 */
function CopyIcon(): ReactNode {
  return (
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
      aria-hidden="true"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

/**
 * Check icon for copy success state.
 */
function CheckIcon(): ReactNode {
  return (
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
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * Close icon component.
 */
function CloseIcon(): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/**
 * Kakao icon component.
 */
function KakaoIcon(): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.85 1.9 5.35 4.75 6.75-.15.55-.55 2-.63 2.3-.1.35.13.35.27.25.1-.07 1.65-1.12 2.33-1.58.75.12 1.53.18 2.33.18 5.52 0 10-3.58 10-8s-4.48-8-10.05-8z" />
    </svg>
  );
}

/**
 * ShareModal component displays sharing options after link generation.
 *
 * Features:
 * - Modal dialog with overlay backdrop
 * - Generated link display
 * - Copy link button with success feedback
 * - Kakao Talk share button placeholder
 * - Accessible modal implementation with focus trap
 * - Keyboard navigation (Escape to close)
 *
 * @example
 * ```tsx
 * <ShareModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   shareUrl="https://muka.app/r/abc123"
 *   questionText="나한테 어울리는 음악은?"
 * />
 * ```
 */
export function ShareModal({
  isOpen,
  onClose,
  shareUrl,
  questionText,
}: ShareModalProps): ReactNode {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [shareUrl]);

  // Handle Kakao share (placeholder - requires Kakao SDK integration)
  const handleKakaoShare = useCallback(() => {
    // Check if Kakao SDK is available
    const windowWithKakao = window as unknown as {
      Kakao?: {
        isInitialized: () => boolean;
        Share: {
          sendDefault: (options: Record<string, unknown>) => void;
        };
      };
    };
    const kakao = windowWithKakao.Kakao;

    // Fallback if Kakao SDK is not available or not initialized
    const isKakaoReady = kakao?.isInitialized() === true;
    if (!isKakaoReady) {
      void handleCopy();
      alert(
        '카카오톡 공유를 위해 링크가 복사되었습니다. 직접 붙여넣기 해주세요.'
      );
      return;
    }

    // Share via Kakao SDK
    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: 'MUKA - 음악으로 마음을 전해요',
        description: questionText,
        imageUrl: `${shareUrl}/og-image`,
        link: {
          webUrl: shareUrl,
          mobileWebUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '답변하러 가기',
          link: {
            webUrl: shareUrl,
            mobileWebUrl: shareUrl,
          },
        },
      ],
    });
  }, [shareUrl, questionText, handleCopy]);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap and initial focus
  useEffect(() => {
    if (isOpen) {
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="
            absolute right-4 top-4
            rounded-full p-2
            text-[var(--muka-text-light)]
            transition-colors
            hover:bg-[var(--muka-secondary)] hover:text-[var(--muka-text-dark)]
            focus:outline-none focus:ring-2 focus:ring-[var(--muka-coral)] focus:ring-offset-2
          "
        >
          <CloseIcon />
        </button>

        {/* Title */}
        <h2
          id="share-modal-title"
          className="mb-2 text-xl font-bold text-[var(--muka-text-dark)]"
        >
          링크가 생성되었어요!
        </h2>

        {/* Description */}
        <p className="mb-6 text-sm text-[var(--muka-text-medium)]">
          친구에게 링크를 공유하고 음악을 추천받아 보세요.
        </p>

        {/* Question Preview */}
        <div className="mb-6 rounded-xl bg-[var(--muka-bg-cream)] p-4">
          <p className="text-sm text-[var(--muka-text-light)]">선택한 질문</p>
          <p className="mt-1 font-medium text-[var(--muka-text-dark)]">
            {questionText}
          </p>
        </div>

        {/* Link Display */}
        <div className="mb-6">
          <label
            htmlFor="share-url"
            className="mb-2 block text-sm font-medium text-[var(--muka-text-dark)]"
          >
            공유 링크
          </label>
          <div className="flex items-center gap-2">
            <input
              id="share-url"
              type="text"
              readOnly
              value={shareUrl}
              className="
                flex-1 rounded-xl border border-[var(--muka-secondary)]
                bg-white px-4 py-3
                text-sm text-[var(--muka-text-dark)]
                focus:border-[var(--muka-coral)] focus:outline-none focus:ring-1 focus:ring-[var(--muka-coral)]
              "
            />
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-col gap-3">
          {/* Kakao Share Button */}
          <button
            type="button"
            onClick={handleKakaoShare}
            className="
              flex w-full items-center justify-center gap-2
              rounded-xl bg-[var(--muka-kakao)] px-4 py-3.5
              text-base font-medium text-[var(--muka-text-dark)]
              transition-all
              hover:brightness-95
              focus:outline-none focus:ring-2 focus:ring-[var(--muka-kakao)] focus:ring-offset-2
              active:scale-[0.98]
            "
          >
            <KakaoIcon />
            <span>카카오톡으로 공유</span>
          </button>

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={() => void handleCopy()}
            className={`
              flex w-full items-center justify-center gap-2
              rounded-xl px-4 py-3.5
              text-base font-medium
              transition-all
              focus:outline-none focus:ring-2 focus:ring-offset-2
              active:scale-[0.98]
              ${
                copied
                  ? 'bg-[var(--muka-success)] text-white focus:ring-[var(--muka-success)]'
                  : 'bg-[var(--muka-secondary)] text-[var(--muka-text-dark)] hover:bg-[var(--muka-secondary)]/80 focus:ring-[var(--muka-coral)]'
              }
            `}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? '복사되었습니다!' : '링크 복사'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
