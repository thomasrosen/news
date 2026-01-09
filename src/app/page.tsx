import { ArticleList } from "@/components/ArticleList";

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
      <>
        <h1 className="font-semibold text-2xl mb-8 tracking-tighter">The Articles</h1>
        <ArticleList />
      </>
  );
}
