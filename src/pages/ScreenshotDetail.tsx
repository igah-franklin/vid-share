import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Share2, 
  Download, 
  Edit, 
  Trash, 
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import AuthContext from '../context/AuthContext';

interface Screenshot {
  _id: string;
  title: string;
  description: string;
  filename: string;
  imageUrl: string;
  isPublic: boolean;
  status: string;
  createdAt: string;
}

const ScreenshotDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [screenshot, setScreenshot] = useState<Screenshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    const fetchScreenshot = async () => {
      setLoading(true);
      
      try {
        const res = await axios.get(`/api/screenshots/${id}`);
        setScreenshot(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || '');
      } catch (err) {
        console.error('Error fetching screenshot:', err);
        setError('Failed to load screenshot');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchScreenshot();
    }
  }, [id]);

  const handleSaveChanges = async () => {
    try {
      const res = await axios.put(`/api/screenshots/${id}`, {
        title,
        description
      });
      
      setScreenshot(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating screenshot:', err);
      setError('Failed to update screenshot');
    }
  };

  const handleDeleteScreenshot = async () => {
    if (!window.confirm('Are you sure you want to delete this screenshot?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/screenshots/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Error deleting screenshot:', err);
      setError('Failed to delete screenshot');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error || !screenshot) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Screenshot not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 flex items-center text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to screenshots
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
        Back to screenshots
      </button>
      
      <div className="bg-black rounded-lg overflow-hidden mb-6 border border-gray-200">
        <img 
          src={screenshot.imageUrl} 
          alt={screenshot.title}
          className="w-full h-auto"
        />
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
              <h1 className="text-2xl font-bold text-gray-900">{screenshot.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>{formatDistanceToNow(new Date(screenshot.createdAt), { addSuffix: true })}</span>
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
                onClick={handleDeleteScreenshot}
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
              {screenshot.description ? (
                <p className="text-gray-700 mt-2">{screenshot.description}</p>
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

export default ScreenshotDetail;