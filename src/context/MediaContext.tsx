import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import { BASE_URL } from "../baseurl";

interface Video {
  _id: string;
  title: string;
  description?: string;
  filename: string;
  duration: number;
  thumbnailUrl?: string;
  isPublic: boolean;
  views: number;
  status: "processing" | "ready" | "error" | "archived";
  createdAt: string;
}

interface Screenshot {
  _id: string;
  title: string;
  description?: string;
  filename: string;
  imageUrl: string;
  isPublic: boolean;
  status: "ready" | "error" | "archived";
  createdAt: string;
}

interface RecordingOptions {
  screen: boolean;
  audio: boolean;
  camera: boolean;
  cameraPosition?: "pip" | "side";
}

interface MediaContextType {
  videos: Video[];
  screenshots: Screenshots[];
  archivedMedia: (Video | Screenshot)[];
  loading: boolean;
  activeTab: "videos" | "screenshots" | "archive";
  sortOrder: "newest" | "oldest" | "views" | "alphabetical";
  recordingOptions: RecordingOptions;
  isRecording: boolean;
  recordingPaused: boolean;
  recordingTime: number;
  isRecordingModalOpen: boolean;
  setActiveTab: (tab: "videos" | "screenshots" | "archive") => void;
  setSortOrder: (order: "newest" | "oldest" | "views" | "alphabetical") => void;
  fetchVideos: () => Promise<void>;
  fetchScreenshots: () => Promise<void>;
  fetchArchivedMedia: () => Promise<void>;
  startRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => Promise<string | null>;
  takeScreenshot: (type: "full" | "area" | "tab") => Promise<string | null>;
  openRecordingModal: () => void;
  closeRecordingModal: () => void;
  updateRecordingOptions: (options: Partial<RecordingOptions>) => void;
  archiveMedia: (id: string, type: "video" | "screenshot") => Promise<void>;
  deleteMedia: (id: string, type: "video" | "screenshot") => Promise<void>;
}

export const MediaContext = createContext<MediaContextType>({
  videos: [],
  screenshots: [],
  archivedMedia: [],
  loading: false,
  activeTab: "videos",
  sortOrder: "newest",
  recordingOptions: {
    screen: true,
    audio: true,
    camera: false,
    cameraPosition: "pip",
  },
  isRecording: false,
  recordingPaused: false,
  recordingTime: 0,
  isRecordingModalOpen: false,
  setActiveTab: () => {},
  setSortOrder: () => {},
  fetchVideos: async () => {},
  fetchScreenshots: async () => {},
  fetchArchivedMedia: async () => {},
  startRecording: async () => null,
  pauseRecording: () => {},
  resumeRecording: () => {},
  stopRecording: async () => null,
  takeScreenshot: async () => null,
  openRecordingModal: () => {},
  closeRecordingModal: () => {},
  updateRecordingOptions: () => {},
  archiveMedia: async () => {},
  deleteMedia: async () => {},
});

