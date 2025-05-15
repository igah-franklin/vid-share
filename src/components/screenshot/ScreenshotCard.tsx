import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Eye, MessageSquare, Share2 } from 'lucide-react';

interface ScreenshotCardProps {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  views: number;
  comments?: number;
  user: {
    name: string;
    avatarUrl?: string;
  };
}

const ScreenshotCard: React.FC<ScreenshotCardProps> = ({
  id,
  title,
  imageUrl,
  createdAt,
  views,
  comments = 0,
  user
}) => {
  return (
    <Link to={`/screenshots/${id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-soft transition-shadow duration-300 hover:shadow-medium">
        <div className="relative overflow-hidden aspect-video">
          <img 
            src={imageUrl || 'https://images.pexels.com/photos/16129877/pexels-photo-16129877/free-photo-of-code-on-a-screen.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="p-3">
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex-shrink-0 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-200 text-primary-700 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-neutral-800 line-clamp-1">{title}</h3>
              <div className="flex items-center text-xs text-neutral-500 mt-1">
                <span>{user.name}</span>
                <span className="mx-1">•</span>
                <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
              </div>
              
              <div className="flex items-center mt-2 space-x-3 text-xs text-neutral-500">
                <div className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  <span>{views}</span>
                </div>
                
                <div className="flex items-center">
                  <MessageSquare size={14} className="mr-1" />
                  <span>{comments}</span>
                </div>
                
                <button className="ml-auto text-neutral-500 hover:text-primary-600">
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ScreenshotCard;