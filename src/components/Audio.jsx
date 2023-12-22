import { useState, useEffect, useRef } from "react";

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(new Audio(src));

  useEffect(() => {
    // Update the state when audio plays or pauses
    const audio = audioRef.current;
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("play", () => setIsPlaying(true));
      audio.removeEventListener("pause", () => setIsPlaying(false));
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <button
      onClick={() => togglePlayPause()}
      className="rounded-2xl bg-transparent border-[#94a197] p-2 border w-48 hover:bg-gray-200 active:bg-gray-300 transition duration-150 ease-in-out "
      lang="ar"
    >
      {isPlaying ? "إيقاف" : "تشغيل"}
    </button>
  );
};

export default AudioPlayer;
