import type { APIRoute } from "astro";
import quran from "./quran.json";
function getAyahFromSurah(surah: number, ayah: number) {
  const checkSurah = (quran as any).data[surah - 1];
  if (!checkSurah) {
    throw new Error(`No surah found for sura ${surah}`);
  }
  const checkAyah = checkSurah.verses[ayah - 1];
  if (!checkAyah) {
    throw new Error(`No surah found for ayah ${ayah} `);
  }
  const dataSurah = { ...checkSurah };
  delete dataSurah.verses;
  const data = { ...checkAyah, surah: dataSurah };
  return data;
}

export const GET: APIRoute = async ({ params }) => {
  const { surahNumber, ayaNumber } = params;

  if (!surahNumber || !ayaNumber) {
    return new Response(
      JSON.stringify({
        message: "Should provide a surah/ayah number",
      }),
      { status: 404 }
    );
  }
  // const quranApiLink = `https://api.quran.gading.dev/surah/${surahNumber}/${ayaNumber}`;
  // const surahMetadata = await fetch(quranApiLink)
  //   .then((response) => response.json())
  //   .then((d) => d.data);
  return new Response(
    JSON.stringify({
      ...getAyahFromSurah(Number(surahNumber), Number(ayaNumber)),
    }),
    { status: 200 }
  );
};
