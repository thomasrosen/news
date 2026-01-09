import { ArticleList } from "@/components/ArticleList";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="font-semibold text-2xl mb-8 tracking-tighter">The Articles</h1>
        <ArticleList />
      </main>
    </div>
  );
}