interface MediaProviderProps {
  children: ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [videos, setVideos] = useState<Video[]>([]);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [archivedMedia, setArchivedMedia] = useState<(Video | Screenshot)[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "videos" | "screenshots" | "archive"
  >("videos");
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "views" | "alphabetical"
  >("newest");

  const [recordingOptions, setRecordingOptions] = useState<RecordingOptions>({
    screen: true,
    audio: true,
    camera: false,
    cameraPosition: "pip",
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingPaused, setRecordingPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);

  const fetchVideos = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/videos");
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchScreenshots = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/screenshots`);
      setScreenshots(res.data);
    } catch (err) {
      console.error("Error fetching screenshots:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArchivedMedia = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const [videosRes, screenshotsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/videos/archived`),
        axios.get(`${BASE_URL}/api/screenshots/archived`),
      ]);

      const combined = [...videosRes.data, ...screenshotsRes.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setArchivedMedia(combined);
    } catch (err) {
      console.error("Error fetching archived media:", err);
    } finally {
      setLoading(false);
    }
  };

  const openRecordingModal = () => {
    setIsRecordingModalOpen(true);
  };

  const closeRecordingModal = () => {
    setIsRecordingModalOpen(false);
  };

  const updateRecordingOptions = (options: Partial<RecordingOptions>) => {
    setRecordingOptions((prev) => ({ ...prev, ...options }));
  };

  const startRecording = async (): Promise<void> => {
    try {
      // Request user permissions
      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: {
          cursor: "always",
        },
        audio: recordingOptions.audio,
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

        // In a real application, we would combine these streams with a canvas
        // For MVP, we'll just use the screen stream
        // TODO: Implement picture-in-picture with camera
      }

      // Create recorder
      const recorder = new MediaRecorder(finalStream, {
        mimeType: "video/webm;codecs=vp9",
      });

      // Set up event handlers
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      // Reset chunks
      setRecordedChunks([]);

      // Start recording
      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingPaused(false);
      setRecordingTime(0);

      // Start timer
      const timerInterval = setInterval(() => {
        if (!recordingPaused) {
          setRecordingTime((prev) => prev + 1);
        }
      }, 1000);

      // Clean up when recording stops
      recorder.onstop = () => {
        clearInterval(timerInterval);
        screenStream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };
    } catch (err) {
      console.error("Error starting recording:", err);
      alert(
        "Could not start recording. Please ensure you have granted the necessary permissions.",
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && isRecording && !recordingPaused) {
      mediaRecorder.pause();
      setRecordingPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && isRecording && recordingPaused) {
      mediaRecorder.resume();
      setRecordingPaused(false);
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    if (!mediaRecorder) return null;

    return new Promise((resolve) => {
      mediaRecorder.onstop = async () => {
        try {
          // Create a blob from the recorded chunks
          const blob = new Blob(recordedChunks, {
            type: "video/webm",
          });

          // Create form data to upload
          const formData = new FormData();
          formData.append("video", blob, `recording-${Date.now()}.webm`);
          formData.append("title", `Recording ${new Date().toLocaleString()}`);
          formData.append("duration", recordingTime.toString());
          formData.append("isPublic", "false");

          // Upload to server
          const response = await axios.post(
            `${BASE_URL}/api/videos`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          // Refresh videos list
          fetchVideos();

          // Return the video ID for redirection
          resolve(response.data._id);
        } catch (err) {
          console.error("Error uploading recording:", err);
          resolve(null);
        }
      };

      // Stop the recording
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
      setRecordingPaused(false);
    });
  };

  const takeScreenshot = async (
    type: "full" | "area" | "tab",
  ): Promise<string | null> => {
    try {
      // Request user permissions
      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: {
          cursor: "always",
        },
        audio: false,
      };

      // Get screen stream
      const stream =
        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

      // Create video element to capture screenshot
      const video = document.createElement("video");
      video.srcObject = stream;

      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();

          // Wait a bit to ensure video is playing
          setTimeout(() => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Stop all tracks
            stream.getTracks().forEach((track) => track.stop());

            // Convert to blob
            canvas.toBlob(async (blob) => {
              if (blob) {
                // Create form data to upload
                const formData = new FormData();
                formData.append(
                  "screenshot",
                  blob,
                  `screenshot-${Date.now()}.png`,
                );
                formData.append(
                  "title",
                  `Screenshot ${new Date().toLocaleString()}`,
                );
                formData.append("isPublic", "false");

                try {
                  // Upload to server
                  const response = await axios.post(
                    `${BASE_URL}/api/screenshots`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    },
                  );

                  // Refresh screenshots list
                  fetchScreenshots();

                  // Return the screenshot ID for redirection
                  resolve(response.data._id);
                } catch (err) {
                  console.error("Error uploading screenshot:", err);
                  resolve(null);
                }
              } else {
                resolve(null);
              }
            }, "image/png");
          }, 100);
        };
      });
    } catch (err) {
      console.error("Error taking screenshot:", err);
      return null;
    }
  };

  const archiveMedia = async (id: string, type: "video" | "screenshot") => {
    try {
      if (type === "video") {
        await axios.put(`${BASE_URL}/api/videos/${id}/archive`);
        fetchVideos();
      } else {
        await axios.put(`${BASE_URL}/api/screenshots/${id}/archive`);
        fetchScreenshots();
      }
      fetchArchivedMedia();
    } catch (err) {
      console.error(`Error archiving ${type}:`, err);
    }
  };

  const deleteMedia = async (id: string, type: "video" | "screenshot") => {
    try {
      if (type === "video") {
        await axios.delete(`${BASE_URL}/api/videos/${id}`);
        fetchVideos();
      } else {
        await axios.delete(`${BASE_URL}/api/screenshots/${id}`);
        fetchScreenshots();
      }
      fetchArchivedMedia();
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
    }
  };

  return (
    <MediaContext.Provider
      value={{
        videos,
        screenshots,
        archivedMedia,
        loading,
        activeTab,
        sortOrder,
        recordingOptions,
        isRecording,
        recordingPaused,
        recordingTime,
        isRecordingModalOpen,
        setActiveTab,
        setSortOrder,
        fetchVideos,
        fetchScreenshots,
        fetchArchivedMedia,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        takeScreenshot,
        openRecordingModal,
        closeRecordingModal,
        updateRecordingOptions,
        archiveMedia,
        deleteMedia,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaContext;
