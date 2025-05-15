import React, { useState } from 'react';
import { Search, Camera, Video, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  openRecordingModal: (mode: 'video' | 'screenshot') => void;
}

const Header: React.FC<HeaderProps> = ({ openRecordingModal }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between">
      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-neutral-400" />
        </div>
        <input
          type="text"
          placeholder="Search for people, tags, folders, Spaces, and Looms"
          className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-sm text-neutral-600">
          <span className="font-medium text-primary-700">23</span>/25 videos
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 relative"
          >
            <button 
              onClick={() => openRecordingModal('video')}
              className="btn btn-primary flex items-center space-x-2 mr-2"
            >
              <Video size={18} />
              <span>Record</span>
            </button>
            <ChevronDown size={16} className="text-primary-700" />
          </button>
          
          {isDropdownOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-medium z-10"
            >
              <div className="py-1">
                <button 
                  onClick={() => {
                    openRecordingModal('video');
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                >
                  <Video size={16} className="mr-2" />
                  Record video
                </button>
                <button 
                  onClick={() => {
                    openRecordingModal('screenshot');
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                >
                  <Camera size={16} className="mr-2" />
                  Take screenshot
                </button>
              </div>
            </motion.div>
          )}
        </div>
        
        <button className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-medium overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;