"use client";
import { useEffect, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useRouter } from "next/navigation";

const AudioPlayerComponent = ({
  src,
  surah,
  ayaNumber,
  surahNumber,
}: {
  src: string;
  surah: any;
  ayaNumber: number;
  surahNumber: number;
}) => {
  const numberOfVerses = surah.surah.numberOfVerses;
  const router = useRouter();
  const audioRef: React.Ref<AudioPlayer> = useRef(null);

  function nextAyah() {
    if (Number(ayaNumber) < numberOfVerses) {
      router.push(`/surah/${surahNumber}/${ayaNumber + 1}`);
    } else {
      router.push(`/surah/${surahNumber + 1}/1`);
    }
  }

  useEffect(() => {
    return () => {
      audioRef.current?.audio.current?.pause();
    };
  });
  function previousAyah() {
    if (ayaNumber === 1) {
      router.push(`/surah/${surahNumber - 1}/1`);
    } else {
      router.push(`/surah/${surahNumber}/${ayaNumber - 1}`);
    }
  }
  return (
    <AudioPlayer
      showDownloadProgress={false}
      showFilledProgress={false}
      showFilledVolume={false}
      showSkipControls={true}
      showJumpControls={false}
      layout="stacked-reverse"
      ref={audioRef}
      className="audio-player"
      style={{
        direction: "ltr",
      }}
      autoPlay
      src={src}
      onClickNext={nextAyah}
      onClickPrevious={previousAyah}
    />
  );
};

export default AudioPlayerComponent;
