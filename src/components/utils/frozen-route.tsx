"use client";

import { useContext, useMemo } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function FrozenRoute({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useMemo(() => context, []);

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}
