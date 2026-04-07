import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-bg-dark">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-xs">
            ::
          </div>
          <span className="text-lg font-bold tracking-tighter" aria-label="Colon Colon Minus One">::-1</span>
        </div>
        
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
}
