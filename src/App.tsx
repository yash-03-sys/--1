import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from '@/src/pages/Landing';
import Login from '@/src/pages/Login';
import Dashboard from '@/src/pages/Dashboard';
import Workspace from '@/src/pages/Workspace';
import Settings from '@/src/pages/Settings';
import SourceMap from '@/src/pages/SourceMap';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sourcemap" element={<SourceMap />} />
      </Routes>
    </Router>
  );
}

