import type { ReactNode } from 'react';

export default function Home(): ReactNode {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-16 py-32">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          MUKA
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          음악으로 마음을 전해요
        </p>
      </main>
    </div>
  );
}
