import { useState } from "react";
import "./styles.css";
import { navigate } from "astro:transitions/client";

const RecordButton = () => {
  const [disableRecorder, setDisableRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const chunks = [];
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        setMediaRecorder(mediaRecorder);
        setAudioChunks(chunks);
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        // Handle the error appropriately
      }
    } else {
      console.error("getUserMedia not supported on your browser!");
      // Notify user that their browser does not support this feature
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      setDisableRecorder(true);
      mediaRecorder.stop();
      setIsRecording(false);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.mp3");

        fetch("/audio", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then(({ surahNumber, ayaNumber }) => {
            if (!surahNumber || !ayaNumber) {
              alert("error");
              return;
            }
            navigate(`/surah/${surahNumber}/${ayaNumber}`);
          })
          .catch((error) => console.error("Error:", error))
          .finally(() => {
            setDisableRecorder(false);
          });

        setAudioChunks([]);
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

  return (
    <button
      disabled={disableRecorder}
      onClick={() => {
        toggleRecording();
      }}
      className={`relative inline-flex items-center ${
        disableRecorder
          ? "opacity-50 cursor-not-allowed"
          : "hover:opacity-75 active:opacity-50"
      }`}
    >
      <img src="/recorder.png" alt="recorder" className="h-16" />
      {isRecording && <span className="flash-light"></span>}
    </button>
  );
};

export default RecordButton;
