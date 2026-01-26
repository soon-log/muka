import Link from 'next/link';

import type { ReactNode } from 'react';

/**
 * Music note icon for the hero section.
 */
function MusicNoteIcon(): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--muka-coral)]"
      aria-hidden="true"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

/**
 * Arrow right icon for the CTA button.
 */
function ArrowRightIcon(): ReactNode {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/**
 * Home Page
 *
 * Landing page for MUKA with hero section and CTA to start
 * the question selection flow.
 *
 * Features:
 * - MUKA branding with logo
 * - Hero section with value proposition
 * - Primary CTA button linking to /q
 * - Mobile-first responsive design
 */
export default function Home(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--muka-bg-cream)]">
      {/* Header */}
      <header className="mx-auto w-full max-w-[640px] px-4 pt-6">
        <h1 className="text-3xl font-bold text-[var(--muka-coral)]">muka</h1>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[640px] text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-[var(--muka-coral)]/10 p-4">
              <MusicNoteIcon />
            </div>
          </div>

          {/* Headline */}
          <h2 className="mb-4 text-2xl font-bold leading-tight text-[var(--muka-text-dark)] sm:text-3xl">
            친구에게 음악을 추천받아 보세요
          </h2>

          {/* Subheadline */}
          <p className="mb-8 text-base text-[var(--muka-text-medium)] sm:text-lg">
            질문을 선택하고 링크를 공유하면,
            <br />
            친구가 당신을 위한 음악을 추천해 줄 거예요.
          </p>

          {/* How it works */}
          <div className="mb-10 rounded-2xl bg-white p-6 card-shadow">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--muka-text-light)]">
              이렇게 진행돼요
            </h3>
            <ol className="space-y-4 text-left">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--muka-coral)] text-sm font-bold text-white">
                  1
                </span>
                <span className="text-[var(--muka-text-dark)]">
                  질문을 선택하세요
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--muka-coral)] text-sm font-bold text-white">
                  2
                </span>
                <span className="text-[var(--muka-text-dark)]">
                  생성된 링크를 친구에게 공유하세요
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--muka-coral)] text-sm font-bold text-white">
                  3
                </span>
                <span className="text-[var(--muka-text-dark)]">
                  친구가 추천한 음악을 받아보세요
                </span>
              </li>
            </ol>
          </div>

          {/* CTA Button */}
          <Link
            href="/q"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl bg-[var(--muka-coral)] px-8 py-4
              text-lg font-semibold text-white
              transition-all
              hover:bg-[var(--muka-coral-dark)]
              focus:outline-none focus:ring-2 focus:ring-[var(--muka-coral)] focus:ring-offset-2
              active:scale-[0.98]
            "
          >
            <span>시작하기</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-[640px] px-4 pb-6 text-center">
        <p className="text-sm text-[var(--muka-text-light)]">
          음악으로 마음을 전해요
        </p>
      </footer>
    </div>
  );
}
