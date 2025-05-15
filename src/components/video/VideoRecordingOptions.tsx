import React, { useState } from 'react';
import { Monitor, Camera, CameraOff, Mic, MicOff, MoreHorizontal, Paintbrush, MessageCircleOff } from 'lucide-react';

interface VideoRecordingOptionsProps {
  startRecording: () => void;
  onOptionChange: (option: 'camera' | 'microphone', value: boolean) => void;
}

const VideoRecordingOptions: React.FC<VideoRecordingOptionsProps> = ({ startRecording, onOptionChange }) => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  
  const handleCameraToggle = () => {
    const newValue = !cameraEnabled;
    setCameraEnabled(newValue);
    onOptionChange('camera', newValue);
  };
  
  const handleMicToggle = () => {
    const newValue = !micEnabled;
    setMicEnabled(newValue);
    onOptionChange('microphone', newValue);
  };
  
  return (
    <div className="space-y-6">
      <button className="w-full py-4 px-4 rounded-xl bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 transition-colors">
        <Monitor className="mr-3" size={20} />
        <span className="font-medium">Full Screen</span>
      </button>
      
      <div className="space-y-4">
        <button 
          onClick={handleCameraToggle}
          className="w-full py-4 px-4 rounded-xl bg-neutral-800 text-white flex items-center justify-between hover:bg-neutral-700 transition-colors"
        >
          <div className="flex items-center">
            {cameraEnabled ? <Camera size={20} className="mr-3" /> : <CameraOff size={20} className="mr-3 text-accent-500" />}
            <span className="font-medium">{cameraEnabled ? "Camera" : "No Camera"}</span>
          </div>
          <div className={`w-12 h-6 rounded-full flex items-center ${cameraEnabled ? 'bg-primary-600 justify-end' : 'bg-neutral-700 justify-start'} p-1`}>
            <div className="w-4 h-4 rounded-full bg-white"></div>
          </div>
        </button>
        
        <button 
          onClick={handleMicToggle}
          className="w-full py-4 px-4 rounded-xl bg-neutral-800 text-white flex items-center justify-between hover:bg-neutral-700 transition-colors"
        >
          <div className="flex items-center">
            {micEnabled ? <Mic size={20} className="mr-3" /> : <MicOff size={20} className="mr-3 text-accent-500" />}
            <span className="font-medium">{micEnabled ? "Microphone" : "No microphone"}</span>
          </div>
          <div className={`w-12 h-6 rounded-full flex items-center ${micEnabled ? 'bg-primary-600 justify-end' : 'bg-neutral-700 justify-start'} p-1`}>
            <div className="w-4 h-4 rounded-full bg-white"></div>
          </div>
        </button>
      </div>
      
      <button 
        onClick={startRecording}
        className="w-full py-4 rounded-xl bg-accent-500 text-white font-medium hover:bg-accent-600 transition-colors"
      >
        Start Recording
      </button>
      
      <div className="flex justify-between items-center pt-4 text-neutral-400 text-sm">
        <div className="flex space-x-6">
          <button className="flex flex-col items-center">
            <Paintbrush size={18} />
            <span className="mt-1">Effects</span>
          </button>
          <button className="flex flex-col items-center">
            <MessageCircleOff size={18} />
            <span className="mt-1">Blur</span>
          </button>
          <button className="flex flex-col items-center">
            <MoreHorizontal size={18} />
            <span className="mt-1">More</span>
          </button>
        </div>
        <div>
          <span className="text-neutral-500">5 min recording limit</span>
        </div>
      </div>
    </div>
  );
};

export default VideoRecordingOptions;