import React, { useState } from 'react';
import { Video, Pause, Square, SkipBack, RotateCcw, Trash2 } from 'lucide-react';
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: 20, y: window.innerHeight - 100 }}
      animate={position}
      onDragEnd={(e, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
      }}
      className="fixed z-50 bg-neutral-900 rounded-full shadow-lg overflow-hidden"
    >
      <div className="flex items-center p-2 px-3 text-white">
        <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center mr-3">
          <Video size={18} />
        </div>
        
        <div className="flex items-center space-x-4">
          {isPaused ? (
            <button 
              onClick={onResume}
              className="text-white hover:text-accent-300"
            >
              <Video size={18} />
            </button>
          ) : (
            <button 
              onClick={onPause}
              className="text-white hover:text-accent-300"
            >
              <Pause size={18} />
            </button>
          )}
          
          <button 
            onClick={onStop}
            className="text-white hover:text-accent-300"
          >
            <Square size={18} />
          </button>
          
          <button className="text-white hover:text-accent-300">
            <SkipBack size={18} />
          </button>
          
          <div className="text-white font-medium">
            {formatTime(elapsedTime)}
          </div>
          
          <button className="text-white hover:text-accent-300">
            <RotateCcw size={18} />
          </button>
          
          <button 
            onClick={onDelete}
            className="text-accent-500 hover:text-accent-300"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecordingControls;