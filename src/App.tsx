import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import VideoDetail from './pages/VideoDetail';
import ScreenshotDetail from './pages/ScreenshotDetail';
// import Archive from './pages/Archive';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/routes/PrivateRoute';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Home />} />
        <Route path="videos/:id" element={<VideoDetail />} />
        <Route path="screenshots/:id" element={<ScreenshotDetail />} />
        {/* <Route path="archive" element={<Archive />} /> */}
      </Route>
    </Routes>
  );
}

export default App;