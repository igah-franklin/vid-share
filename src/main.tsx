import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { MediaProvider } from './context/MediaContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MediaProvider>
          <App />
        </MediaProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);