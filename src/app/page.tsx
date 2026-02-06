import { ContentList } from "@/components/ContentList";
import { baseUrl, possible_subpaths } from "@/constants";
import React from "react";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
    <>
      <h1 className="font-semibold text-6xl mb-8 tracking-tighter">Startpage</h1>

      {possible_subpaths.map(subpath => <React.Fragment key={subpath}>
        <h2 className="font-semibold text-3xl mt-16 mb-4 tracking-tighter">{subpath}</h2>
        <ContentList subpath={subpath} />
      </React.Fragment>)}
    </>
  );
}
