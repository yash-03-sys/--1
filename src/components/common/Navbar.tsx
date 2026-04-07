import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { BrandMark } from './BrandMark';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
        <BrandMark />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link>
          <Link to="/#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it Works</Link>
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
          <Link to="/dashboard">
            <Button size="sm" className="flex items-center gap-2">
              Start Research <ChevronRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-6 right-6 glass-panel rounded-2xl p-6 flex flex-col gap-4"
        >
          <Link to="/#features" className="text-lg text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>Features</Link>
          <Link to="/#how-it-works" className="text-lg text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>How it Works</Link>
          <hr className="border-white/10" />
          <Link to="/login" className="text-lg text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
            <Button className="w-full">Start Research</Button>
          </Link>
        </motion.div>
      )}
    </nav>
  );
};
