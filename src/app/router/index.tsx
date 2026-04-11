import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { MainLayout } from '../layouts/MainLayout';
import LoginPage from '@/src/features/auth/pages/LoginPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
