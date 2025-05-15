import React, { useContext, useEffect, useState } from 'react';
import { FolderPlus, ChevronDown } from 'lucide-react';
import MediaContext from '../context/MediaContext';
import AuthContext from '../context/AuthContext';
import VideoCard from '../components/video/VideoCard';
import ScreenshotCard from '../components/screenshot/ScreenshotCard';

const Home: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { 
    videos, 
    screenshots, 
    archivedMedia,
    loading, 
    activeTab, 
    sortOrder,
    setActiveTab, 
    setSortOrder,
    fetchVideos,
    fetchScreenshots,
    fetchArchivedMedia,
    openRecordingModal
  } = useContext(MediaContext);

  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'videos') {
      fetchVideos();
    } else if (activeTab === 'screenshots') {
      fetchScreenshots();
    } else {
      fetchArchivedMedia();
    }
  }, [activeTab]);

  const handleTabChange = (tab: 'videos' | 'screenshots' | 'archive') => {
    setActiveTab(tab);
  };

  const getSortedMedia = () => {
    let mediaToSort = activeTab === 'videos' 
      ? videos 
      : activeTab === 'screenshots' 
        ? screenshots 
        : archivedMedia;

    return [...mediaToSort].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'views' && 'views' in a && 'views' in b) {
        return b.views - a.views;
      } else if (sortOrder === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const sortedMedia = getSortedMedia();

  return (
    <div className="w-full max-w-7xl mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gray-500 text-sm">My Library</h1>
          <h2 className="text-2xl font-bold text-gray-900">Videos</h2>
        </div>
        
        <div className="flex gap-3">
          <button className="border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 flex items-center gap-2">
            <FolderPlus size={16} />
            <span>New folder</span>
          </button>
          
          <button 
            onClick={openRecordingModal}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2"
          >
            <span>New video</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('videos')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeTab === 'videos'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => handleTabChange('screenshots')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeTab === 'screenshots'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Screenshots
          </button>
          <button
            onClick={() => handleTabChange('archive')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeTab === 'archive'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Archive
          </button>
        </nav>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-gray-900">
          {activeTab === 'videos' 
            ? 'Videos' 
            : activeTab === 'screenshots' 
              ? 'Screenshots' 
              : 'Archived Items'}
        </h3>
        
        <div className="relative">
          <button
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
            className="border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center gap-2"
          >
            <span>
              {sortOrder === 'newest' 
                ? 'Newest to Oldest' 
                : sortOrder === 'oldest' 
                  ? 'Oldest to Newest' 
                  : sortOrder === 'views' 
                    ? 'Most Viewed' 
                    : 'Alphabetical'}
            </span>
            <ChevronDown size={14} />
          </button>
          
          {sortMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <button
                onClick={() => {
                  setSortOrder('newest');
                  setSortMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortOrder === 'newest' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Newest to Oldest
              </button>
              <button
                onClick={() => {
                  setSortOrder('oldest');
                  setSortMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortOrder === 'oldest' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Oldest to Newest
              </button>
              <button
                onClick={() => {
                  setSortOrder('views');
                  setSortMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortOrder === 'views' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Most Viewed
              </button>
              <button
                onClick={() => {
                  setSortOrder('alphabetical');
                  setSortMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortOrder === 'alphabetical' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Alphabetical
              </button>
            </div>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      ) : sortedMedia.length === 0 ? (
        <div className="bg-gray-50 rounded-lg py-16 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === 'videos' 
              ? 'videos' 
              : activeTab === 'screenshots' 
                ? 'screenshots' 
                : 'archived items'} yet
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'archive' 
              ? 'Items you archive will appear here' 
              : 'Create your first recording to get started'}
          </p>
          {activeTab !== 'archive' && (
            <button
              onClick={openRecordingModal}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-medium"
            >
              Create new {activeTab === 'videos' ? 'video' : 'screenshot'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* {sortedMedia.map((media) => (
            'duration' in media ? (
              <VideoCard
                key={media._id}
                id={media._id}
                title={media.title}
                thumbnailUrl={media.thumbnailUrl}
                duration={media.duration}
                createdAt={media.createdAt}
                views={media.views}
                userName={user?.name || 'User'}
                userAvatar={user?.avatar}
              />
            ) : (
              <ScreenshotCard
                key={media._id}
                id={media._id}
                title={media.title}
                imageUrl={media.imageUrl}
                createdAt={media.createdAt}
                userName={user?.name || 'User'}
                userAvatar={user?.avatar}
              />
            )
          ))} */}
          {sortedMedia.map((media) => {
          if (media && typeof media === 'object') {
            return 'duration' in media ? (
              <VideoCard
                key={media._id}
                id={media._id}
                title={media.title}
                thumbnailUrl={media.thumbnailUrl}
                duration={media.duration}
                createdAt={media.createdAt}
                views={media.views}
                userName={user?.name || 'User'}
                userAvatar={user?.avatar}
              />
            ) : (
              <ScreenshotCard
                key={media._id}
                id={media._id}
                title={media.title}
                imageUrl={media.imageUrl}
                createdAt={media.createdAt}
                userName={user?.name || 'User'}
                userAvatar={user?.avatar}
              />
            );
          }
          return null; // Or handle unexpected cases
        })}
        </div>
      )}
    </div>
  );
};

export default Home;