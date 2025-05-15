import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import RecordingModal from '../video/RecordingModal';

const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [recordingMode, setRecordingMode] = useState<'video' | 'screenshot'>('video');

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const openRecordingModal = (mode: 'video' | 'screenshot') => {
    setRecordingMode(mode);
    setIsRecordingModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          openRecordingModal={openRecordingModal} 
        />
        
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-50">
          <Outlet />
        </main>
      </div>

      {isRecordingModalOpen && (
        <RecordingModal 
          isOpen={isRecordingModalOpen} 
          onClose={() => setIsRecordingModalOpen(false)}
          mode={recordingMode}
        />
      )}
    </div>
  );
};

export default Layout;