"use client";
import { useSimilarResults } from "@/context/similar-results";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface Match {
  metadata: {
    surah_name_arabic: string;
    surah_number: number;
    aya_number: number;
  };
}

export default function Recorder() {
  const { setSimilarResults, similarResults } = useSimilarResults();
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [disableRecorder, setDisableRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  const [inputText, setInputText] = useState("");

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
    fetch("/api/audio", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(({ matches, text }) => {
        setSimilarResults(matches);
        const mostSimilarOption = matches[0];
        const { aya_number, surah_number } = mostSimilarOption.metadata;
        router.push(`/surah/${surah_number}/${aya_number}`);
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
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.onstop = async function () {
        setIsRecorded(true);
        sendAudio();
      };
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleTextSubmit = () => {
    setIsLoading(true);
    fetch("/api/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    })
      .then((response) => response.json())
      .then(({ matches }) => {
        setSimilarResults(matches);
        const mostSimilarOption = matches[0];
        const { aya_number, surah_number } = mostSimilarOption.metadata;
        router.push(`/surah/${surah_number}/${aya_number}`);
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <label className="btn btn-circle swap swap-on">
        <input onClick={toggleRecording} checked={isRecording} type="checkbox" />
        <svg
          className="swap-off fill-current"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="35"
          height="35"
          viewBox="0 0 50 50">
          <path d="M 25 -0.03125 C 18.9375 -0.03125 13.96875 4.773438 13.96875 10.71875 L 13.96875 23.28125 C 13.96875 29.226563 18.9375 34.03125 25 34.03125 C 31.0625 34.03125 36.03125 29.226563 36.03125 23.28125 L 36.03125 10.71875 C 36.03125 4.773438 31.0625 -0.03125 25 -0.03125 Z M 25 2.03125 C 29.984375 2.03125 33.96875 5.914063 33.96875 10.71875 L 33.96875 11 L 28.5 11 C 28.46875 11 28.4375 11 28.40625 11 C 27.855469 11.027344 27.425781 11.496094 27.453125 12.046875 C 27.480469 12.597656 27.949219 13.027344 28.5 13 L 33.96875 13 L 33.96875 15 L 28.5 15 C 28.46875 15 28.4375 15 28.40625 15 C 27.855469 15.027344 27.425781 15.496094 27.453125 16.046875 C 27.480469 16.597656 27.949219 17.027344 28.5 17 L 33.96875 17 L 33.96875 19 L 28.5 19 C 28.46875 19 28.4375 19 28.40625 19 C 27.855469 19.027344 27.425781 19.496094 27.453125 20.046875 C 27.480469 20.597656 27.949219 21.027344 28.5 21 L 33.96875 21 L 33.96875 23.28125 C 33.96875 28.085938 29.984375 31.96875 25 31.96875 C 20.015625 31.96875 16.03125 28.085938 16.03125 23.28125 L 16.03125 21 L 21.5 21 C 21.859375 21.003906 22.195313 20.816406 22.378906 20.503906 C 22.558594 20.191406 22.558594 19.808594 22.378906 19.496094 C 22.195313 19.183594 21.859375 18.996094 21.5 19 L 16.03125 19 L 16.03125 17 L 21.5 17 C 21.859375 17.003906 22.195313 16.816406 22.378906 16.503906 C 22.558594 16.191406 22.558594 15.808594 22.378906 15.496094 C 22.195313 15.183594 21.859375 14.996094 21.5 15 L 16.03125 15 L 16.03125 13 L 21.5 13 C 21.859375 13.003906 22.195313 12.816406 22.378906 12.503906 C 22.558594 12.191406 22.558594 11.808594 22.378906 11.496094 C 22.195313 11.183594 21.859375 10.996094 21.5 11 L 16.03125 11 L 16.03125 10.71875 C 16.03125 5.914063 20.015625 2.03125 25 2.03125 Z M 9.8125 17.125 C 9.402344 17.210938 9.113281 17.582031 9.125 18 L 9.125 23 C 9.125 30.703125 14.671875 37.167969 21.96875 38.59375 L 21.96875 45 L 15.46875 45 C 13.566406 45 12 46.570313 12 48.46875 L 12 49.9375 L 37.875 49.9375 L 37.875 48.46875 C 37.875 46.570313 36.308594 45 34.40625 45 L 28.03125 45 L 28.03125 38.59375 C 35.328125 37.167969 40.875 30.703125 40.875 23 L 40.875 18 C 40.875 17.515625 40.484375 17.125 40 17.125 C 39.515625 17.125 39.125 17.515625 39.125 18 L 39.125 23 C 39.125 30.800781 32.800781 37.125 25 37.125 C 17.199219 37.125 10.875 30.800781 10.875 23 L 10.875 18 C 10.878906 17.75 10.773438 17.511719 10.589844 17.34375 C 10.402344 17.175781 10.15625 17.09375 9.90625 17.125 C 9.875 17.125 9.84375 17.125 9.8125 17.125 Z M 24.03125 38.8125 C 24.351563 38.832031 24.675781 38.875 25 38.875 C 25.324219 38.875 25.648438 38.832031 25.96875 38.8125 L 25.96875 44.96875 L 24.03125 44.96875 Z M 15.46875 47 L 22.75 47 C 22.832031 47.019531 22.914063 47.03125 23 47.03125 L 27 47.03125 C 27.074219 47.027344 27.148438 47.019531 27.21875 47 L 34.40625 47 C 35.046875 47 35.472656 47.421875 35.6875 47.96875 L 14.1875 47.96875 C 14.402344 47.421875 14.824219 47 15.46875 47 Z"></path>
        </svg>
        <svg
          className="swap-on fill-current "
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="35"
          height="35"
          viewBox="0 0 50 50">
          <path d="M 25 0 C 18.933594 0 14 4.800781 14 10.71875 L 14 23.28125 C 14 29.066406 18.714844 33.757813 24.59375 33.96875 C 24.800781 33.277344 25.066406 32.613281 25.375 31.96875 C 25.246094 31.976563 25.128906 32 25 32 C 20.039063 32 16 28.097656 16 23.28125 L 16 21 L 21.5 21 C 21.859375 21.003906 22.195313 20.816406 22.378906 20.503906 C 22.558594 20.191406 22.558594 19.808594 22.378906 19.496094 C 22.195313 19.183594 21.859375 18.996094 21.5 19 L 16 19 L 16 17 L 21.5 17 C 21.859375 17.003906 22.195313 16.816406 22.378906 16.503906 C 22.558594 16.191406 22.558594 15.808594 22.378906 15.496094 C 22.195313 15.183594 21.859375 14.996094 21.5 15 L 16 15 L 16 13 L 21.5 13 C 21.859375 13.003906 22.195313 12.816406 22.378906 12.503906 C 22.558594 12.191406 22.558594 11.808594 22.378906 11.496094 C 22.195313 11.183594 21.859375 10.996094 21.5 11 L 16 11 L 16 10.71875 C 16 5.902344 20.039063 2 25 2 C 29.960938 2 34 5.902344 34 10.71875 L 34 11 L 28.5 11 C 28.46875 11 28.4375 11 28.40625 11 C 28.375 11 28.34375 11 28.3125 11 C 27.761719 11.050781 27.355469 11.542969 27.40625 12.09375 C 27.457031 12.644531 27.949219 13.050781 28.5 13 L 34 13 L 34 15 L 28.5 15 C 28.46875 15 28.4375 15 28.40625 15 C 28.375 15 28.34375 15 28.3125 15 C 27.761719 15.050781 27.355469 15.542969 27.40625 16.09375 C 27.457031 16.644531 27.949219 17.050781 28.5 17 L 34 17 L 34 19 L 28.5 19 C 28.46875 19 28.4375 19 28.40625 19 C 28.375 19 28.34375 19 28.3125 19 C 27.761719 19.050781 27.355469 19.542969 27.40625 20.09375 C 27.457031 20.644531 27.949219 21.050781 28.5 21 L 34 21 L 34 23.28125 C 34 23.742188 33.945313 24.183594 33.875 24.625 C 34.542969 24.417969 35.261719 24.261719 35.96875 24.15625 C 35.992188 23.859375 36 23.585938 36 23.28125 L 36 10.71875 C 36 4.800781 31.066406 0 25 0 Z M 10 17 C 9.449219 17 9 17.445313 9 18 L 9 23 C 9 30.796875 14.609375 37.308594 22 38.71875 L 22 45 L 15.46875 45 C 13.546875 45 12 46.558594 12 48.46875 L 12 50 L 30.8125 50 C 29.867188 49.433594 29 48.765625 28.21875 48 L 14.0625 48 C 14.257813 47.417969 14.816406 47 15.46875 47 L 27.28125 47 C 26.757813 46.378906 26.316406 45.707031 25.90625 45 L 24 45 L 24 38.9375 C 24.015625 38.9375 24.046875 38.9375 24.0625 38.9375 C 24.042969 38.621094 24 38.320313 24 38 C 24 37.644531 24.035156 37.285156 24.0625 36.9375 C 16.785156 36.445313 11 30.398438 11 23 L 11 18 C 11 17.445313 10.550781 17 10 17 Z M 40 17 C 39.449219 17 39 17.445313 39 18 L 39 23 C 39 23.355469 38.964844 23.714844 38.9375 24.0625 C 39.617188 24.109375 40.289063 24.171875 40.9375 24.3125 C 40.972656 23.878906 41 23.445313 41 23 L 41 18 C 41 17.445313 40.550781 17 40 17 Z M 38 26 C 31.382813 26 26 31.382813 26 38 C 26 41.234375 27.316406 44.152344 29.40625 46.3125 C 29.425781 46.34375 29.445313 46.375 29.46875 46.40625 C 29.488281 46.425781 29.511719 46.449219 29.53125 46.46875 C 29.585938 46.527344 29.648438 46.582031 29.71875 46.625 C 31.875 48.699219 34.78125 50 38 50 C 44.617188 50 50 44.617188 50 38 C 50 34.8125 48.722656 31.933594 46.6875 29.78125 C 46.679688 29.761719 46.667969 29.738281 46.65625 29.71875 C 46.644531 29.707031 46.636719 29.699219 46.625 29.6875 C 46.53125 29.542969 46.402344 29.425781 46.25 29.34375 C 44.09375 27.289063 41.203125 26 38 26 Z M 38 28 C 40.398438 28 42.59375 28.851563 44.3125 30.25 L 30.25 44.3125 C 28.851563 42.59375 28 40.398438 28 38 C 28 32.464844 32.464844 28 38 28 Z M 45.75 31.6875 C 47.148438 33.40625 48 35.601563 48 38 C 48 43.535156 43.535156 48 38 48 C 35.601563 48 33.40625 47.148438 31.6875 45.75 Z"></path>
        </svg>
      </label>

      <div className="flex flex-col gap-2">
        <textarea
          id="text-input"
          placeholder="أدخل النص أو الآية هنا أو قم بالتسجيل"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="textarea textarea-bordered min-w-[250px] mt-4"
        />

        {(isRecorded || inputText?.length) && !loading ? (
          <button onClick={handleTextSubmit} className="btn btn-primary mt-2">
            بحث
          </button>
        ) : null}
      </div>
      {loading && <div className="loading" />}

      {!loading && similarResults.length > 0 ? (
        <>
          <div className="drawer drawer-end flex justify-center">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label
                htmlFor="my-drawer-4"
                className="drawer-button btn mt-2 self-center ">
                المزيد من النتائج
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer-4"
                aria-label="close sidebar"
                className="drawer-overlay"></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                {/* Sidebar content here */}
                {similarResults
                  .slice(1)
                  .map(
                    (
                      { metadata: { surah_number, surah_name_arabic, aya_number } },
                      index,
                    ) => (
                      <li key={index}>
                        <Link href={`/surah/${surah_number}/${aya_number}`}>
                          {surah_name_arabic} - {aya_number.toLocaleString("ar")}
                        </Link>
                      </li>
                    ),
                  )}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
