import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export const CTASection = () => {
  return (
    <section className="py-24 px-6">
      <Card padding="lg" className="max-w-5xl mx-auto md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/10 blur-[100px] rounded-full" />
        
        <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10">Ready to elevate your <br /> <span className="text-brand-purple">research game?</span></h2>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto relative z-10">
          Join thousands of researchers, students, and professionals who are already using ::-1 to unlock the full potential of their documents.
        </p>
        <Link to="/dashboard" className="relative z-10">
          <Button size="lg" glow>
            Get Started for Free <ChevronRight size={24} />
          </Button>
        </Link>
      </Card>
    </section>
  );
};
