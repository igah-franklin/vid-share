import React, { useState } from 'react';
import { Maximize } from 'lucide-react';

const ScreenshotOptions: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'custom' | 'tab'>('custom');
  
  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-semibold">Screenshot type</h2>
      
      <div className="flex space-x-4">
        <button 
          onClick={() => setSelectedOption('custom')}
          className={`flex-1 py-6 px-4 rounded-xl flex flex-col items-center justify-center transition-colors ${
            selectedOption === 'custom' 
              ? 'bg-primary-900 border border-primary-500' 
              : 'bg-neutral-800 border border-transparent'
          }`}
        >
          <Maximize size={24} className={`mb-2 ${selectedOption === 'custom' ? 'text-primary-400' : 'text-neutral-400'}`} />
          <span className="text-white">Custom area</span>
        </button>
        
        <button 
          onClick={() => setSelectedOption('tab')}
          className={`flex-1 py-6 px-4 rounded-xl flex flex-col items-center justify-center transition-colors ${
            selectedOption === 'tab' 
              ? 'bg-primary-900 border border-primary-500' 
              : 'bg-neutral-800 border border-transparent'
          }`}
        >
          <div className={`mb-2 ${selectedOption === 'tab' ? 'text-primary-400' : 'text-neutral-400'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 13H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-white">Current tab</span>
        </button>
      </div>
      
      <button className="w-full py-4 rounded-xl bg-accent-500 text-white font-medium hover:bg-accent-600 transition-colors">
        Select area
      </button>
    </div>
  );
};

export default ScreenshotOptions;