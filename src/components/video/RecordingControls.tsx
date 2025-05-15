import React, { useState } from 'react';
import { Video, Pause, Square, RotateCcw, Trash2, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecordingControlsProps {
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onDelete: () => void;
  isPaused: boolean;
  elapsedTime: number;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  onStop,
  onPause,
  onResume,
  onDelete,
  isPaused,
  elapsedTime
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-6 z-50 bg-neutral-900/90 backdrop-blur-sm rounded-full shadow-lg overflow-hidden"
    >
      <div className="flex items-center p-2 text-white">
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mr-3">
          <Video size={18} />
        </div>

        <div className="flex items-center space-x-4 px-3">
          <button 
            onClick={isPaused ? onResume : onPause}
            className="hover:text-accent-300 transition-colors p-2"
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>

          <button 
            onClick={onStop}
            className="hover:text-accent-300 transition-colors p-2"
          >
            <Square size={20} />
          </button>

          <div className="font-medium min-w-[60px] mx-2">
            {formatTime(elapsedTime)}
          </div>

          <button 
            onClick={onDelete}
            className="text-red-500 hover:text-red-400 transition-colors p-2"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecordingControls;