import { createContext, useContext, useState, ReactNode } from "react";

export type SimilarResults = {
  metadata: { surah_number: number; surah_name_arabic: string; aya_number: number };
}[];

export const SimilarResultsContext = createContext<{
  similarResults: SimilarResults;
  setSimilarResults: (results: SimilarResults) => void;
}>({
  similarResults: [],
  setSimilarResults: () => {},
});

export const SimilarResultsProvider = ({ children }: { children: ReactNode }) => {
  const [similarResults, setSimilarResults] = useState<SimilarResults>([]);

  return (
    <SimilarResultsContext.Provider value={{ similarResults, setSimilarResults }}>
      {children}
    </SimilarResultsContext.Provider>
  );
};

export const useSimilarResults = () => useContext(SimilarResultsContext);
