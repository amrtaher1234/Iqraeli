"use client";

import { PropsWithChildren } from "react";
import { SimilarResultsProvider } from "./similar-results";

export function Providers({ children }: PropsWithChildren) {
  return <SimilarResultsProvider>{children}</SimilarResultsProvider>;
}
