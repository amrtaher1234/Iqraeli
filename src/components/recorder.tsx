"use client";

import { useState } from "react";
interface Match {
  metadata: {
    surah_name_arabic: string;
    surah_number: number;
    aya_number: number;
  };
}
interface Props {
  onResults?: (matches: {
    metadata: {
      surah_name_arabic: string;
      surah_number: number;
      aya_number: number;
    }[];
  }) => void;
}
export default function Recorder() {
  const [loading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isRecorded, setIsRecorded] = useState(false);
  const [disableRecorder, setDisableRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const chunks: any = [];
        mediaRecorder.ondataavailable = function (event) {
          chunks.push(event.data);
        };

        setMediaRecorder(mediaRecorder);
        setAudioChunks(chunks);
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      console.error("getUserMedia not supported on your browser!");
    }
  };
  const sendAudio = () => {
    setDisableRecorder(true);
    const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
    const formData = new FormData();
    setIsLoading(true);
    formData.append("audio", audioBlob, "recording.mp3");
    fetch("/audio", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(({ matches, text }) => {
        setMatches(matches);
        const mostSimilarOption = matches[0];
        const { aya_number, surah_number } = mostSimilarOption.metadata;
        if (onResults) {
          onResults(matches);
        }
        navigate(`/surah/${surah_number}/${aya_number}`, {
          state: history.state,
        });
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        setDisableRecorder(false);
        setIsLoading(false);
      });

    setAudioChunks([]);
    setIsRecorded(false);
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      // setDisableRecorder(true)
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.onstop = async function () {
        setIsRecorded(true);
      };
    }
  };

  const toggleRecording = () => {
    console.log("toggled");
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  return (
    <label className="btn btn-circle swap swap-rotate">
      {/* this hidden checkbox controls the state */}
      <input onClick={toggleRecording} checked={isRecording} type="checkbox" />

      {/* hamburger icon */}
      <svg
        className="swap-off fill-current"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 512 512">
        <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
      </svg>

      {/* close icon */}
      <svg
        className="swap-on fill-current"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 512 512">
        <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
      </svg>
    </label>
  );
}
