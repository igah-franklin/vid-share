
import React, { useState } from 'react';
import { Video, Pause, Square, SkipBack, RotateCcw, Trash2, Play } from 'lucide-react';
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
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={position}
      animate={position}
      onDragEnd={(e, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
      }}
      className="fixed z-50 bg-neutral-900/90 backdrop-blur-sm rounded-full shadow-lg overflow-hidden"
    >
      <div className="flex items-center p-3 px-4 text-white">
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mr-3 animate-pulse">
          <Video size={18} />
        </div>
        
        <div className="flex items-center space-x-4">
          {isPaused ? (
            <button 
              onClick={onResume}
              className="hover:text-accent-300 transition-colors"
            >
              <Play size={20} />
            </button>
          ) : (
            <button 
              onClick={onPause}
              className="hover:text-accent-300 transition-colors"
            >
              <Pause size={20} />
            </button>
          )}
          
          <button 
            onClick={onStop}
            className="hover:text-accent-300 transition-colors"
          >
            <Square size={20} />
          </button>
          
          <div className="font-medium min-w-[60px]">
            {formatTime(elapsedTime)}
          </div>
          
          <button 
            onClick={onDelete}
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecordingControls;
