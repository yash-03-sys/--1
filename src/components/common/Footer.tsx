import { Link } from 'react-router-dom';
import { BrandMark } from './BrandMark';

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-bg-dark">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <BrandMark size="sm" />
        
        <div className="flex gap-8 text-sm text-gray-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="text-sm text-gray-500">
          © 2026 Colon Colon Minus One. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
