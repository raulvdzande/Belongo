import { QuizFlow } from "@/components/quiz/QuizFlow";

export default function TestPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 dark:bg-black px-4 py-12">
      <div className="w-full max-w-2xl mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          De Perfecte Plek-Test
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          25 categorieën, 3 vragen per categorie, plus je deal-breakers en must-haves.
        </p>
      </div>
      <QuizFlow />
    </div>
  );
}
