import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Belongo
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Ontdek welk land, welke stad en welke wijk het beste bij je past — met een compleet
          verhuisplan.
        </p>
        <Link
          href="/test"
          className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Start de test
        </Link>
      </div>
    </div>
  );
}
