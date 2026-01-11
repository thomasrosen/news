import { ContentList } from "@/components/ContentList";
import { possible_subpaths } from "@/constants";

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
      <>
        <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Startpage</h1>
        
        {possible_subpaths.map(subpath => <>
          <h2 className="font-semibold text-1xl mt-8 mb-4 tracking-tighter">{subpath}</h2>
          <ContentList key={subpath} subpath={subpath} />
        </>)}
      </>
  );
}
