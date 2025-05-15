import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Share2, 
  Download, 
  Edit, 
  Trash, 
  ArrowLeft,
  Clock,
  Eye
} from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import AuthContext from '../context/AuthContext';

interface Video {
  _id: string;
  title: string;
  description: string;
  filename: string;
  duration: number;
  views: number;
  isPublic: boolean;
  status: string;
  createdAt: string;
}

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || '');
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchVideo();
    }
  }, [id]);

  const handleSaveChanges = async () => {
    try {
      const res = await axios.put(`/api/videos/${id}`, {
        title,
        description
      });
      
      setVideo(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating video:', err);
      setError('Failed to update video');
    }
  };

  const handleDeleteVideo = async () => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/videos/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Error deleting video:', err);
      setError('Failed to delete video');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Video not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 flex items-center text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to videos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-purple-600 hover:text-purple-700"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to videos
      </button>
      
      <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video flex items-center justify-center">
        <video 
          controls 
          className="w-full h-full"
          poster="/uploads/thumbnails/default.jpg"
          src={`/uploads/videos/${video.filename}`}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      
      {isEditing ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSaveChanges}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium"
            >
              Save changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1.5" />
                  <span>{formatTime(video.duration)}</span>
                </div>
                <div className="flex items-center">
                  <Eye size={16} className="mr-1.5" />
                  <span>{video.views} view{video.views !== 1 ? 's' : ''}</span>
                </div>
                <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              >
                <Edit size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <Share2 size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <Download size={18} />
              </button>
              <button
                onClick={handleDeleteVideo}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 mt-6">
            <div className="h-10 w-10 bg-purple-700 text-white rounded-full flex items-center justify-center text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              {video.description ? (
                <p className="text-gray-700 mt-2">{video.description}</p>
              ) : (
                <p className="text-gray-500 italic mt-2">No description</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetail;