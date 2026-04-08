import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import LandingPage from '@/src/features/landing/pages/LandingPage';
import DashboardPage from '@/src/features/documents/pages/DashboardPage';
import WorkspacePage from '@/src/features/workspace/pages/WorkspacePage';
import SettingsPage from '@/src/features/settings/pages/SettingsPage';
import SourceMapPage from '@/src/features/source-map/pages/SourceMapPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.LANDING} element={<LandingPage />} />
      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      <Route path={ROUTES.WORKSPACE} element={<WorkspacePage />} />
      <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      <Route path={ROUTES.SOURCE_MAP} element={<SourceMapPage />} />
    </Routes>
  );
};
