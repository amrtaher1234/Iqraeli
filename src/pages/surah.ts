import type { APIRoute } from "astro";

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
  const quranApiLink = `https://api.quran.gading.dev/surah/${surahNumber}/${ayaNumber}`;
  const surahMetadata = await fetch(quranApiLink)
    .then((response) => response.json())
    .then((d) => d.data);
  return new Response(
    JSON.stringify({
      ...surahMetadata,
    }),
    { status: 200 }
  );
};
