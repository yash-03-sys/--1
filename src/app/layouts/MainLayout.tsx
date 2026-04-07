import { ReactNode } from 'react';
import { Navbar } from '@/src/components/common/Navbar';
import { Footer } from '@/src/components/common/Footer';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
