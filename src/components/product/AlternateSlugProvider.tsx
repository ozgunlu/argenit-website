"use client";

import { createContext, useCallback, useContext, useState } from "react";

type SlugMap = Record<string, string>; // locale -> slug

const AlternateSlugContext = createContext<{
  slugs: SlugMap;
  setSlugs: (slugs: SlugMap) => void;
}>({ slugs: {}, setSlugs: () => {} });

/** Wrap this around the layout so Header/LanguageSwitcher can read slugs */
export function AlternateSlugProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [slugs, setSlugs] = useState<SlugMap>({});

  return (
    <AlternateSlugContext value={{ slugs, setSlugs }}>
      {children}
    </AlternateSlugContext>
  );
}

/** Drop this inside a product page to push alternate slugs into context */
export function AlternateSlugSetter({ slugs }: { slugs: SlugMap }) {
  const { setSlugs } = useContext(AlternateSlugContext);
  // One-time set on mount via callback ref pattern
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) setSlugs(slugs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(slugs)],
  );
  return <div ref={ref} className="hidden" />;
}

export function useAlternateSlugs() {
  return useContext(AlternateSlugContext).slugs;
}
