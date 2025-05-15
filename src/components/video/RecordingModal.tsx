import React, { useState } from "react";
import { X, Monitor, Camera, Mic, MicOff, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ScreenshotOptions from "../screenshot/ScreenshotOptions";
import VideoRecordingOptions from "./VideoRecordingOptions";
import RecordingControls from "./RecordingControls";
import { BASE_URL } from "../../baseurl";

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "video" | "screenshot";
}

const RecordingModal: React.FC<RecordingModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"video" | "screenshot">(initialMode);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingOptions, setRecordingOptions] = useState({
    camera: false,
    microphone: true,
  });

  const handleOptionChange = (
    option: "camera" | "microphone",
    value: boolean,
  ) => {
    setRecordingOptions((prev) => ({ ...prev, [option]: value }));
  };

  const startRecording = async () => {
    try {
      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: {
          cursor: "always",
        },
        audio: recordingOptions.microphone,
      };

      // Get screen stream
      const screenStream =
        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

      let finalStream = screenStream;

      // Add camera if enabled
      if (recordingOptions.camera) {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        // In a real app, we would combine streams here
      }

      const recorder = new MediaRecorder(finalStream, {
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: 2500000,
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      setRecordedChunks([]);
      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
      onClose();

      // Start timer
      const timerInterval = setInterval(() => {
        if (!isPaused) {
          setElapsedTime((prev) => prev + 1);
        }
      }, 1000);

      recorder.onstop = async () => {
        clearInterval(timerInterval);
        screenStream.getTracks().forEach((track) => track.stop());

        // Create blob and upload
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const formData = new FormData();
        formData.append("video", blob, `recording-${Date.now()}.webm`);
        formData.append("title", `Recording ${new Date().toLocaleString()}`);
        const duration = Math.round((blob.size / (1024 * 1024)) * 8); // Rough estimate based on file size
        formData.append("duration", duration.toString());
        formData.append("status", "ready");
        formData.append("isPublic", "false");

        console.log(blob, "*****");

        try {
          const response = await axios.post(
            `${BASE_URL}/api/videos`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          navigate(`/videos/${response.data._id}`);
        } catch (err) {
          console.error("Error uploading recording:", err);
          alert("Failed to save recording. Please try again.");
        }
      };
    } catch (err) {
      console.error("Error starting recording:", err);
      alert(
        "Could not start recording. Please ensure you have granted the necessary permissions.",
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && !isPaused) {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const deleteRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
    setIsRecording(false);
    setIsPaused(false);
    setElapsedTime(0);
    setRecordedChunks([]);
  };

  if (!isOpen && !isRecording) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-neutral-900 rounded-2xl shadow-lg overflow-hidden max-w-lg w-full"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMode("video")}
                  className={`rounded-full p-2 ${mode === "video" ? "bg-primary-700 text-white" : "bg-neutral-800 text-neutral-400"}`}
                >
                  <Monitor size={20} />
                </button>
                <button
                  onClick={() => setMode("screenshot")}
                  className={`rounded-full p-2 ${mode === "screenshot" ? "bg-primary-700 text-white" : "bg-neutral-800 text-neutral-400"}`}
                >
                  <Camera size={20} />
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <AnimatePresence mode="wait">
                {mode === "video" ? (
                  <VideoRecordingOptions
                    key="video"
                    startRecording={startRecording}
                    onOptionChange={handleOptionChange}
                  />
                ) : (
                  <ScreenshotOptions key="screenshot" />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}

      {isRecording && (
        <RecordingControls
          onStop={stopRecording}
          onPause={pauseRecording}
          onResume={resumeRecording}
          onDelete={deleteRecording}
          isPaused={isPaused}
          elapsedTime={elapsedTime}
        />
      )}
    </>
  );
};

export default RecordingModal;
