import AudioPlayerComponent from "@/components/audio-player";
import Recorder from "@/components/recorder";
import { readFileSync } from "fs";

export async function generateMetadata({
  params: { surah, ayah },
}: {
  params: {
    surah: string;
    ayah: string;
  };
}) {
  const surahNumber = Number(surah);
  const ayahNumber = Number(ayah);
  const ayahData = await getAyahFromSurah(surahNumber, ayahNumber);
  const tafseer = JSON.parse(
    readFileSync(process.cwd() + "/src/app/tafseer.json", "utf-8"),
  );

  return {
    title: `إقرألي - ${ayahData.surah.name.long} - ${ayahNumber.toLocaleString("ar")}`,
  };
}
function getAyahFromSurah(surah: number, ayah: number): any {
  const quran = JSON.parse(readFileSync(process.cwd() + "/src/app/quran.json", "utf-8"));
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
export default async function Page({
  params: { surah, ayah },
}: {
  params: {
    surah: string;
    ayah: string;
  };
}) {
  const surahNumber = Number(surah);
  const ayahNumber = Number(ayah);
  const ayahData = await getAyahFromSurah(surahNumber, ayahNumber);
  const tafseer = JSON.parse(
    readFileSync(process.cwd() + "/src/app/tafseer.json", "utf-8"),
  );
  const ayahTafseer = tafseer.find(
    (t: { aya: string; number: string }) => t.aya === ayah && t.number === surah,
  );
  return (
    <div>
      <Recorder />
      <div>
        <h4>
          {ayahData.surah.name.long} - {ayahNumber.toLocaleString("ar")}
        </h4>
        <div className="divider"></div>
        <div>
          <p>{ayahData.text.arab}</p>
          <div className="container">
            <h4>تفسير</h4>
            <div className="divider"></div>
            <p>{ayahTafseer.text}</p>
          </div>
        </div>
      </div>

      <AudioPlayerComponent
        src={ayahData.audio.primary}
        surah={ayahData}
        surahNumber={surahNumber}
        ayaNumber={ayahNumber}
      />
    </div>
  );
}
