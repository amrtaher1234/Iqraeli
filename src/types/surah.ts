export interface SurahType {
  text: {
    arab: string;
  };
  audio: {
    primary: string;
    secondary: string[];
  };
  tafsir?: string;
  surah: {
    number: number;
    numberOfVerses: number;
    name: {
      short: string;
      long: string;
    };
  };
  meta: {
    juz: number;
    page: number;
    hizbQuarter: 240;
  };
}
